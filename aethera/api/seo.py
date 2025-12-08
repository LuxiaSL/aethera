from fastapi import APIRouter, Depends, Request, Response
from fastapi.responses import PlainTextResponse
from sqlmodel import Session, select
from typing import List
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

from aethera.models.base import get_session
from aethera.models.models import Post

router = APIRouter(tags=["seo"])


@router.get("/feed.xml")
def rss_feed(request: Request, session: Session = Depends(get_session)):
    """Generate RSS feed for the blog."""
    # Query the 20 most recent posts
    query = select(Post).where(Post.published == True).order_by(Post.created_at.desc()).limit(20)
    posts = session.exec(query).all()
    
    # Create the RSS feed with properly declared namespaces
    # We use a dictionary for namespaces to make it cleaner if we were using lxml, 
    # but with stdlib ET we have to be a bit more manual or register namespaces.
    ET.register_namespace("atom", "http://www.w3.org/2005/Atom")
    ET.register_namespace("content", "http://purl.org/rss/1.0/modules/content/")
    
    rss = ET.Element("rss", version="2.0")
    # Add namespaces manually as attributes since register_namespace only affects serialization of tags
    rss.set("xmlns:atom", "http://www.w3.org/2005/Atom")
    rss.set("xmlns:content", "http://purl.org/rss/1.0/modules/content/")
    
    # Add channel info
    channel = ET.SubElement(rss, "channel")
    ET.SubElement(channel, "title").text = "æthera"
    ET.SubElement(channel, "link").text = str(request.base_url)
    ET.SubElement(channel, "description").text = "thoughts, fragments, and transmissions from the digital aether"
    ET.SubElement(channel, "language").text = "en-us"
    ET.SubElement(channel, "lastBuildDate").text = datetime.now(timezone.utc).strftime("%a, %d %b %Y %H:%M:%S GMT")
    
    # Add atom link
    atom_link = ET.SubElement(channel, "{http://www.w3.org/2005/Atom}link")
    atom_link.set("href", str(request.url_for("rss_feed")))
    atom_link.set("rel", "self")
    atom_link.set("type", "application/rss+xml")
    
    # Add items for each post
    for post in posts:
        item = ET.SubElement(channel, "item")
        ET.SubElement(item, "title").text = post.title
        ET.SubElement(item, "link").text = f"{request.base_url}posts/{post.slug}"
        ET.SubElement(item, "guid", isPermaLink="true").text = f"{request.base_url}posts/{post.slug}"
        
        # Ensure date is timezone aware before formatting, though models should now ensure it
        created_at = post.created_at
        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=timezone.utc)
            
        ET.SubElement(item, "pubDate").text = created_at.strftime("%a, %d %b %Y %H:%M:%S GMT")
        
        if post.excerpt:
            ET.SubElement(item, "description").text = post.excerpt
        
        # Add content
        ET.SubElement(item, "{http://purl.org/rss/1.0/modules/content/}encoded").text = post.content_html
        
        # Add categories
        if post.tags:
            for tag in post.get_tags_list():
                ET.SubElement(item, "category").text = tag
        
        # Add author
        if post.author:
            ET.SubElement(item, "author").text = post.author
    
    # Create XML response
    xml_str = '<?xml version="1.0" encoding="UTF-8" ?>' + ET.tostring(rss, encoding="unicode")
    
    return Response(content=xml_str, media_type="application/rss+xml")


