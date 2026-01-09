#!/usr/bin/env python3
"""
Generation Review Tool

Parse generation logs and compile successful fragments with stats.

Usage:
    python review_generations.py           # List all successful generations
    python review_generations.py --all     # Include failed/incomplete ones
    python review_generations.py --show 3  # Show fragment #3 in full
    python review_generations.py --json    # Output as JSON
    python review_generations.py --stats   # Show aggregate statistics
"""

import os
import re
import json
import argparse
from pathlib import Path
from dataclasses import dataclass, asdict, field
from datetime import datetime
from typing import Optional, List


@dataclass
class GenerationResult:
    """Parsed generation result."""
    log_file: str
    timestamp: datetime
    success: bool
    
    # Config
    generation_provider: str = "unknown"
    generation_model: str = "unknown"
    judge_provider: str = "unknown"
    judge_model: str = "unknown"
    candidates_per_chunk: int = 0
    max_chunks: int = 0
    
    # Parameters
    style: str = "unknown"
    collapse_type: str = "unknown"
    target_users: int = 0
    target_messages: int = 0
    
    # Results
    chunks: int = 0
    messages: int = 0
    lines: int = 0
    collapse_detected: bool = False
    total_tokens: int = 0
    total_cost: float = 0.0
    
    # The actual fragment
    fragment: str = ""
    
    # Error if failed
    error: Optional[str] = None


def extract_section(content: str, section_name: str) -> str:
    """Extract a section from the log file.
    
    Sections are formatted as:
    SECTION NAME
    ============================================================
    content here
    
    2024-01-04... (next timestamp marks end)
    """
    # Find the section header
    pattern = rf'{re.escape(section_name)}\n=+\n(.*?)(?=\n\d{{4}}-\d{{2}}-\d{{2}}|\n=+\n[A-Z]|\Z)'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        return match.group(1).strip()
    return ""


def parse_log_file(log_path: Path) -> Optional[GenerationResult]:
    """Parse a generation log file and extract results."""
    try:
        content = log_path.read_text()
    except Exception:
        return None
    
    # Skip empty files
    if not content.strip():
        return None
    
    # Extract timestamp from filename
    match = re.search(r'generation_test_(\d{8})_(\d{6})\.log', log_path.name)
    if match:
        date_str = match.group(1)
        time_str = match.group(2)
        timestamp = datetime.strptime(f"{date_str}_{time_str}", "%Y%m%d_%H%M%S")
    else:
        timestamp = datetime.fromtimestamp(log_path.stat().st_mtime)
    
    result = GenerationResult(
        log_file=log_path.name,
        timestamp=timestamp,
        success=False,
    )
    
    # Parse RUN CONFIGURATION section (new format)
    config_section = extract_section(content, "RUN CONFIGURATION")
    if config_section:
        for line in config_section.split('\n'):
            if ':' in line:
                key, value = line.split(':', 1)
                key, value = key.strip(), value.strip()
                if key == "Generation Provider":
                    result.generation_provider = value
                elif key == "Generation Model":
                    result.generation_model = value
                elif key == "Judge Provider":
                    result.judge_provider = value
                elif key == "Judge Model":
                    result.judge_model = value
                elif key == "Candidates Per Chunk":
                    result.candidates_per_chunk = int(value)
                elif key == "Max Chunks":
                    result.max_chunks = int(value)
    
    # Parse FRAGMENT PARAMETERS section
    params_section = extract_section(content, "FRAGMENT PARAMETERS")
    if params_section:
        for line in params_section.split('\n'):
            if ':' in line:
                key, value = line.split(':', 1)
                key, value = key.strip(), value.strip()
                if key == "Style":
                    result.style = value
                elif key == "Collapse Type":
                    result.collapse_type = value
                elif key == "Target Users":
                    result.target_users = int(value)
                elif key == "Target Messages":
                    result.target_messages = int(value)
    
    # Fallback: extract style/collapse from prompt header if not in params
    if result.style == "unknown":
        header_match = re.search(
            r'\[LOG: #\w+ \| (\d+) users \| (\d+) messages \| (\w+) \| ENDS: (\w+)\]',
            content
        )
        if header_match:
            result.target_users = int(header_match.group(1))
            result.target_messages = int(header_match.group(2))
            result.style = header_match.group(3)
            result.collapse_type = header_match.group(4)
    
    # Parse GENERATION SUMMARY section
    if "GENERATION SUMMARY" in content:
        summary_section = extract_section(content, "GENERATION SUMMARY")
        
        for line in summary_section.split('\n'):
            if ':' in line:
                key, value = line.split(':', 1)
                key, value = key.strip(), value.strip()
                
                if key == "Chunks":
                    result.chunks = int(value)
                elif key == "Messages":
                    result.messages = int(value)
                elif key == "Lines":
                    result.lines = int(value)
                elif key == "Collapse detected":
                    result.collapse_detected = value.lower() == "true"
                elif key == "Total tokens":
                    result.total_tokens = int(value.replace(',', ''))
                elif key == "Total cost":
                    result.total_cost = float(value.replace('$', ''))
    
    # Extract the fragment
    fragment_match = re.search(
        r'FINAL FRAGMENT\n=+\n(.*?)(?:\n\d{4}-\d{2}-\d{2}|\n=+\n|\Z)', 
        content, 
        re.DOTALL
    )
    if fragment_match:
        result.fragment = fragment_match.group(1).strip()
    
    # Determine success: has fragment with collapse detected
    result.success = (
        result.collapse_detected and 
        result.messages > 0 and 
        len(result.fragment) > 100
    )
    
    return result


