from typing import Optional, List
from datetime import datetime
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
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
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
        slug = slugify(title)
        
        # If no session provided, just return the basic slug
        if not session:
            return slug
            
        # Check if slug already exists and make it unique if needed
        existing = session.exec(select(Post).where(Post.slug == slug)).first()
        if existing:
            # If slug exists, append a timestamp to make it unique
            slug = f"{slug}-{int(datetime.now().timestamp())}"
            
        return slug
    
    @classmethod
    def create_excerpt(cls, content: str, max_length: int = 160) -> Optional[str]:
        """Create an excerpt from the content."""
        if not content:
            return None
        
        # Get first paragraph and truncate if needed
        excerpt = content.split("\n\n", 1)[0][:max_length]
        return excerpt


class Comment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str = Field(sa_column=Column(Text))  # Use Text for unlimited length
    content_html: str = Field(sa_column=Column(Text))  # Use Text for unlimited length
    author: str = "Anonymous"
    tripcode: Optional[str] = None
    ip_address: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)

    post_id: int = Field(foreign_key="post.id", index=True)  # Add index for faster queries
    post: Post = Relationship(back_populates="comments")
    
    @staticmethod
    def generate_tripcode(password: str, salt: Optional[bytes] = None) -> Optional[str]:
        """Generate a tripcode from a password."""
        if not password:
            return None

        # Get salt from environment variable or use a default for development
        if salt is None:
            salt_str = os.environ.get("LUXIBLOG_TRIPCODE_SALT", "development-tripcode-salt")
            salt = salt_str.encode('utf-8')

        # Use SHA-256 with a salt
        h = hashlib.sha256()
        h.update(password.encode('utf-8'))
        h.update(salt)

        # Convert to base32 and take first 10 characters
        tripcode = base64.b32encode(h.digest()).decode('utf-8')[:10]
        return tripcode
        
    @staticmethod
    def process_cross_references(content: str) -> str:
        """Process >>1234 style references to other comments."""
        return re.sub(
            r'>>(\d+)', 
            r'<a href="#comment-\1" class="comment-reference">&gt;&gt;\1</a>', 
            content
        )