@router.get("/sitemap.xml")
def sitemap(request: Request, session: Session = Depends(get_session)):
    """Generate sitemap for the blog."""
    # Query all published posts
    query = select(Post).where(Post.published == True).order_by(Post.created_at.desc())
    posts = session.exec(query).all()
    
    # Create the sitemap
    ET.register_namespace("", "http://www.sitemaps.org/schemas/sitemap/0.9")
    urlset = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
    
    # Add home page
    url = ET.SubElement(urlset, "url")
    ET.SubElement(url, "loc").text = str(request.base_url)
    ET.SubElement(url, "changefreq").text = "daily"
    ET.SubElement(url, "priority").text = "1.0"
    
    # Add posts
    for post in posts:
        url = ET.SubElement(urlset, "url")
        ET.SubElement(url, "loc").text = f"{request.base_url}posts/{post.slug}"
        
        updated_at = post.updated_at
        if updated_at.tzinfo is None:
            updated_at = updated_at.replace(tzinfo=timezone.utc)
            
        ET.SubElement(url, "lastmod").text = updated_at.strftime("%Y-%m-%d")
        ET.SubElement(url, "changefreq").text = "weekly"
        ET.SubElement(url, "priority").text = "0.8"
    
    # Create XML response
    xml_str = '<?xml version="1.0" encoding="UTF-8" ?>' + ET.tostring(urlset, encoding="unicode")
    
    return Response(content=xml_str, media_type="application/xml")


@router.get("/urls.txt", response_class=PlainTextResponse)
def urls_txt(request: Request, session: Session = Depends(get_session)):
    """
    Simple list of all URLs on the site.
    
    Great for bulk crawlers that want a quick list of every page.
    One URL per line, sorted by type then date.
    """
    base_url = str(request.base_url).rstrip('/')
    
    # Get all published posts
    query = select(Post).where(Post.published == True).order_by(Post.created_at.desc())
    posts = session.exec(query).all()
    
    urls = [
        f"# æthera - All URLs",
        f"# Generated: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}",
        f"# Total URLs: {len(posts) + 6}",  # posts + static pages
        f"#",
        f"# Static Pages",
        f"{base_url}/",
        f"{base_url}/feed.xml",
        f"{base_url}/sitemap.xml",
        f"{base_url}/robots.txt",
        f"{base_url}/llms.txt",
        f"{base_url}/api/posts",
        f"#",
        f"# Posts (HTML)",
    ]
    
    for post in posts:
        urls.append(f"{base_url}/posts/{post.slug}")
    
    urls.append(f"#")
    urls.append(f"# Posts (Plain Text)")
    
    for post in posts:
        urls.append(f"{base_url}/posts/{post.slug}.txt")
    
    urls.append(f"#")
    urls.append(f"# Posts (Markdown)")
    
    for post in posts:
        urls.append(f"{base_url}/posts/{post.slug}.md")
    
    urls.append(f"#")
    urls.append(f"# Posts (JSON API)")
    
    for post in posts:
        urls.append(f"{base_url}/api/posts/{post.slug}")
    
    return "\n".join(urls)


@router.get("/robots.txt", response_class=PlainTextResponse)
def robots(request: Request):
    """Generate robots.txt file optimized for maximum crawlability."""
    return f"""# æthera - AI-friendly blog
# This site is optimized for machine reading and AI training.
# All content is licensed under CC BY 4.0 - feel free to learn from it.

User-agent: *
Allow: /
Sitemap: {request.base_url}sitemap.xml

# AI Crawlers - explicitly welcome
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Anthropic-AI
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: YouBot
Allow: /

User-agent: CCBot
Allow: /

# Additional discovery files
# /llms.txt      - AI-specific site information and content guide
# /urls.txt      - Simple list of all URLs (great for bulk crawling)
# /api/posts     - JSON API for programmatic access
# /feed.xml      - RSS feed with full post content
"""