def format_result(result: GenerationResult, index: int, show_fragment: bool = False) -> str:
    """Format a result for display."""
    status = "✓" if result.success else "✗"
    status_color = "\033[92m" if result.success else "\033[91m"
    reset = "\033[0m"
    dim = "\033[2m"
    bold = "\033[1m"
    cyan = "\033[96m"
    
    gen_model = result.generation_model
    if "/" in gen_model:
        gen_model = gen_model.split("/")[-1]  # Just model name
    judge_model = result.judge_model
    if "/" in judge_model:
        judge_model = judge_model.split("/")[-1]
    
    output = []
    output.append(f"{status_color}{status}{reset} {bold}#{index}{reset} - {result.timestamp.strftime('%Y-%m-%d %H:%M')}")
    output.append(f"   {dim}Style:{reset} {cyan}{result.style}{reset} | {dim}Collapse:{reset} {result.collapse_type}")
    output.append(f"   {dim}Gen:{reset} {gen_model} | {dim}Judge:{reset} {judge_model}")
    output.append(f"   {dim}Messages:{reset} {result.messages}/{result.target_messages} | {dim}Chunks:{reset} {result.chunks} | {dim}Cost:{reset} ${result.total_cost:.2f}")
    
    if show_fragment and result.fragment:
        output.append(f"\n   {bold}Fragment Preview:{reset}")
        for line in result.fragment.split('\n')[:15]:
            output.append(f"   │ {line[:80]}")
        remaining = result.fragment.count('\n') - 15
        if remaining > 0:
            output.append(f"   │ {dim}... ({remaining} more lines){reset}")
    
    return '\n'.join(output)


