import markdown_it
from markdown_it.renderer import RendererHTML
from markdown_it.token import Token
import re
from typing import List


class SemanticHTMLRenderer(RendererHTML):
    """Custom renderer that outputs semantic HTML with proper structure."""

    def __init__(self):
        super().__init__()
        self.section_open = False  # Track if we have an open section
        self.current_section_level = None  # Track the level of the current section (h2, h3)

    def render(self, tokens: List[Token], options, env) -> str:
        """Wrap rendering with article or section tags as needed."""
        self.section_open = False  # Reset at start of rendering
        self.current_section_level = None

        result = super().render(tokens, options, env)

        # Ensure any open section is closed at end of document
        if self.section_open:
            result += "\n</section>"

        return result

    def heading_open(self, tokens, idx, options, env):
        """Ensure proper heading hierarchy with sections."""
        token = tokens[idx]

        output = []

        # If we have an open section and encounter a new heading that should start
        # a new section, close the current one first
        if self.section_open and (token.tag == 'h2' or token.tag == 'h3'):
            output.append("</section>")
            self.section_open = False

        # If it's an h2 or h3, start a new section
        if token.tag == 'h2' or token.tag == 'h3':
            section_id = self.get_heading_id(tokens, idx)
            output.append(f'<section class="content-section" id="{section_id}">')
            self.section_open = True
            self.current_section_level = token.tag

        # Add the heading tag
        output.append(f'<{token.tag}>')

        return '\n'.join(output)

    def heading_close(self, tokens, idx, options, env):
        """Close headings (but not sections - those are closed either by the next heading or at the end)."""
        token = tokens[idx]
        return f'</{token.tag}>'

    def get_heading_id(self, tokens, idx):
        """Generate an ID for a heading based on its content."""
        # Find the content token
        if idx + 1 < len(tokens) and tokens[idx + 1].type == 'inline':
            content = tokens[idx + 1].content
            # Slugify the content for the ID
            slug = re.sub(r'[^a-zA-Z0-9-]', '', content.lower().replace(' ', '-'))
            # Add a random suffix to avoid duplicates if same heading text appears twice
            if not slug:
                return f'section-{idx}'
            return f'{slug}-{idx}'
        return f'section-{idx}'


def render_markdown(content: str) -> str:
    """Convert markdown to semantic HTML."""
    md = markdown_it.MarkdownIt('commonmark', {'html': True})
    md.renderer = SemanticHTMLRenderer()

    # Ensure proper heading hierarchy if first heading isn't h1
    if not re.search(r'^#\s', content, re.MULTILINE):
        content = f"# Untitled\n\n{content}"

    html = md.render(content)

    # Don't wrap in article tag - this is already done by the template
    return html


def render_comment_markdown(content: str) -> str:
    """Convert markdown to HTML for comments with simpler rules."""
    md = markdown_it.MarkdownIt('commonmark', {'html': False})
    html = md.render(content)
    return html