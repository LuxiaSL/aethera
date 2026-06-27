"""
IRC Fragment Storage

Handles persistence and selection of IRC fragments.
"""

import json
import random
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional

from sqlmodel import select, or_

from .database import IRCFragmentDB, get_irc_session
from .models import IRCFragment, IRCMessage, CollapseType, PacingStyle

logger = logging.getLogger(__name__)


class FragmentStorage:
    """
    Manages IRC fragment persistence and retrieval.
    
    Responsibilities:
    - Save normalized fragments to database
    - Select next fragment for playback (weighted random)
    - Track playback statistics
    - Handle cooldown logic
    """
    
    def __init__(
        self,
        session_factory,
        cooldown_days: int = 7,
    ):
        """
        Initialize storage.
        
        Args:
            session_factory: Callable that returns a database session
            cooldown_days: Days before a fragment can be replayed
        """
        self.session_factory = session_factory
        self.cooldown_days = cooldown_days
    
    async def save(self, fragment: IRCFragment) -> str:
        """
        Save a fragment to the database.
        
        Args:
            fragment: Normalized IRCFragment to save
            
        Returns:
            Fragment ID
        """
        with self.session_factory() as session:
            db_fragment = IRCFragmentDB(
                id=fragment.id,
                messages_json=json.dumps([m.model_dump() for m in fragment.messages]),
                style=fragment.style,
                collapse_type=fragment.collapse_type.value,
                pacing=fragment.pacing.value,
                generated_at=fragment.generated_at,
                quality_score=fragment.quality_score,
                manual_rating=fragment.manual_rating,
                times_shown=fragment.times_shown,
                last_shown_at=fragment.last_shown_at,
                collapse_start_index=fragment.collapse_start_index,
            )
            session.add(db_fragment)
            session.commit()
            logger.info(f"Saved fragment {fragment.id} (style={fragment.style}, collapse={fragment.collapse_type.value})")
            return fragment.id
    
    async def get_by_id(self, fragment_id: str) -> Optional[IRCFragment]:
        """Get a specific fragment by ID."""
        with self.session_factory() as session:
            db_fragment = session.get(IRCFragmentDB, fragment_id)
            if db_fragment:
                return self._db_to_model(db_fragment)
            return None
    
    async def get_next_fragment(self) -> Optional[IRCFragment]:
        """
        Select the next fragment for playback.
        
        Selection logic:
        1. Filter to fragments not shown in cooldown period
        2. Weight by: never_shown > high_quality > low_times_shown
        3. Random selection from weighted pool
        4. Update shown stats
        """
        with self.session_factory() as session:
            cutoff = datetime.now(timezone.utc) - timedelta(days=self.cooldown_days)
            
            # Get candidates: never shown OR shown before cooldown
            statement = select(IRCFragmentDB).where(
                or_(
                    IRCFragmentDB.last_shown_at == None,
                    IRCFragmentDB.last_shown_at < cutoff
                )
            )
            candidates = list(session.exec(statement).all())
            
            if not candidates:
                # Fallback: get any fragment if all are in cooldown
                logger.warning("All fragments in cooldown, selecting from all")
                candidates = list(session.exec(select(IRCFragmentDB)).all())
            
            if not candidates:
                logger.error("No fragments available")
                return None
            
            # Compute weights
            weights = [self._compute_weight(f) for f in candidates]
            
            # Select one
            selected = random.choices(candidates, weights=weights, k=1)[0]
            
            # Update stats
            selected.times_shown += 1
            selected.last_shown_at = datetime.now(timezone.utc)
            session.add(selected)
            session.commit()
            session.refresh(selected)
            
            logger.info(f"Selected fragment {selected.id} (times_shown={selected.times_shown})")
            return self._db_to_model(selected)
    
    def _compute_weight(self, fragment: IRCFragmentDB) -> float:
        """
        Compute selection weight for a fragment.
        
        Higher weight = more likely to be selected.
        """
        weight = 1.0
        
        # Never shown: high priority
        if fragment.times_shown == 0:
            weight *= 10.0
        else:
            # Inverse of times shown (less shown = more weight)
            weight *= 1.0 / (fragment.times_shown + 1)
        
        # Quality score boost
        if fragment.quality_score is not None:
            weight *= (0.5 + fragment.quality_score)  # 0.5 to 1.5 multiplier
        
        # Manual rating boost (1=bad, 2=ok, 3=good)
        if fragment.manual_rating is not None:
            rating_multiplier = {1: 0.3, 2: 1.0, 3: 2.0}
            weight *= rating_multiplier.get(fragment.manual_rating, 1.0)
        
        return max(weight, 0.01)  # Ensure positive weight
    
    def _db_to_model(self, db: IRCFragmentDB) -> IRCFragment:
        """Convert database model to Pydantic model."""
        messages_data = json.loads(db.messages_json)
        messages = [IRCMessage(**m) for m in messages_data]
        
        return IRCFragment(
            id=db.id,
            messages=messages,
            style=db.style,
            collapse_type=CollapseType(db.collapse_type),
            pacing=PacingStyle(db.pacing),
            generated_at=db.generated_at,
            quality_score=db.quality_score,
            manual_rating=db.manual_rating,
            times_shown=db.times_shown,
            last_shown_at=db.last_shown_at,
            collapse_start_index=db.collapse_start_index or 0,
        )
    
    async def set_manual_rating(self, fragment_id: str, rating: int) -> bool:
        """
        Set manual rating for a fragment.
        
        Args:
            fragment_id: Fragment to rate
            rating: 1 (bad), 2 (ok), or 3 (good)
            
        Returns:
            True if successful
        """
        if rating not in (1, 2, 3):
            raise ValueError("Rating must be 1, 2, or 3")
        
        with self.session_factory() as session:
            fragment = session.get(IRCFragmentDB, fragment_id)
            if not fragment:
                return False
            
            fragment.manual_rating = rating
            session.add(fragment)
            session.commit()
            logger.info(f"Set rating {rating} for fragment {fragment_id}")
            return True
    
    async def get_stats(self) -> dict:
        """Get storage statistics."""
        with self.session_factory() as session:
            total = session.exec(select(IRCFragmentDB)).all()
            
            shown = [f for f in total if f.times_shown > 0]
            rated = [f for f in total if f.manual_rating is not None]
            
            cutoff = datetime.now(timezone.utc) - timedelta(days=self.cooldown_days)
            available = [
                f for f in total 
                if f.last_shown_at is None or f.last_shown_at < cutoff
            ]
            
            return {
                "total_fragments": len(total),
                "shown_fragments": len(shown),
                "available_fragments": len(available),
                "rated_fragments": len(rated),
                "avg_quality_score": (
                    sum(f.quality_score or 0 for f in total) / len(total)
                    if total else 0
                ),
                "by_style": self._count_by_field(total, "style"),
                "by_collapse_type": self._count_by_field(total, "collapse_type"),
            }
    
    def _count_by_field(self, fragments: list[IRCFragmentDB], field: str) -> dict:
        """Count fragments by a field value."""
        counts = {}
        for f in fragments:
            value = getattr(f, field)
            counts[value] = counts.get(value, 0) + 1
        return counts
    
    async def delete_fragment(self, fragment_id: str) -> bool:
        """Delete a fragment (for cleanup/moderation)."""
        with self.session_factory() as session:
            fragment = session.get(IRCFragmentDB, fragment_id)
            if not fragment:
                return False
            
            session.delete(fragment)
            session.commit()
            logger.info(f"Deleted fragment {fragment_id}")
            return True
    
    async def get_recent_fragments(self, limit: int = 10) -> list[IRCFragment]:
        """Get recently shown fragments for debugging/review."""
        with self.session_factory() as session:
            statement = (
                select(IRCFragmentDB)
                .where(IRCFragmentDB.last_shown_at != None)
                .order_by(IRCFragmentDB.last_shown_at.desc())
                .limit(limit)
            )
            fragments = session.exec(statement).all()
            return [self._db_to_model(f) for f in fragments]

