#!/usr/bin/env python3
"""
æthera Post Import CLI

Import markdown files as blog posts with interactive metadata prompts.

Usage:
    python import_post.py                    # Interactive file selection
    python import_post.py path/to/post.md    # Import specific file
    python import_post.py --list             # List all posts
    python import_post.py --unpublish SLUG   # Unpublish a post
    python import_post.py --delete SLUG      # Delete a post

The markdown file can include YAML frontmatter for metadata:
    ---
    title: My Post Title
    author: æthera
    tags: tag1, tag2
    categories: category1
    published: true
    ---
    
    # Content starts here...

If frontmatter is missing, you'll be prompted for metadata.
"""

import sys
import os
import re
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional, Tuple

# Add project root to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from sqlmodel import Session, select
from aethera.models.base import get_engine, init_db
from aethera.models.models import Post
from aethera.utils.markdown import render_markdown


def parse_frontmatter(content: str) -> Tuple[dict, str]:
    """Parse YAML frontmatter from markdown content.
    
    Returns (metadata_dict, remaining_content)
    """
    metadata = {}
    
    # Check for frontmatter delimiter
    if not content.startswith('---'):
        return metadata, content
    
    # Find the closing delimiter
    lines = content.split('\n')
    end_idx = None
    for i, line in enumerate(lines[1:], start=1):
        if line.strip() == '---':
            end_idx = i
            break
    
    if end_idx is None:
        return metadata, content
    
    # Parse the frontmatter
    frontmatter_lines = lines[1:end_idx]
    for line in frontmatter_lines:
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip().lower()
            value = value.strip()
            
            # Handle boolean values
            if value.lower() in ('true', 'yes', '1'):
                value = True
            elif value.lower() in ('false', 'no', '0'):
                value = False
            # Strip quotes if present
            elif value.startswith('"') and value.endswith('"'):
                value = value[1:-1]
            elif value.startswith("'") and value.endswith("'"):
                value = value[1:-1]
            
            metadata[key] = value
    
    # Get remaining content
    remaining_content = '\n'.join(lines[end_idx + 1:]).strip()
    
    return metadata, remaining_content


def list_markdown_files(directory: Path = None) -> list:
    """List all markdown files in the given directory."""
    if directory is None:
        directory = Path.cwd()
    
    md_files = list(directory.glob('*.md'))
    md_files += list(directory.glob('*.markdown'))
    
    # Also check common subdirectories
    for subdir in ['posts', 'content', 'articles', 'drafts']:
        subpath = directory / subdir
        if subpath.exists():
            md_files += list(subpath.glob('*.md'))
            md_files += list(subpath.glob('*.markdown'))
    
    # Filter out README and other non-post files
    excluded = {'readme.md', 'changelog.md', 'contributing.md', 'license.md'}
    md_files = [f for f in md_files if f.name.lower() not in excluded]
    
    return sorted(md_files)


def prompt_for_file() -> Optional[Path]:
    """Interactive file selection."""
    print("\n📄 Available markdown files:\n")
    
    files = list_markdown_files()
    
    if not files:
        print("  No markdown files found in current directory.")
        print("  You can:")
        print("    1. Run from a directory with .md files")
        print("    2. Pass a file path: python import_post.py path/to/file.md")
        return None
    
    for i, f in enumerate(files, 1):
        print(f"  [{i}] {f.relative_to(Path.cwd())}")
    
    print(f"\n  [0] Enter custom path")
    print(f"  [q] Quit")
    
    while True:
        choice = input("\nSelect file number: ").strip().lower()
        
        if choice == 'q':
            return None
        
        if choice == '0':
            custom_path = input("Enter file path: ").strip()
            path = Path(custom_path).expanduser()
            if path.exists():
                return path
            print(f"  ❌ File not found: {custom_path}")
            continue
        
        try:
            idx = int(choice) - 1
            if 0 <= idx < len(files):
                return files[idx]
            print(f"  ❌ Invalid choice. Enter 1-{len(files)}")
        except ValueError:
            print("  ❌ Enter a number or 'q' to quit")