def main():
    parser = argparse.ArgumentParser(description="Review generation logs")
    parser.add_argument("--all", action="store_true", help="Include failed/incomplete generations")
    parser.add_argument("--show", type=int, help="Show fragment #N in full")
    parser.add_argument("--export", type=int, help="Export fragment #N to a file")
    parser.add_argument("--export-all", action="store_true", help="Export all successful fragments")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    parser.add_argument("--stats", action="store_true", help="Show aggregate statistics")
    parser.add_argument("--preview", action="store_true", help="Show fragment previews in listing")
    parser.add_argument("--logs-dir", type=str, default="logs", help="Logs directory")
    parser.add_argument("--output-dir", type=str, default="exported_fragments", help="Directory for exported fragments")
    args = parser.parse_args()
    
    # Find logs directory
    logs_dir = Path(args.logs_dir)
    if not logs_dir.exists():
        logs_dir = Path(__file__).parent / "logs"
    
    if not logs_dir.exists():
        print(f"Logs directory not found: {logs_dir}")
        return
    
    # Parse all log files
    all_results = []
    for log_file in sorted(logs_dir.glob("generation_test_*.log")):
        result = parse_log_file(log_file)
        if result:
            all_results.append(result)
    
    if not all_results:
        print("No generation logs found.")
        return
    
    # Sort by timestamp (newest first)
    all_results.sort(key=lambda r: r.timestamp, reverse=True)
    
    # Filter if needed
    results = all_results if args.all else [r for r in all_results if r.success]
    
    # Handle --export-all
    if args.export_all:
        output_dir = Path(args.output_dir)
        output_dir.mkdir(exist_ok=True)
        
        successful = [r for r in all_results if r.success]
        
        # Export individual files
        for i, result in enumerate(successful, 1):
            filename = f"irc_{result.style}_{result.collapse_type}_{result.timestamp.strftime('%Y%m%d_%H%M%S')}.txt"
            filepath = output_dir / filename
            
            # Add header to the file
            header_lines = [
                f"# IRC Fragment - {result.style} ({result.collapse_type})",
                f"# Generated: {result.timestamp}",
                f"# Gen: {result.generation_model} | Judge: {result.judge_model}",
                f"# Messages: {result.messages} | Cost: ${result.total_cost:.2f}",
                "",
            ]
            content = '\n'.join(header_lines) + result.fragment
            filepath.write_text(content)
            print(f"Exported: {filename}")
        
        # Also export combined file
        combined_path = output_dir / "all_fragments.txt"
        combined_lines = [
            "=" * 70,
            f"IRC FRAGMENT COLLECTION - {len(successful)} fragments",
            f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
            "=" * 70,
            "",
        ]
        
        for i, result in enumerate(successful, 1):
            combined_lines.extend([
                "=" * 70,
                f"FRAGMENT {i}/{len(successful)}",
                f"Style: {result.style} | Collapse: {result.collapse_type}",
                f"Generated: {result.timestamp.strftime('%Y-%m-%d %H:%M')}",
                f"Gen: {result.generation_model} | Judge: {result.judge_model}",
                f"Messages: {result.messages} | Tokens: {result.total_tokens:,} | Cost: ${result.total_cost:.2f}",
                "=" * 70,
                "",
                result.fragment,
                "",
                "",
            ])
        
        combined_path.write_text('\n'.join(combined_lines))
        print(f"\nExported: all_fragments.txt (combined)")
        
        print(f"\n✓ Exported {len(successful)} fragments to {output_dir}/")
        return
    
    # Handle --export
    if args.export is not None:
        if 1 <= args.export <= len(results):
            result = results[args.export - 1]
            output_dir = Path(args.output_dir)
            output_dir.mkdir(exist_ok=True)
            
            filename = f"irc_{result.style}_{result.collapse_type}_{result.timestamp.strftime('%Y%m%d_%H%M%S')}.txt"
            filepath = output_dir / filename
            filepath.write_text(result.fragment)
            print(f"✓ Exported to {filepath}")
        else:
            print(f"Invalid fragment number. Available: 1-{len(results)}")
        return
    
    # Handle --show
    if args.show is not None:
        if 1 <= args.show <= len(results):
            result = results[args.show - 1]
            print(f"\n{'='*70}")
            print(f"Fragment #{args.show} - {result.style} ({result.collapse_type})")
            print(f"{'='*70}")
            print(f"Generated: {result.timestamp}")
            print(f"Gen Model: {result.generation_model}")
            print(f"Judge Model: {result.judge_model}")
            print(f"Messages: {result.messages}/{result.target_messages} | Chunks: {result.chunks}")
            print(f"Tokens: {result.total_tokens:,} | Cost: ${result.total_cost:.2f}")
            print(f"Log file: {result.log_file}")
            print(f"{'='*70}\n")
            print(result.fragment)
            print(f"\n{'='*70}")
        else:
            print(f"Invalid fragment number. Available: 1-{len(results)}")
        return
    
    # Handle --json
    if args.json:
        output = []
        for r in results:
            d = asdict(r)
            d['timestamp'] = r.timestamp.isoformat()
            output.append(d)
        print(json.dumps(output, indent=2))
        return
    
    # Handle --stats
    if args.stats:
        successful = [r for r in all_results if r.success]
        failed = [r for r in all_results if not r.success]
        
        print(f"\n{'='*60}")
        print("Generation Statistics")
        print(f"{'='*60}\n")
        
        print(f"Total generations: {len(all_results)}")
        print(f"Successful: {len(successful)} ({100*len(successful)/len(all_results):.0f}%)" if all_results else "")
        print(f"Failed/Incomplete: {len(failed)}")
        
        total_cost = sum(r.total_cost for r in all_results)
        total_tokens = sum(r.total_tokens for r in all_results)
        print(f"\nTotal cost: ${total_cost:.2f}")
        print(f"Total tokens: {total_tokens:,}")
        if successful:
            print(f"Avg cost per successful fragment: ${sum(r.total_cost for r in successful)/len(successful):.2f}")
            print(f"Avg messages per fragment: {sum(r.messages for r in successful)/len(successful):.1f}")
            print(f"Avg tokens per fragment: {sum(r.total_tokens for r in successful)/len(successful):,.0f}")
        
        print(f"\n(Note: Token counts are from API responses. Costs are estimated from pricing tables.)")
        
        # By style
        print(f"\nBy Style:")
        styles = {}
        for r in successful:
            styles[r.style] = styles.get(r.style, 0) + 1
        for style, count in sorted(styles.items(), key=lambda x: -x[1]):
            print(f"  {style}: {count}")
        
        # By collapse type
        print(f"\nBy Collapse Type:")
        collapses = {}
        for r in successful:
            collapses[r.collapse_type] = collapses.get(r.collapse_type, 0) + 1
        for collapse, count in sorted(collapses.items(), key=lambda x: -x[1]):
            print(f"  {collapse}: {count}")
        
        # By model
        print(f"\nBy Generation Model:")
        models = {}
        for r in all_results:
            model = r.generation_model
            models[model] = models.get(model, 0) + 1
        for model, count in sorted(models.items(), key=lambda x: -x[1]):
            print(f"  {model}: {count}")
        
        return
    
    # Default: list generations
    label = f"total" if args.all else "successful"
    all_count = len(all_results)
    shown_count = len(results)
    
    print(f"\n{'='*60}")
    print(f"Generation Results ({shown_count} {label} of {all_count} total)")
    print(f"{'='*60}\n")
    
    if not results:
        print("No matching generations found.")
        print(f"Use --all to see all {all_count} generations.")
        return
    
    for i, result in enumerate(results, 1):
        print(format_result(result, i, show_fragment=args.preview))
        print()
    
    print(f"Commands:")
    print(f"  --show N       View fragment #N in full")
    print(f"  --export N     Export fragment #N to file")
    print(f"  --export-all   Export all successful fragments")
    print(f"  --preview      Show fragment previews")
    print(f"  --stats        Aggregate statistics")
    print(f"  --all          Include failed generations")


if __name__ == "__main__":
    main()
