from typing import Optional, List
from datetime import datetime, timezone
from sqlmodel import Field, SQLModel, Relationship, Session, select
import hashlib
import base64
import re
import os
from slugify import slugify
import sqlalchemy as sa
from sqlalchemy import Column, Text


class Post(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    slug: str = Field(index=True, unique=True)
    author: str
    content: str = Field(sa_column=Column(Text))  # Use Text for unlimited length
    content_html: str = Field(sa_column=Column(Text))  # Use Text for unlimited length
    excerpt: Optional[str] = Field(sa_column=Column(Text), default=None)  # Use Text for unlimited length
    published: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    tags: Optional[str] = None  # Comma-separated tags
    categories: Optional[str] = None  # Comma-separated categories
    canonical_url: Optional[str] = None
    license: str = "CC BY 4.0"
    
    comments: List["Comment"] = Relationship(back_populates="post")
    
    def get_tags_list(self) -> List[str]:
        """Return tags as a list."""
        if not self.tags:
            return []
        return [tag.strip() for tag in self.tags.split(",")]
    
    def get_categories_list(self) -> List[str]:
        """Return categories as a list."""
        if not self.categories:
            return []
        return [cat.strip() for cat in self.categories.split(",")]
    
    @classmethod
    def generate_slug(cls, title: str, session: Optional[Session] = None) -> str:
        """Generate a unique slug from a title."""
        base_slug = slugify(title)
        slug = base_slug
        
        # If no session provided, just return the basic slug
        if not session:
            return slug
            
        # Check if slug already exists and make it unique if needed
        counter = 1
        while True:
            existing = session.exec(select(Post).where(Post.slug == slug)).first()
            if not existing:
                return slug
            
            # If slug exists, increment counter
            counter += 1
            slug = f"{base_slug}-{counter}"
    
    @classmethod
    def create_excerpt(cls, content: str, max_length: int = 160) -> Optional[str]:
        """Create an excerpt from the content."""
        if not content:
            return None
        
        # Get first paragraph
        first_para = content.strip().split("\n\n", 1)[0]
        
        # Strip markdown heading prefixes (# ## ### etc.)
        lines = first_para.split("\n")
        clean_lines = []
        for line in lines:
            # Remove heading markers
            stripped = re.sub(r'^#{1,6}\s+', '', line)
            if stripped:
                clean_lines.append(stripped)
        
        excerpt = " ".join(clean_lines)[:max_length]
        return excerpt.strip() if excerpt else None


class Comment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str = Field(sa_column=Column(Text))  # Use Text for unlimited length
    content_html: str = Field(sa_column=Column(Text))  # Use Text for unlimited length
    author: str = "Anonymous"
    tripcode: Optional[str] = None
    ip_address: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    # Comma-separated list of comment IDs this comment references (for backlinks)
    references: Optional[str] = None

    post_id: int = Field(foreign_key="post.id", index=True)  # Add index for faster queries
    post: Post = Relationship(back_populates="comments")
    
    def get_references_list(self) -> List[int]:
        """Return list of comment IDs this comment references."""
        if not self.references:
            return []
        return [int(ref.strip()) for ref in self.references.split(",") if ref.strip()]
    
    @staticmethod
    def extract_references(content: str) -> List[int]:
        """Extract all comment IDs referenced in content."""
        ref_pattern = r'(?:&gt;&gt;|>>)(\d+)'
        return list(set(int(m) for m in re.findall(ref_pattern, content)))
    
    @staticmethod
    def generate_tripcode(password: str, salt: Optional[bytes] = None) -> Optional[str]:
        """Generate a tripcode from a password."""
        if not password:
            return None

        # Get salt from environment variable or use a default for development
        if salt is None:
            salt_str = os.environ.get("AETHERA_TRIPCODE_SALT", "development-tripcode-salt")
            salt = salt_str.encode('utf-8')

        # Use SHA-256 with a salt
        h = hashlib.sha256()
        h.update(password.encode('utf-8'))
        h.update(salt)

        # Convert to base32 and take first 10 characters
        tripcode = base64.b32encode(h.digest()).decode('utf-8')[:10]
        return tripcode
        
    @staticmethod
    def process_cross_references(content: str, session: "Session" = None) -> str:
        """Process >>1234 style references to other comments.
        
        Handles both raw >> and HTML-escaped &gt;&gt; patterns.
        If a session is provided, resolves cross-post references to full URLs.
        """
        # Find all comment IDs referenced in the content
        ref_pattern = r'(?:&gt;&gt;|>>)(\d+)'
        referenced_ids = [int(m) for m in re.findall(ref_pattern, content)]
        
        # Build a map of comment_id -> post_slug for cross-post resolution
        comment_post_map = {}
        if session and referenced_ids:
            from sqlmodel import select
            # Batch fetch all referenced comments with their posts
            comments = session.exec(
                select(Comment).where(Comment.id.in_(referenced_ids))
            ).all()
            for comment in comments:
                if comment.post:
                    comment_post_map[comment.id] = comment.post.slug
        
        def make_link(match):
            """Create the appropriate link for a comment reference."""
            comment_id = int(match.group(1))
            
            # Check if we have cross-post info
            if comment_id in comment_post_map:
                post_slug = comment_post_map[comment_id]
                href = f"/posts/{post_slug}#comment-{comment_id}"
            else:
                # Fallback to same-page anchor (works for same-post refs)
                href = f"#comment-{comment_id}"
            
            return f'<a href="{href}" class="comment-reference" data-comment-id="{comment_id}">&gt;&gt;{comment_id}</a>'
        
        # Match HTML-escaped version (after markdown processing)
        content = re.sub(r'&gt;&gt;(\d+)', make_link, content)
        # Also match raw version (for edge cases)
        content = re.sub(r'(?<!&gt;)>>(\d+)', make_link, content)
        
        return content