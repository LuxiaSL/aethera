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
    md.enable('table')
    md.renderer = SemanticHTMLRenderer()

    # Strip the first H1 heading from content if present
    # (title is displayed separately in the post header template)
    content = re.sub(r'^#\s+[^\n]*\n*', '', content, count=1)

    html = md.render(content)

    # Split content at <hr> elements into separate segments
    # Each segment gets its own soft fade background
    segments = re.split(r'<hr\s*/?>', html)
    if len(segments) > 1:
        html = ''.join(
            f'<div class="post-segment">{segment.strip()}</div>'
            for segment in segments
            if segment.strip()
        )

    # Don't wrap in article tag - this is already done by the template
    return html


def render_comment_markdown(content: str) -> str:
    """Convert markdown to HTML for comments with simpler rules.
    
    Pre-processes >>123 references to prevent markdown from treating
    leading > as blockquotes.
    """
    # Pre-process: Replace >>123 with a placeholder to prevent blockquote parsing
    # Use a format that markdown won't interpret as special syntax
    placeholder_map = {}
    placeholder_counter = [0]  # Use list for closure mutation
    
    def replace_with_placeholder(match):
        ref_id = match.group(1)
        # Use a format that looks like plain text to markdown
        placeholder = f"AETHREF{placeholder_counter[0]}END{ref_id}REF"
        placeholder_map[placeholder] = ref_id
        placeholder_counter[0] += 1
        return placeholder
    
    # Match >> followed by digits at word boundary (not inside other text)
    # Handle both start of line and mid-line references
    content = re.sub(r'>>(\d+)', replace_with_placeholder, content)
    
    # Now run markdown - the placeholders won't trigger blockquote
    md = markdown_it.MarkdownIt('commonmark', {'html': False})
    html = md.render(content)
    
    # Restore placeholders with raw reference markers (will be processed later)
    for placeholder, ref_id in placeholder_map.items():
        html = html.replace(placeholder, f'>>{ref_id}')
    
    return html