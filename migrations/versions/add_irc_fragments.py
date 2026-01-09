"""add irc_fragments table

NOTE: This migration is DEPRECATED.
The IRC module now uses its own separate database (irc.sqlite).
Tables are created automatically via init_irc_db() in aethera/irc/database.py.

This file is kept for reference but should not be run against the main blog database.

Revision ID: add_irc_fragments
Revises: add_comment_refs
Create Date: 2026-01-03 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'add_irc_fragments'
down_revision: Union[str, None] = 'add_comment_refs'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# DEPRECATED: IRC now uses separate database
# To initialize IRC database, use:
#   from aethera.irc.database import init_irc_db
#   init_irc_db()


def upgrade() -> None:
    """DEPRECATED: IRC now uses separate database. This is a no-op."""
    # IRC uses its own database now - see aethera/irc/database.py
    # To initialize: from aethera.irc.database import init_irc_db; init_irc_db()
    pass


def _upgrade_deprecated() -> None:
    """Original upgrade - kept for reference."""
    op.create_table(
        'irc_fragments',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('messages_json', sa.Text(), nullable=False),
        sa.Column('style', sa.String(), nullable=False),
        sa.Column('collapse_type', sa.String(), nullable=False),
        sa.Column('pacing', sa.String(), nullable=False),
        sa.Column('generated_at', sa.DateTime(), nullable=False),
        sa.Column('quality_score', sa.Float(), nullable=True),
        sa.Column('manual_rating', sa.Integer(), nullable=True),
        sa.Column('times_shown', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('last_shown_at', sa.DateTime(), nullable=True),
        sa.Column('collapse_start_index', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes for common queries
    op.create_index(
        'ix_irc_fragments_quality_score',
        'irc_fragments',
        ['quality_score'],
        unique=False
    )
    op.create_index(
        'ix_irc_fragments_last_shown_at',
        'irc_fragments',
        ['last_shown_at'],
        unique=False
    )
    op.create_index(
        'ix_irc_fragments_style',
        'irc_fragments',
        ['style'],
        unique=False
    )


def downgrade() -> None:
    """DEPRECATED: IRC now uses separate database. This is a no-op."""
    pass


def _downgrade_deprecated() -> None:
    """Original downgrade - kept for reference."""
    op.drop_index('ix_irc_fragments_style', table_name='irc_fragments')
    op.drop_index('ix_irc_fragments_last_shown_at', table_name='irc_fragments')
    op.drop_index('ix_irc_fragments_quality_score', table_name='irc_fragments')
    op.drop_table('irc_fragments')

