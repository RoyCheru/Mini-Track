"""adds rote id to bookings

Revision ID: 214c019b7302
Revises: ebf66891e18c
Create Date: 2026-02-04 19:26:45.076323

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '214c019b7302'
down_revision = 'ebf66891e18c'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('bookings', schema=None) as batch_op:
        # 1. Add the new route_id column
        batch_op.add_column(
            sa.Column('route_id', sa.Integer(), nullable=True)
        )

        # 2. Create a named foreign key (IMPORTANT)
        batch_op.create_foreign_key(
            'fk_bookings_route_id_routes',
            'routes',
            ['route_id'],
            ['id']
        )

        # 3. Drop the old vehicle_id column
        # Dropping the column implicitly removes the FK in SQLite
        batch_op.drop_column('vehicle_id')


    # ### end Alembic commands ###


def downgrade():
    with op.batch_alter_table('bookings', schema=None) as batch_op:
        # Re-add vehicle_id
        batch_op.add_column(
            sa.Column('vehicle_id', sa.Integer(), nullable=True)
        )

        batch_op.create_foreign_key(
            'fk_bookings_vehicle_id_vehicles',
            'vehicles',
            ['vehicle_id'],
            ['id']
        )

        # Remove route_id
        batch_op.drop_constraint(
            'fk_bookings_route_id_routes',
            type_='foreignkey'
        )
        batch_op.drop_column('route_id')

    # ### end Alembic commands ###