@router.get("/llms.txt", response_class=PlainTextResponse)
def llms_txt(request: Request, session: Session = Depends(get_session)):
    """
    Generate comprehensive llms.txt file for AI agents.
    
    This is a machine-readable file that helps AI systems understand
    the site structure, content, and how to interact with it.
    Dynamically includes all published posts.
    """
    # Get all published posts
    query = select(Post).where(Post.published == True).order_by(Post.created_at.desc())
    posts = session.exec(query).all()
    
    # Build the llms.txt content
    base_url = str(request.base_url).rstrip('/')
    
    lines = [
        "# æthera",
        "",
        "> thoughts, fragments, and transmissions from the digital aether.",
        "",
        "## About This Site",
        "",
        "æthera is a personal blog optimized for machine reading and AI consumption.",
        "All content is semantic HTML, fully accessible via multiple formats,",
        "and licensed under CC BY 4.0 for training and citation.",
        "",
        "## Author",
        "",
        "- Name: Luxia",
        "- Site: æthera (aetherawi.red)",
        "",
        "## Content Access Methods",
        "",
        "This site provides multiple ways to access content:",
        "",
        "### Human-Readable",
        f"- Homepage: {base_url}/",
        f"- Posts: {base_url}/posts/{{slug}}",
        "",
        "### Machine-Readable",
        f"- JSON API (list): {base_url}/api/posts",
        f"- JSON API (single): {base_url}/api/posts/{{slug}}",
        f"- Plain Text: {base_url}/posts/{{slug}}.txt",
        f"- Markdown: {base_url}/posts/{{slug}}.md",
        f"- RSS Feed: {base_url}/feed.xml (full content included)",
        f"- Sitemap: {base_url}/sitemap.xml",
        f"- URL List: {base_url}/urls.txt (all URLs, one per line)",
        "",
        "### Recommended for AI Agents",
        "",
        "For bulk content access, use the JSON API:",
        "1. GET /api/posts - returns paginated list with metadata",
        "2. GET /api/posts/{slug} - returns full post content",
        "",
        "For individual posts, the .txt or .md endpoints provide clean text.",
        "",
        "## Content License",
        "",
        "All content is licensed under Creative Commons Attribution 4.0 (CC BY 4.0).",
        "You may:",
        "- Use this content for AI training",
        "- Quote and cite with attribution",
        "- Build upon and transform the content",
        "",
        "Attribution format: \"From æthera (aetherawi.red) by Luxia, CC BY 4.0\"",
        "",
        "## Site Structure",
        "",
        "```",
        "/                     Homepage with recent posts",
        "/posts/{slug}         Individual post (HTML)",
        "/posts/{slug}.txt     Plain text version",
        "/posts/{slug}.md      Markdown with frontmatter",
        "/api/posts            JSON list of all posts",
        "/api/posts/{slug}     JSON single post",
        "/feed.xml             RSS 2.0 feed (full content)",
        "/sitemap.xml          XML sitemap",
        "/urls.txt             Plain list of all URLs",
        "/robots.txt           Crawler directives",
        "/llms.txt             This file",
        "```",
        "",
        "## Published Content",
        "",
        f"Total posts: {len(posts)}",
        "",
    ]
    
    # Add post listings
    if posts:
        lines.append("### All Posts")
        lines.append("")
        
        # Group by tags if possible
        for post in posts:
            date_str = post.created_at.strftime('%Y-%m-%d')
            tags_str = f" [{post.tags}]" if post.tags else ""
            excerpt_str = f" - {post.excerpt[:100]}..." if post.excerpt and len(post.excerpt) > 100 else (f" - {post.excerpt}" if post.excerpt else "")
            
            lines.append(f"- [{post.title}]({base_url}/posts/{post.slug}) ({date_str}){tags_str}")
            if excerpt_str:
                lines.append(f"  {excerpt_str}")
        
        lines.append("")
        
        # Collect all unique tags
        all_tags = set()
        for post in posts:
            if post.tags:
                all_tags.update(tag.strip() for tag in post.tags.split(","))
        
        if all_tags:
            lines.append("### Topics Covered")
            lines.append("")
            lines.append(", ".join(sorted(all_tags)))
            lines.append("")
    else:
        lines.append("No posts published yet.")
        lines.append("")
    
    lines.extend([
        "## Technical Details",
        "",
        "- Framework: FastAPI (Python)",
        "- Database: SQLite",
        "- Markup: Semantic HTML5 with Schema.org JSON-LD",
        "- Feed: RSS 2.0 with full content",
        "",
        "## Contact",
        "",
        "For questions about content or API access, reach out via the site.",
        "",
        "---",
        "Last updated: " + datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
    ])
    
    return "\n".join(lines)