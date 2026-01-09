#!/usr/bin/env python3
"""
IRC Admin CLI

Command-line tools for IRC fragment management.
No HTTP endpoints - direct database access.

Usage:
    python irc_admin.py stats           # Show fragment statistics
    python irc_admin.py list [--limit N] # List recent fragments
    python irc_admin.py rate <id> <1|2|3> # Rate a fragment
    python irc_admin.py delete <id>     # Delete a fragment
    python irc_admin.py generate [--count N] # Generate fragments (requires API keys)
"""

import argparse
import sys
from datetime import datetime, timezone

# Ensure we can import from the aethera package
sys.path.insert(0, ".")


def get_session():
    """Get IRC database session."""
    from aethera.irc.database import get_irc_session
    return get_irc_session()


def cmd_stats(args):
    """Show fragment statistics."""
    from aethera.irc.database import IRCFragmentDB
    from sqlmodel import select
    
    with get_session() as session:
        fragments = list(session.exec(select(IRCFragmentDB)).all())
        
        if not fragments:
            print("No fragments in database.")
            return
        
        # Calculate stats
        total = len(fragments)
        shown = sum(1 for f in fragments if f.times_shown > 0)
        rated = sum(1 for f in fragments if f.manual_rating is not None)
        
        styles = {}
        collapse_types = {}
        for f in fragments:
            styles[f.style] = styles.get(f.style, 0) + 1
            collapse_types[f.collapse_type] = collapse_types.get(f.collapse_type, 0) + 1
        
        avg_quality = sum(f.quality_score or 0 for f in fragments) / total
        
        print(f"\n=== IRC Fragment Statistics ===\n")
        print(f"Total fragments:    {total}")
        print(f"Shown at least once: {shown}")
        print(f"Manually rated:     {rated}")
        print(f"Average quality:    {avg_quality:.2f}")
        print(f"\nBy style:")
        for style, count in sorted(styles.items()):
            print(f"  {style}: {count}")
        print(f"\nBy collapse type:")
        for ctype, count in sorted(collapse_types.items()):
            print(f"  {ctype}: {count}")
        print()


def cmd_list(args):
    """List fragments."""
    from aethera.irc.database import IRCFragmentDB
    from sqlmodel import select
    
    with get_session() as session:
        statement = select(IRCFragmentDB).order_by(
            IRCFragmentDB.generated_at.desc()
        ).limit(args.limit)
        
        fragments = list(session.exec(statement).all())
        
        if not fragments:
            print("No fragments found.")
            return
        
        print(f"\n{'ID':<12} {'Style':<14} {'Collapse':<12} {'Score':<6} {'Rating':<6} {'Shown':<6} {'Messages':<8}")
        print("-" * 80)
        
        for f in fragments:
            score = f"{f.quality_score:.2f}" if f.quality_score else "-"
            rating = str(f.manual_rating) if f.manual_rating else "-"
            msg_count = len(f.messages)
            print(f"{f.id:<12} {f.style:<14} {f.collapse_type:<12} {score:<6} {rating:<6} {f.times_shown:<6} {msg_count:<8}")
        
        print()


def cmd_rate(args):
    """Rate a fragment."""
    from aethera.irc.database import IRCFragmentDB
    
    if args.rating not in (1, 2, 3):
        print("Error: Rating must be 1, 2, or 3")
        sys.exit(1)
    
    with get_session() as session:
        fragment = session.get(IRCFragmentDB, args.id)
        
        if not fragment:
            print(f"Error: Fragment '{args.id}' not found")
            sys.exit(1)
        
        old_rating = fragment.manual_rating
        fragment.manual_rating = args.rating
        session.add(fragment)
        session.commit()
        
        print(f"Rated fragment {args.id}: {old_rating or 'unrated'} → {args.rating}")


