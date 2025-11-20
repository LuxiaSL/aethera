"""text columns

Revision ID: text_columns_123
Revises: 9a199259a146
Create Date: 2025-05-12 00:51:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'text_columns_123'
down_revision: Union[str, None] = '9a199259a146'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema to use Text columns for long text fields."""
    # Update Post table text columns
    with op.batch_alter_table('post') as batch_op:
        batch_op.alter_column('content',
                            existing_type=sa.String(),
                            type_=sa.Text(),
                            existing_nullable=False)
        batch_op.alter_column('content_html',
                            existing_type=sa.String(),
                            type_=sa.Text(),
                            existing_nullable=False)
        batch_op.alter_column('excerpt',
                            existing_type=sa.String(),
                            type_=sa.Text(),
                            existing_nullable=True)

    # Update Comment table text columns
    with op.batch_alter_table('comment') as batch_op:
        batch_op.alter_column('content',
                            existing_type=sa.String(),
                            type_=sa.Text(),
                            existing_nullable=False)
        batch_op.alter_column('content_html',
                            existing_type=sa.String(),
                            type_=sa.Text(),
                            existing_nullable=False)


def downgrade() -> None:
    """Downgrade schema back to String columns."""
    # Revert Post table text columns
    with op.batch_alter_table('post') as batch_op:
        batch_op.alter_column('content',
                            existing_type=sa.Text(),
                            type_=sa.String(),
                            existing_nullable=False)
        batch_op.alter_column('content_html',
                            existing_type=sa.Text(),
                            type_=sa.String(),
                            existing_nullable=False)
        batch_op.alter_column('excerpt',
                            existing_type=sa.Text(),
                            type_=sa.String(),
                            existing_nullable=True)

    # Revert Comment table text columns
    with op.batch_alter_table('comment') as batch_op:
        batch_op.alter_column('content',
                            existing_type=sa.Text(),
                            type_=sa.String(),
                            existing_nullable=False)
        batch_op.alter_column('content_html',
                            existing_type=sa.Text(),
                            type_=sa.String(),
                            existing_nullable=False)