def prompt_for_metadata(existing: dict, content: str) -> dict:
    """Prompt for missing metadata."""
    metadata = existing.copy()
    
    print("\n📝 Post Metadata\n")
    print("  (Press Enter to accept [default] or type new value)\n")
    
    # Title - try to extract from first heading if not in frontmatter
    default_title = metadata.get('title')
    if not default_title:
        # Try to get from first heading
        heading_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
        if heading_match:
            default_title = heading_match.group(1).strip()
    
    title = input(f"  Title [{default_title or 'Untitled'}]: ").strip()
    metadata['title'] = title if title else (default_title or 'Untitled')
    
    # Author
    default_author = metadata.get('author', 'æthera')
    author = input(f"  Author [{default_author}]: ").strip()
    metadata['author'] = author if author else default_author
    
    # Tags
    default_tags = metadata.get('tags', '')
    tags = input(f"  Tags (comma-separated) [{default_tags}]: ").strip()
    metadata['tags'] = tags if tags else default_tags
    
    # Categories
    default_cats = metadata.get('categories', '')
    cats = input(f"  Categories (comma-separated) [{default_cats}]: ").strip()
    metadata['categories'] = cats if cats else default_cats
    
    # Published status
    default_pub = metadata.get('published', True)
    pub_str = 'yes' if default_pub else 'no'
    pub = input(f"  Publish immediately? (yes/no) [{pub_str}]: ").strip().lower()
    if pub in ('yes', 'y', 'true', '1'):
        metadata['published'] = True
    elif pub in ('no', 'n', 'false', '0'):
        metadata['published'] = False
    else:
        metadata['published'] = default_pub
    
    return metadata