def cmd_show(args):
    """Show a fragment's content."""
    from aethera.irc.database import IRCFragmentDB
    
    with get_session() as session:
        fragment = session.get(IRCFragmentDB, args.id)
        
        if not fragment:
            print(f"Error: Fragment '{args.id}' not found")
            sys.exit(1)
        
        print(f"\n=== Fragment {fragment.id} ===")
        print(f"Style: {fragment.style}")
        print(f"Collapse: {fragment.collapse_type}")
        print(f"Pacing: {fragment.pacing}")
        print(f"Quality: {fragment.quality_score or 'unscored'}")
        print(f"Rating: {fragment.manual_rating or 'unrated'}")
        print(f"Shown: {fragment.times_shown} times")
        print(f"\n--- Messages ({len(fragment.messages)}) ---\n")
        
        for msg in fragment.messages:
            nick = msg.get("nick", "")
            content = msg.get("content", "")
            msg_type = msg.get("type", "message")
            
            if msg_type == "message":
                print(f"<{nick}> {content}")
            elif msg_type == "action":
                print(f"* {nick} {content}")
            elif msg_type == "join":
                print(f"*** {nick} has joined")
            elif msg_type == "part":
                print(f"*** {nick} has left ({content})")
            elif msg_type == "quit":
                print(f"*** {nick} has quit ({content})")
            elif msg_type == "kick":
                target = msg.get("meta", {}).get("target", "someone")
                reason = msg.get("meta", {}).get("reason", "")
                print(f"*** {nick} kicked {target} ({reason})")
            elif msg_type == "system":
                print(f"*** {content}")
        
        print()


def cmd_delete(args):
    """Delete a fragment."""
    from aethera.irc.database import IRCFragmentDB
    
    with get_session() as session:
        fragment = session.get(IRCFragmentDB, args.id)
        
        if not fragment:
            print(f"Error: Fragment '{args.id}' not found")
            sys.exit(1)
        
        if not args.force:
            response = input(f"Delete fragment {args.id}? [y/N] ")
            if response.lower() != 'y':
                print("Cancelled.")
                return
        
        session.delete(fragment)
        session.commit()
        print(f"Deleted fragment {args.id}")


def cmd_generate(args):
    """Generate new fragments (requires API keys)."""
    import asyncio
    import os
    
    # Check for API key
    api_key = os.environ.get("IRC_OPENROUTER_API_KEY") or os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        print("Error: No API key found.")
        print("Set IRC_OPENROUTER_API_KEY or OPENROUTER_API_KEY environment variable.")
        sys.exit(1)
    
    print(f"Generation not yet implemented - API key found ({len(api_key)} chars)")
    print("This will use the progressive chunked generation pipeline.")
    # TODO: Implement actual generation once providers are tested


def main():
    parser = argparse.ArgumentParser(
        description="IRC Fragment Admin CLI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Commands")
    
    # stats
    subparsers.add_parser("stats", help="Show fragment statistics")
    
    # list
    list_parser = subparsers.add_parser("list", help="List fragments")
    list_parser.add_argument("--limit", type=int, default=20, help="Number to show")
    
    # show
    show_parser = subparsers.add_parser("show", help="Show fragment content")
    show_parser.add_argument("id", help="Fragment ID")
    
    # rate
    rate_parser = subparsers.add_parser("rate", help="Rate a fragment")
    rate_parser.add_argument("id", help="Fragment ID")
    rate_parser.add_argument("rating", type=int, choices=[1, 2, 3], help="Rating (1=bad, 2=ok, 3=good)")
    
    # delete
    delete_parser = subparsers.add_parser("delete", help="Delete a fragment")
    delete_parser.add_argument("id", help="Fragment ID")
    delete_parser.add_argument("-f", "--force", action="store_true", help="Skip confirmation")
    
    # generate
    gen_parser = subparsers.add_parser("generate", help="Generate new fragments")
    gen_parser.add_argument("--count", type=int, default=10, help="Number to generate")
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        sys.exit(1)
    
    commands = {
        "stats": cmd_stats,
        "list": cmd_list,
        "show": cmd_show,
        "rate": cmd_rate,
        "delete": cmd_delete,
        "generate": cmd_generate,
    }
    
    commands[args.command](args)


if __name__ == "__main__":
    main()

