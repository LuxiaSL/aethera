from fastapi import APIRouter, Depends, Request, Response
from fastapi.responses import PlainTextResponse
from sqlmodel import Session, select
from typing import List
import xml.etree.ElementTree as ET
from datetime import datetime

from luxiblog.models.base import get_session
from luxiblog.models.models import Post

router = APIRouter(tags=["seo"])


@router.get("/feed.xml")
def rss_feed(request: Request, session: Session = Depends(get_session)):
    """Generate RSS feed for the blog."""
    # Query the 20 most recent posts
    query = select(Post).where(Post.published == True).order_by(Post.created_at.desc()).limit(20)
    posts = session.exec(query).all()
    
    # Create the RSS feed with properly declared namespaces
    rss = ET.Element(
        "rss",
        {
            "version": "2.0",
            "xmlns:atom": "http://www.w3.org/2005/Atom",
            "xmlns:content": "http://purl.org/rss/1.0/modules/content/"
        }
    )
    
    # Add channel info
    channel = ET.SubElement(rss, "channel")
    ET.SubElement(channel, "title").text = "LuxiBlog"
    ET.SubElement(channel, "link").text = str(request.base_url)
    ET.SubElement(channel, "description").text = "A lightweight blog optimized for AI consumption"
    ET.SubElement(channel, "language").text = "en-us"
    ET.SubElement(channel, "lastBuildDate").text = datetime.now().strftime("%a, %d %b %Y %H:%M:%S GMT")
    
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
        ET.SubElement(item, "pubDate").text = post.created_at.strftime("%a, %d %b %Y %H:%M:%S GMT")
        
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
        ET.SubElement(url, "lastmod").text = post.updated_at.strftime("%Y-%m-%d")
        ET.SubElement(url, "changefreq").text = "weekly"
        ET.SubElement(url, "priority").text = "0.8"
    
    # Create XML response
    xml_str = '<?xml version="1.0" encoding="UTF-8" ?>' + ET.tostring(urlset, encoding="unicode")
    
    return Response(content=xml_str, media_type="application/xml")


@router.get("/robots.txt", response_class=PlainTextResponse)
def robots(request: Request):
    """Generate robots.txt file."""
    return f"""User-agent: *
Allow: /
Sitemap: {request.base_url}/sitemap.xml
Disallow: /admin
"""