def import_post(filepath: Path, auto_confirm: bool = False) -> Optional[Post]:
    """Import a markdown file as a blog post."""
    if not filepath.exists():
        print(f"❌ File not found: {filepath}")
        return None
    
    # Read the file
    content = filepath.read_text(encoding='utf-8')
    
    # Parse frontmatter
    metadata, markdown_content = parse_frontmatter(content)
    
    print(f"\n📄 Importing: {filepath.name}")
    
    # Show detected frontmatter
    if metadata:
        print("\n  Detected frontmatter:")
        for key, value in metadata.items():
            print(f"    {key}: {value}")
    
    # Prompt for any missing metadata
    if not auto_confirm:
        metadata = prompt_for_metadata(metadata, markdown_content)
    else:
        # Fill in defaults for auto mode
        if 'title' not in metadata:
            heading_match = re.search(r'^#\s+(.+)$', markdown_content, re.MULTILINE)
            metadata['title'] = heading_match.group(1).strip() if heading_match else 'Untitled'
        if 'author' not in metadata:
            metadata['author'] = 'æthera'
        if 'published' not in metadata:
            metadata['published'] = True
    
    # Initialize database
    init_db()
    engine = get_engine()
    
    with Session(engine) as session:
        # Generate slug
        slug = Post.generate_slug(metadata['title'], session)
        
        # Check if slug already exists
        existing = session.exec(select(Post).where(Post.slug == slug)).first()
        if existing:
            if not auto_confirm:
                overwrite = input(f"\n  ⚠️  Post with slug '{slug}' exists. Overwrite? (yes/no): ").strip().lower()
                if overwrite not in ('yes', 'y'):
                    print("  Cancelled.")
                    return None
            # Update existing post
            existing.title = metadata['title']
            existing.author = metadata.get('author', 'æthera')
            existing.content = markdown_content
            existing.content_html = render_markdown(markdown_content)
            existing.excerpt = Post.create_excerpt(markdown_content)
            existing.tags = metadata.get('tags', '')
            existing.categories = metadata.get('categories', '')
            existing.published = metadata.get('published', True)
            existing.updated_at = datetime.now(timezone.utc)
            
            session.add(existing)
            session.commit()
            session.refresh(existing)
            
            print(f"\n✅ Updated post: {existing.title}")
            print(f"   Slug: {existing.slug}")
            print(f"   Published: {'Yes' if existing.published else 'No (draft)'}")
            return existing
        
        # Create new post
        post = Post(
            title=metadata['title'],
            slug=slug,
            author=metadata.get('author', 'æthera'),
            content=markdown_content,
            content_html=render_markdown(markdown_content),
            excerpt=Post.create_excerpt(markdown_content),
            tags=metadata.get('tags', ''),
            categories=metadata.get('categories', ''),
            published=metadata.get('published', True),
            license="CC BY 4.0",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        
        session.add(post)
        session.commit()
        session.refresh(post)
        
        print(f"\n✅ Imported post: {post.title}")
        print(f"   Slug: {post.slug}")
        print(f"   Published: {'Yes' if post.published else 'No (draft)'}")
        if post.published:
            print(f"   URL: /posts/{post.slug}")
        
        return post


def list_posts():
    """List all posts in the database."""
    init_db()
    engine = get_engine()
    
    with Session(engine) as session:
        posts = session.exec(
            select(Post).order_by(Post.created_at.desc())
        ).all()
        
        if not posts:
            print("\n📭 No posts found.")
            return
        
        print(f"\n📚 Posts ({len(posts)} total):\n")
        
        for post in posts:
            status = "✓" if post.published else "○"
            date = post.created_at.strftime("%Y-%m-%d")
            print(f"  {status} [{date}] {post.title}")
            print(f"       slug: {post.slug}")


def unpublish_post(slug: str):
    """Unpublish a post (set to draft)."""
    init_db()
    engine = get_engine()
    
    with Session(engine) as session:
        post = session.exec(select(Post).where(Post.slug == slug)).first()
        
        if not post:
            print(f"❌ Post not found: {slug}")
            return
        
        post.published = False
        post.updated_at = datetime.now(timezone.utc)
        session.add(post)
        session.commit()
        
        print(f"✅ Unpublished: {post.title}")


def delete_post(slug: str):
    """Delete a post."""
    init_db()
    engine = get_engine()
    
    with Session(engine) as session:
        post = session.exec(select(Post).where(Post.slug == slug)).first()
        
        if not post:
            print(f"❌ Post not found: {slug}")
            return
        
        confirm = input(f"⚠️  Delete '{post.title}'? This cannot be undone. (yes/no): ").strip().lower()
        if confirm not in ('yes', 'y'):
            print("  Cancelled.")
            return
        
        # Delete associated comments first
        from aethera.models.models import Comment
        comments = session.exec(select(Comment).where(Comment.post_id == post.id)).all()
        for comment in comments:
            session.delete(comment)
        
        session.delete(post)
        session.commit()
        
        print(f"✅ Deleted: {post.title} ({len(comments)} comments)")


def print_help():
    """Print usage help."""
    print(__doc__)


def main():
    args = sys.argv[1:]
    
    if not args:
        # Interactive mode
        filepath = prompt_for_file()
        if filepath:
            import_post(filepath)
        return
    
    if args[0] in ('-h', '--help'):
        print_help()
        return
    
    if args[0] == '--list':
        list_posts()
        return
    
    if args[0] == '--unpublish':
        if len(args) < 2:
            print("Usage: python import_post.py --unpublish SLUG")
            return
        unpublish_post(args[1])
        return
    
    if args[0] == '--delete':
        if len(args) < 2:
            print("Usage: python import_post.py --delete SLUG")
            return
        delete_post(args[1])
        return
    
    # Assume it's a file path
    filepath = Path(args[0]).expanduser()
    import_post(filepath)


if __name__ == "__main__":
    main()

