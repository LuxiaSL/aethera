# IRC Discord Bot Spec (Future)

**Status:** Planned - implement after core IRC generation pipeline is verified working

## Overview

A Discord bot for rating IRC fragments without SSH/CLI access. Sends fragment previews to a Discord channel with rating buttons, updates the database on interaction.

## Why Discord?

| Need | CLI Solution | Discord Solution |
|------|--------------|------------------|
| Rate fragments | SSH + `irc_admin.py` | Tap button on phone |
| Multi-admin | One terminal at a time | Async collaboration |
| Notifications | Manual polling | Push alerts |
| Audit trail | Manual | Built into Discord |
| Daily workflow | Context switch | Passive glance |

## Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   aethera       │         │  discord_bot    │
│   (FastAPI)     │         │  (discord.py)   │
│                 │         │                 │
│  irc.sqlite ◄───┼─────────┼─── reads/writes │
│                 │         │                 │
└─────────────────┘         └─────────────────┘
        ▲                           │
        │                           ▼
   [WebSocket]                 [Discord Gateway]
   [Browsers]                  [Admin DMs/Channel]
```

**Key:** Bot runs as separate process. Can be same VPS, different server, or local.

## User Flow

1. Generation pipeline produces fragment → saved with `quality_score`, no `manual_rating`
2. Bot polls DB every N minutes for unrated fragments
3. Bot sends embed to configured channel with preview + buttons
4. Admin clicks rating button
5. Bot updates `manual_rating` in DB
6. Message updates to show who rated it
7. Fragment enters broadcast rotation (if accepted)

## Discord Message Format

```
┌─────────────────────────────────────────────────────┐
│ 📜 New Fragment: abc123def                           │
│ ─────────────────────────────────────────────────── │
│ Style: chaotic                                       │
│ Collapse: netsplit                                   │
│ Quality Score: 0.72                                  │
│ Messages: 24                                         │
│ ─────────────────────────────────────────────────── │
│                                                      │
│ <xXx_sl4yer_xXx> ok but what if we're all npcs      │
│ <fungus> i am definitely not an npc i have          │
│          original thoughts                           │
│ <xXx_sl4yer_xXx> that's exactly what an npc would   │
│                  say                                 │
│ <goblin_mode> im in goblin mode rn                  │
│ ...                                                  │
│ *** xXx_sl4yer_xXx has quit (netsplit)              │
│ *** fungus has quit (netsplit)                      │
│                                                      │
│ ─────────────────────────────────────────────────── │
│                                                      │
│ [👎 Reject]  [👌 OK]  [👍 Good]  [📄 Full Log]      │
│                                                      │
└─────────────────────────────────────────────────────┘
```

After rating:
```
✅ Fragment abc123def rated 👍 (3) by @luxia
```

## Button Actions

| Button | Action | DB Update |
|--------|--------|-----------|
| 👎 Reject | Mark as bad, exclude from rotation | `manual_rating = 1` |
| 👌 OK | Accept, normal priority | `manual_rating = 2` |
| 👍 Good | Accept, high priority | `manual_rating = 3` |
| 📄 Full Log | DM full fragment text | None |

## Configuration

```bash
# .env
DISCORD_BOT_TOKEN=...
DISCORD_CHANNEL_ID=123456789          # Channel for fragment review
DISCORD_ADMIN_ROLE_ID=987654321       # Role that can rate (optional)
IRC_DATABASE_PATH=/path/to/irc.sqlite # Or use IRC_DATABASE_URL
```

## File Structure

```
aethera/
└── tools/
    └── discord_bot/
        ├── bot.py              # Main bot
        ├── views.py            # Discord UI components
        ├── db.py               # Database operations
        ├── config.py           # Configuration
        ├── requirements.txt    # discord.py, etc.
        └── README.md           # Setup instructions
```

## Implementation Sketch

```python
# bot.py
import discord
from discord.ext import commands, tasks

class FragmentBot(commands.Bot):
    def __init__(self, db_path: str, channel_id: int):
        intents = discord.Intents.default()
        super().__init__(command_prefix="!", intents=intents)
        self.db_path = db_path
        self.channel_id = channel_id
    
    async def setup_hook(self):
        self.check_unrated.start()
    
    @tasks.loop(minutes=5)
    async def check_unrated(self):
        """Poll for unrated fragments."""
        fragments = get_unrated_fragments(self.db_path, limit=5)
        channel = self.get_channel(self.channel_id)
        
        for frag in fragments:
            # Mark as "pending review" to avoid duplicate sends
            mark_pending(self.db_path, frag.id)
            
            embed = self.build_embed(frag)
            view = RatingView(frag.id, self.db_path)
            await channel.send(embed=embed, view=view)
    
    def build_embed(self, frag) -> discord.Embed:
        # Build preview embed with first/last few messages
        ...

class RatingView(discord.ui.View):
    def __init__(self, fragment_id: str, db_path: str):
        super().__init__(timeout=None)  # Persist across restarts
        self.fragment_id = fragment_id
        self.db_path = db_path
    
    @discord.ui.button(label="Reject", emoji="👎", style=discord.ButtonStyle.red)
    async def reject(self, interaction: discord.Interaction, button):
        await self._rate(interaction, 1, "rejected")
    
    @discord.ui.button(label="OK", emoji="👌", style=discord.ButtonStyle.gray)  
    async def ok(self, interaction: discord.Interaction, button):
        await self._rate(interaction, 2, "accepted")
    
    @discord.ui.button(label="Good", emoji="👍", style=discord.ButtonStyle.green)
    async def good(self, interaction: discord.Interaction, button):
        await self._rate(interaction, 3, "accepted (good)")
    
    @discord.ui.button(label="Full", emoji="📄", style=discord.ButtonStyle.secondary)
    async def full(self, interaction: discord.Interaction, button):
        frag = get_fragment(self.db_path, self.fragment_id)
        text = format_full_log(frag)
        await interaction.user.send(f"```\n{text[:1900]}\n```")
        await interaction.response.defer()
    
    async def _rate(self, interaction: discord.Interaction, rating: int, label: str):
        update_rating(self.db_path, self.fragment_id, rating)
        emoji = {1: "👎", 2: "👌", 3: "👍"}[rating]
        await interaction.response.edit_message(
            content=f"✅ Fragment `{self.fragment_id}` {label} {emoji} by {interaction.user.mention}",
            embed=None,
            view=None
        )
```

## Deployment Options

1. **Same VPS as aethera** - Simplest, direct DB access
2. **Separate server** - Need to expose DB or add API endpoint
3. **Local dev machine** - For testing, connect to remote DB via SSH tunnel

## Dependencies

```
discord.py>=2.0
python-dotenv
sqlmodel  # Or just sqlite3 if keeping it light
```

## Security Considerations

- Bot token is a secret → `.env` file, not in repo
- Optional: Restrict rating to specific Discord role
- Button custom_ids include fragment ID → validate before DB update
- Rate limiting on Discord side handles spam

## Future Enhancements

- Slash commands for manual operations (`/irc stats`, `/irc generate`)
- Thread per fragment for discussion before rating
- Batch rating mode (carousel of fragments)
- Generation trigger from Discord
- Webhook notifications for collapse events (for the aesthetic)

---

## Prerequisites

Before implementing:
1. ✅ Core IRC generation pipeline working
2. ✅ Autoloom producing scored fragments
3. ✅ Manual rating via CLI confirmed working
4. ⏳ Discord bot application created at discord.com/developers

## Estimated Effort

~200-300 lines of Python. Half a day to implement and test.

