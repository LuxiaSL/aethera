"""add comment references column for backlinks

Revision ID: add_comment_refs
Revises: text_columns_123
Create Date: 2025-06-06 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'add_comment_refs'
down_revision: Union[str, None] = 'text_columns_123'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add references column to comment table for tracking backlinks."""
    with op.batch_alter_table('comment') as batch_op:
        batch_op.add_column(sa.Column('references', sa.String(), nullable=True))


def downgrade() -> None:
    """Remove references column from comment table."""
    with op.batch_alter_table('comment') as batch_op:
        batch_op.drop_column('references')

