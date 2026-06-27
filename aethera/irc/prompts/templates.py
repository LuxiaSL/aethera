"""
IRC Prompt Templates

Templates and configuration for IRC generation prompts.
Uses timestamped examples with metadata headers for better model steering.
"""

import os
import random
from pathlib import Path
from typing import Optional

from ..models import CollapseType, PacingStyle


# Path to example files
EXAMPLES_DIR = Path(__file__).parent / "examples"


# Style descriptions and associated topics
STYLE_DESCRIPTIONS = {
    "technical": {
        "description": "Technical discussion, programming, system administration",
        "topics": [
            # Concrete situations steer the base model far better than field names
            # (the topic is a filename slug — a SITUATION implies a story, a field
            # name doesn't). Session 4: pruned vague field-names, added frames.
            "reverse_engineering", "memory_leak", "race_condition",
            "buffer_overflow", "packet_sniffing", "stack_trace", "deadlock",
            "port_scanning", "fuzzing", "firmware", "cron_jobs", "disk_failure",
            "dropped_prod_table_thought_it_was_staging", "ssl_cert_expired_at_midnight",
            "backup_restore_was_empty_all_along", "ddos_is_coming_from_our_own_cron",
            "sudo_chmod_777_etc_recursive", "the_load_balancer_routes_to_itself",
            "merge_conflict_resolved_by_deleting_everyone", "disk_full_one_log_line",
            "we_deployed_on_friday_at_five", "the_migration_locked_the_users_table",
            "someone_pushed_node_modules_to_main", "uuid_collision_that_shouldnt_exist",
            "dns_change_propagated_to_wrong_ip", "rotated_the_key_told_no_one",
            "the_intern_has_root_on_prod", "our_api_key_trending_on_pastebin",
            "the_kill_switch_kills_the_kill_switch", "autoscaler_spun_up_ten_thousand_nodes",
            "the_off_by_one_charged_everyone_twice", "git_bisect_hit_the_initial_commit",
            "the_firewall_rule_locked_us_all_out", "replication_lag_is_now_three_days",
            "soldered_the_caps_in_backwards", "the_ram_is_bad_only_when_hot",
            "flashed_the_bios_over_ssh", "the_ups_battery_was_the_outage",
            "decompiled_the_vendor_blob", "found_a_backdoor_in_the_dependency",
            "packet_capture_has_someone_elses_traffic", "logging_passwords_in_plaintext",
            "the_test_suite_tests_nothing", "rebased_onto_the_wrong_branch",
            "feature_flag_stuck_on_for_one_user", "swapped_master_and_replica_dns",
            "the_container_can_see_the_host", "someone_already_logged_into_root",
            "the_webhook_is_calling_itself_forever", "truncate_instead_of_where",
            "clock_skew_invalidated_every_token", "prod_and_dev_share_one_database",
        ],
        "nicks": [
            "zero", "root_", "xen0", "null_ptr", "kernel_panic",
            "segfault", "chmod777", "sudo_", "localhost", "0xdeadbeef",
            "phr34k", "b0g", "warl0ck", "hex_", "ttyS0", "b1tflip",
            "nop_sled", "acidburn", "spinlock", "sh0dan",
        ],
        "pacing": PacingStyle.NORMAL,
    },
    "anomaly": {
        "description": "Users report increasingly WRONG things — glitches in their "
                       "systems, the logs, reality itself — until the channel itself "
                       "starts behaving wrong. Paranoid, uneasy, the haunting setting in",
        "topics": [
            "missing_time", "wrong_logs", "phantom_user", "recursion", "deja_vu",
            "silent_join", "timestamp_drift", "corrupted_buffer", "duplicate_self",
            "unread_lines", "clock_skew", "self_part", "echo_back", "who_is_here",
            "containment_breach", "phantom_join", "log_rewrites_itself",
            "nick_collision", "the_channel_remembers", "op_we_didnt_set",
            "quarantine_failed", "voices_in_backlog", "purge_on_contact",
            "seal_the_channel", "something_answered", "names_in_the_log",
            # session 4 expansion — concrete first-noticed anomalies that compound
            "the_logs_predict_us", "replies_to_unsent_messages", "timestamps_run_backward",
            "everyones_clock_different_year", "the_join_message_named_you",
            "a_user_who_isnt_connected", "my_nick_already_speaking",
            "ping_returns_my_own_message", "the_topic_keeps_editing_itself",
            "lines_arrive_in_a_dead_nick", "scrollback_grows_while_idle",
            "my_keystrokes_appear_before_typed", "two_of_me_in_nicklist",
            "the_motd_describes_my_room", "whois_returns_my_address",
            "messages_in_a_font_i_dont_have", "the_channel_knows_im_alone",
            "kicked_by_a_nonexistent_op", "my_webcam_light_on_when_i_join",
            "timestamps_count_down_to_zero", "the_log_file_is_already_tomorrow",
            "replies_from_my_future_self", "every_part_message_is_a_name",
            "the_server_lag_is_negative", "my_typing_indicator_wont_stop",
            "unread_count_exceeds_messages", "the_channel_logs_my_offline_hours",
            "the_away_message_is_a_warning", "the_bot_answers_before_the_command",
            "everyone_quit_but_keeps_talking", "the_ctcp_returns_my_heart_rate",
            "my_hostname_changed_to_a_date", "the_logs_omit_what_i_say",
            "a_pm_from_the_channel_itself", "highlighted_on_a_word_i_didnt_type",
            "the_modes_spell_my_password", "rejoin_puts_me_in_a_copy",
            "my_messages_arrive_translated", "the_quit_message_is_my_location",
        ],
        "nicks": [
            "nightwatch", "_grep", "tape_hiss", "cron_daemon", "unclean_shutdown",
            "b0fh", "ghost_in_tty", "parity_err", "revenant_", "sigterm",
            "emptyroom", "notawake", "who_typed_that", "the_other_me", "no_carrier",
            "read_only_ghost", "splitbrain", "last_seen_never", "seen_you_before",
            "half_remembered", "quiet_join", "backscroll", "someone_left", "345am",
        ],
        "pacing": PacingStyle.SLOW,
    },
    "incident": {
        "description": "On-call engineers and admins scrambling in real time as "
                       "something actively breaks — outage, breach, exploit, runaway "
                       "process — escalating toward total breakdown. Terse, adrenaline, "
                       "gallows humor",
        "topics": [
            "prod_outage", "data_breach", "runaway_proc", "cert_expired", "disk_full",
            "cascading_fail", "db_corruption", "ddos_inbound", "oom_spiral",
            "replication_lag", "cred_leak", "dns_blackhole", "backup_failed",
            "rollback_stuck", "fork_bomb", "swap_death", "split_brain",
            "inode_exhaustion", "firmware_brick", "watchdog_reboot", "arp_poison",
            "session_hijack", "fd_leak", "tls_handshake_storm", "log_loop",
            # session 4 expansion — specific live emergencies a war-room reacts to
            "ransomware_encrypting_shares", "attacker_in_the_jump_host",
            "prod_db_dropped_by_migration", "kubernetes_evicting_everything",
            "secrets_pushed_to_public_repo", "load_balancer_serving_500s",
            "ups_battery_dying_now", "cooling_failed_racks_overheating",
            "deleted_the_wrong_prod_bucket", "expired_token_locked_out_admins",
            "queue_backed_up_to_disk", "deploy_bricked_every_node",
            "exfil_traffic_to_unknown_ip", "primary_region_went_dark",
            "stuck_in_crashloop_backoff", "billing_runaway_autoscaler",
            "leaked_signing_key_in_wild", "config_drift_broke_auth",
            "fiber_cut_uplink_down", "rogue_cron_deleting_logs",
            "tls_cert_revoked_mid_traffic", "replica_promoted_with_stale_data",
            "webhook_storm_self_ddos", "secret_rotated_nothing_updated",
            "container_registry_unreachable", "privilege_escalation_detected_live",
            "wiped_the_terraform_state", "cdn_purge_took_down_origin",
            "phishing_compromised_oncall", "raid_second_disk_failing",
            "flood_in_the_server_room", "rollback_corrupted_the_schema",
            "api_keys_being_brute_forced", "service_mesh_dropping_mtls",
            "monitoring_blind_collector_down", "patch_panel_yanked_wrong_cable",
            "feature_flag_enabled_for_everyone", "vpn_concentrator_melted_down",
        ],
        "nicks": [
            "oncall_dave", "sev1_", "backoff_", "oom_killer", "_winston",
            "graceful_d", "dmesg_tail", "flapping", "quorum_lost", "3am_again",
            "nullroute", "last_oncall", "pid1", "kill_9", "segfault_sam",
            "panic_root", "swap_thrash", "cold_standby", "core_dumped",
            "bgp_withdrawn", "restart_loop", "oncall_void",
        ],
        "pacing": PacingStyle.FRANTIC,
    },
    "support": {
        "description": "A helpdesk / tech-support channel where concrete problems and "
                       "increasingly frustrated 'helpers' meet — mundane turning absurd, "
                       "weary deadpan exasperation escalating to breakdown",
        "topics": [
            "cant_login", "printer_haunted", "layer8_error", "no_any_key",
            "worked_yesterday", "pebkac", "monitor_off", "deleted_system32",
            "cup_holder_broken", "ticket_unresolved", "password_is_password",
            "floppy_eaten", "modem_screaming", "reboot_didnt_help",
            "screen_upside_down", "internet_is_gone", "keyboard_typing_wrong",
            "attachment_too_big", "mouse_frozen", "email_wont_send",
            "fan_making_noise", "cd_tray_stuck", "network_drive_missing",
            "double_click_too_slow", "update_loop_forever",
            # session 4 expansion — specific tickets that start mundane, turn absurd/dark
            "user_typed_password_into_search_bar", "the_pc_only_boots_when_held",
            "mouse_pointer_lags_behind_real_one", "user_glued_the_usb_in_upside_down",
            "monitor_shows_yesterdays_meeting", "keyboard_only_caps_after_dark",
            "laptop_smells_like_someones_perfume", "printer_adds_a_name_to_every_list",
            "user_buried_the_router_in_the_yard", "webcam_light_on_no_app_open",
            "spreadsheet_totals_grow_overnight", "the_office_phone_dials_itself",
            "thermal_paste_was_toothpaste", "screen_reader_describes_things_not_there",
            "every_file_renamed_to_the_user", "the_scanner_only_scans_in_negative",
            "laptop_fan_spells_words_in_morse", "user_unplugged_everyone_elses_pc",
            "the_clock_runs_backward_in_one_app", "wifi_password_changes_to_a_threat",
            "user_microwaved_the_external_drive", "desktop_icons_rearrange_into_a_face",
            "intern_account_predates_the_company", "monitor_brightness_tracks_mood",
            "taped_over_camera_mic_and_speaker", "printer_jams_only_on_resignations",
            "the_pc_remembers_being_turned_off", "email_autocompletes_a_dead_contact",
            "screensaver_shows_the_users_house", "the_keyboard_missing_one_key",
            "installed_ram_in_the_disk_drive", "login_greets_them_by_dead_nickname",
            "server_logs_a_user_who_never_clocked_in", "drew_a_new_taskbar_in_sharpie",
            "monitor_works_better_facing_the_wall", "every_screenshot_has_a_reflection",
            "the_help_chat_is_already_answering",
        ],
        "nicks": [
            "helpdesk_", "tier1_dave", "sudo_make_me", "pls_help", "cant_print",
            "clueless_user", "ticket_4471", "anykey_where", "caps_LOCK", "helpbot",
            "PrinterLady", "ghost_in_pc", "mike_from_accounting", "ctrl_alt_defeat",
            "greg_in_sales", "tech_support_tom", "have_u_tried", "karen_h",
            "rtfm_bot", "unplugged_again", "night_shift_neil", "margaret_dialup",
            "frank_the_intern", "just_a_user",
        ],
        "pacing": PacingStyle.NORMAL,
    },
    "chaotic": {
        "description": "Unhinged energy, non-sequiturs, classic IRC chaos",
        "topics": [
            # Full makeover (session 4): the old topics were MOODS ("chaos", "3am",
            # "cursed") — nothing concrete to spiral out of, which made chaotic the
            # laggard. Replaced with specific absurd BITS that escalate.
            "is_cereal_a_soup", "ban_the_letter_e", "found_a_door_in_the_wall",
            "the_fridge_is_humming_in_morse", "electing_a_channel_president",
            "everyone_is_legally_steve_now", "the_ceiling_is_lower_tonight",
            "we_adopted_a_pigeon_named_gerald", "counting_to_a_million_together",
            "is_water_wet_tribunal", "my_reflection_waved_first",
            "building_a_country_in_the_channel", "the_moon_looks_fake_tonight",
            "argument_over_toast_doneness", "we_summoned_something_with_a_poll",
            "the_op_is_actually_three_raccoons", "renaming_all_the_colors",
            "my_houseplant_is_judging_me", "trial_for_pinging_at_3am",
            "the_great_spoon_shortage", "who_ate_the_last_cosmic_fry",
            "everyone_speak_only_in_questions", "the_walls_have_opinions_now",
            "describing_the_smell_of_blue", "we_are_all_in_a_jar",
            "knighting_people_for_no_reason", "the_clock_skipped_a_number",
            "my_sandwich_winked_at_me", "drafting_the_channel_constitution",
            "the_floor_is_a_suggestion", "rating_everyones_imaginary_hats",
            "is_a_straw_one_hole_or_two", "we_named_a_star_and_lost_it",
            "the_microwave_finished_too_early", "appointing_a_minister_of_vibes",
            "everyone_claims_to_be_the_real_op", "the_soup_is_watching_back",
            "outlawing_the_number_seven", "my_shadow_left_without_me",
            "we_invented_a_holiday_just_now", "fever_dream", "witching_hour",
        ],
        "nicks": [
            "xXx_sl4yer_xXx", "goblin_mode", "fungus", "cryptid",
            "3am_thoughts", "chaos_gremlin", "unhinged", "cursed_",
            "void_screamer", "sleep_deprived", "m0thman", "wormboy", "helldroid",
            "sl1me_", "gh0st_dad", "[teeth]", "roach_king", "dr_skin",
            "melatonin_od", "hollow_b0ne", "mold_baby", "bog_witch",
        ],
        "pacing": PacingStyle.FRANTIC,
    },
}


# Collapse type names for header
COLLAPSE_NAMES = {
    CollapseType.NETSPLIT: "netsplit",
    CollapseType.GLINE: "gline",
    CollapseType.MASS_KICK: "kick",
    CollapseType.PING_TIMEOUT: "timeout",
    CollapseType.SENDQ_EXCEEDED: "sendq",
    CollapseType.CORRUPTION: "corruption",
    CollapseType.KILL: "killed",
    CollapseType.SERVER_SHUTDOWN: "shutdown",
    CollapseType.TAKEOVER: "takeover",
    CollapseType.ERASURE: "erasure",
}


# Example collapse sequences for each type (with timestamps)
COLLAPSE_EXAMPLES = {
    CollapseType.NETSPLIT: """[05:12] *** Disconnected (irc.aethera.net void.aethera.net)
[05:12] *** zero has quit (irc.aethera.net void.aethera.net)
[05:12] *** lucid has quit (irc.aethera.net void.aethera.net)
[05:12] *** void_ has quit (irc.aethera.net void.aethera.net)
[05:12] *** dreamer has quit (irc.aethera.net void.aethera.net)""",

    CollapseType.GLINE: """[05:24] *** zero has been G-lined (Network ban)
[05:24] *** lucid has been G-lined (Network ban)
[05:24] -irc.aethera.net- You have been banned from this network
[05:25] *** Connection closed""",

    CollapseType.MASS_KICK: """[05:18] *** zero was kicked by ChanServ (Flood limit exceeded)
[05:18] *** lucid was kicked by ChanServ (Flood limit exceeded)
[05:18] *** void_ was kicked by ChanServ (Flood limit exceeded)
[05:18] *** dreamer was kicked by ChanServ (Flood limit exceeded)
[05:19] *** Channel has been cleared""",

    CollapseType.PING_TIMEOUT: """[05:32] *** zero has quit (Ping timeout: 245 seconds)
[05:34] *** lucid has quit (Ping timeout: 245 seconds)
[05:38] *** void_ has quit (Ping timeout: 252 seconds)
[05:40] *** Connection lost""",

    CollapseType.SENDQ_EXCEEDED: """[05:22] *** zero has quit (SendQ exceeded)
[05:22] *** lucid has quit (Excess Flood)
[05:22] *** void_ has quit (SendQ exceeded)
[05:23] *** Too many connections from your host""",

    CollapseType.CORRUPTION: """[05:??] *** ERR_UNKNOWN: conn̸̨ection ██ reset
[0?:??] <�sys> ▒▒▒ FATAL: memory corruption detected
[??:??] *** zero has quit (Connection reset by peer)
[??:??] *** lucid has quit (Read error: Connection reset by peer)
[??:??] *** ▓▓▓ CHANNEL STATE CORRUPTED ▓▓▓""",

    CollapseType.KILL: """[05:40] *** zero has quit (Killed (OperServ (Channel terminated)))
[05:40] *** lucid has quit (Killed (OperServ (you were warned)))
[05:40] *** void_ has quit (Killed (OperServ (Channel terminated)))
[05:41] *** dreamer has quit (Killed (OperServ (Channel terminated)))""",

    CollapseType.SERVER_SHUTDOWN: """[05:50] *** zero has quit (Server Terminating)
[05:50] *** lucid has quit (Server Terminating)
[05:50] *** void_ has quit (Server Terminating)
[05:51] *** ERROR :Closing Link: irc.aethera.net (Server shutting down)""",

    CollapseType.TAKEOVER: """[05:33] *** Erebus sets mode +o Erebus
[05:33] *** Erebus sets mode +b *!*@*
[05:33] *** Erebus sets mode +im
[05:34] *** zero has quit (Channel seized by Erebus)
[05:34] *** lucid has quit (Channel seized by Erebus)
[05:34] *** void_ has quit (Channel seized by Erebus)""",

    CollapseType.ERASURE: """[??:??] *** void_ has been removed
[??:??] *** lucid was never here
[??:??] *** the channel is forgetting
[??:??] *** zero was never here
[??:??] *** #aethera no longer exists""",
}


def load_examples_for_style(style: str, count: int = 2) -> list[str]:
    """
    Load random example files for a given style.
    
    Args:
        style: Style name (technical, philosophical, chaotic)
        count: Number of examples to load
        
    Returns:
        List of example file contents
    """
    style_dir = EXAMPLES_DIR / style
    examples = []
    
    if style_dir.exists():
        files = list(style_dir.glob("*.txt"))
        selected = random.sample(files, min(count, len(files))) if files else []
        
        for f in selected:
            try:
                examples.append(f.read_text().strip())
            except Exception:
                pass
    
    return examples


def load_random_examples(count: int = 2) -> list[str]:
    """
    Load random examples from any style.
    
    Returns:
        List of example file contents
    """
    all_files = []
    
    for style in STYLE_DESCRIPTIONS:
        style_dir = EXAMPLES_DIR / style
        if style_dir.exists():
            all_files.extend(style_dir.glob("*.txt"))
    
    selected = random.sample(all_files, min(count, len(all_files))) if all_files else []
    examples = []
    
    for f in selected:
        try:
            examples.append(f.read_text().strip())
        except Exception:
            pass
    
    return examples


# ==================== Combinatorial AXES (validated by capacity probes) ====================
# Each axis is a curated word pool surfaced as a diegetic header field (or, for
# clock, the opening timestamp). Probes confirmed the base model conditions on
# these (strong: bots, tone; moderate: era, clock). Dropped as unresolvable:
# abstract "wrongness/aware" tags. A grammar layer (roll_axes) activates a SUBSET
# per fragment so the header never over-stuffs — dreamgen's coherence mechanism.

TONE_POOL = [
    "comedic", "paranoid", "frantic", "melancholic", "deadpan",
    "dread, ominous", "manic", "weary", "wholesome", "sinister",
    "giddy", "bleak",
]

# (network, year) — strong, distinct lexical footprints (vocab, tech refs, nicks).
ERA_POOL = [
    ("EFnet", "1999"), ("DALnet", "2001"), ("Undernet", "2000"),
    ("QuakeNet", "2004"), ("Rizon", "2011"), ("freenode", "2008"),
    ("Libera.Chat", "2023"), ("a local BBS", "1991"), ("SpotChat", "2015"),
    ("OFTC", "2006"),
]

# (svc string for `svc:` field, bot_count for `+N bots`) — format-locked, the
# single highest-variety injector (bot lines self-reinforce their rigid grammar).
BOTS_POOL = [
    ("ChanServ,NickServ", 2), ("ChanServ,TriviaBot", 2), ("infobot", 1),
    ("ChanServ,OperServ", 2), ("a logging bot", 1), ("an eggdrop", 1),
    ("ChanServ,MemoServ", 2), ("a markov bot", 1), ("idlerpg", 1),
]

# Opening timestamp (the prefill) — graveyard-weighted for the cursed aesthetic.
CLOCK_POOL = [
    "03:33", "04:44", "02:11", "03:07", "00:14", "23:50", "01:42",
    "06:20", "09:02", "13:45", "17:30", "21:15",
]

# Per-style probability that the BOTS axis fires (technical/incident channels are
# bot-heavy; chaotic least). Tone/era/clock probabilities are style-agnostic.
_BOT_PROB = {"technical": 0.5, "incident": 0.5, "support": 0.4, "anomaly": 0.3, "chaotic": 0.2}


def roll_axes(style: str) -> dict:
    """Roll a combinatorial axis SUBSET for one fragment (the lightweight grammar).
    Returns kwargs for build_scaffold_prompt; each axis fires independently with a
    probability, so most fragments expose only 2-3 extra fields (anti-stuffing)."""
    axes: dict = {"start_time": random.choice(CLOCK_POOL)}  # clock is free (prefill)
    if random.random() < 0.7:
        axes["tone"] = random.choice(TONE_POOL)
    if random.random() < 0.5:
        net, yr = random.choice(ERA_POOL)
        axes["network"], axes["era"] = net, yr
    if random.random() < _BOT_PROB.get(style, 0.3):
        svc, n = random.choice(BOTS_POOL)
        axes["bots"], axes["bot_count"] = svc, n
    return axes


def build_header(
    channel: str = "#aethera",
    user_count: int = 4,
    message_count: int = 30,
    style: str = "chaotic",
    collapse_type: Optional[CollapseType] = None,
    network: Optional[str] = None,
    era: Optional[str] = None,
    tone: Optional[str] = None,
    bot_count: int = 0,
    bots: Optional[str] = None,
) -> str:
    """
    Build a diegetic log header. Optional fields are combinatorial AXES the base
    model demonstrably conditions on (validated by capacity probes): network+era
    (EFnet | 1999), tone (tone: dread), and bots (N users +M bots | svc: ChanServ).
    Each is a multiplier on the variety space; all render as native log metadata.

    Format: [LOG: #chan | <net> | <era> | N users[ +M bots] | M messages |
             style | tone: <tone> | svc: <bots> | ENDS: <collapse>]
    """
    parts = [f"[LOG: {channel}"]
    if network:
        parts.append(network)
    if era:
        parts.append(era)
    users_field = f"{user_count} users"
    if bot_count:
        users_field += f" +{bot_count} bots"
    parts.append(users_field)
    parts.append(f"{message_count} messages")
    parts.append(style)
    if tone:
        parts.append(f"tone: {tone}")
    if bots:
        parts.append(f"svc: {bots}")
    if collapse_type:
        parts.append(f"ENDS: {COLLAPSE_NAMES.get(collapse_type, 'quit')}")

    return " | ".join(parts) + "]"


def get_collapse_suffix(collapse_type: CollapseType) -> str:
    """
    Get the collapse example for a given type.
    
    Used to hint the model toward the desired ending style.
    """
    return COLLAPSE_EXAMPLES.get(collapse_type, COLLAPSE_EXAMPLES[CollapseType.NETSPLIT])


def get_style_topics(style: str) -> list[str]:
    """Get the list of topics for a style."""
    if style in STYLE_DESCRIPTIONS:
        return STYLE_DESCRIPTIONS[style]["topics"]
    return STYLE_DESCRIPTIONS["chaotic"]["topics"]


def get_style_nicks(style: str) -> list[str]:
    """Get example nicks for a style."""
    if style in STYLE_DESCRIPTIONS:
        return STYLE_DESCRIPTIONS[style]["nicks"]
    return STYLE_DESCRIPTIONS["chaotic"]["nicks"]


def get_style_pacing(style: str) -> PacingStyle:
    """Get the default pacing for a style."""
    if style in STYLE_DESCRIPTIONS:
        return STYLE_DESCRIPTIONS[style]["pacing"]
    return PacingStyle.NORMAL


def build_scaffold_prompt(
    examples: list[str],
    target_style: str,
    target_collapse: CollapseType,
    target_users: int = 4,
    target_messages: int = 30,
    channel: str = "#aethera",
    split_for_caching: bool = False,
    *,
    network: Optional[str] = None,
    era: Optional[str] = None,
    tone: Optional[str] = None,
    bots: Optional[str] = None,
    bot_count: int = 0,
    start_time: str = "00:00",
) -> str | tuple[str, str, str]:
    """
    Build a file-scaffold prompt for generation.
    
    The scaffold frames generation as reading files from a directory,
    which helps models understand the task and maintain consistency.
    
    Uses realistic terminal prompts (user@host:path$) to maximize
    the "CLI simulation" effect for base models.
    
    Examples should already include their [LOG: ...] headers.
    
    Args:
        split_for_caching: If True, returns (stable_prefix, target_intro, prefill) tuple
                          for optimal cache usage. stable_prefix can be cached,
                          target_intro + accumulated content is variable.
    
    Returns:
        If split_for_caching=False: Complete prompt string
        If split_for_caching=True: (stable_prefix, target_intro, prefill) tuple
    """
    topics = get_style_topics(target_style)
    target_topic = random.choice(topics)
    suffix = f"{random.randint(100, 999):03d}"
    
    # Realistic terminal prompt components
    user = "archivist"
    host = "irc-archive"
    base_path = "~/logs"
    
    def shell_prompt(path: str = base_path) -> str:
        return f"{user}@{host}:{path}$ "
    
    # Start with cd into the logs directory
    stable = f"{shell_prompt('~')}cd logs\n"
    stable += f"{shell_prompt()}ls\n"
    stable += "manifest.txt\n"
    
    # List example files
    for i, example in enumerate(examples, 1):
        stable += f"irc_log_{i:03d}.txt\n"
    
    # Add target file to listing
    target_filename = f"irc_{target_style}_{target_topic}_{suffix}.txt"
    stable += f"{target_filename}\n"
    stable += f"{shell_prompt()}"  # Show prompt waiting, then cat
    
    # Cat each example - THIS IS ALL STABLE/CACHEABLE
    for i, example in enumerate(examples, 1):
        if i == 1:
            stable += f"cat irc_log_{i:03d}.txt\n"
        else:
            stable += f"{shell_prompt()}cat irc_log_{i:03d}.txt\n"
        stable += example.strip()
        stable += "\n"

    # Everything after the examples is the "target intro"
    target_header = build_header(
        channel=channel,
        user_count=target_users,
        message_count=target_messages,
        style=target_style,
        collapse_type=target_collapse,
        network=network,
        era=era,
        tone=tone,
        bots=bots,
        bot_count=bot_count,
    )

    target_intro = f"{shell_prompt()}cat {target_filename}\n"
    target_intro += target_header + "\n"

    # Clock axis: the literal opening timestamp conditions time-of-day (graveyard
    # vs workday energy) — validated, zero-leak (it's native log syntax).
    prefill = f"[{start_time}] <"
    
    if split_for_caching:
        return (stable, target_intro, prefill)
    
    # Return combined prompt
    return stable + target_intro + prefill


def build_system_prompt() -> str:
    """
    System prompt for the OPTIONAL instruct-mode generation path only.

    The default path runs a base model in pure completion mode and passes NO
    system prompt at all (see IRCGenerator: only used when use_instruct_mode is
    True AND the provider is Anthropic). This text exists so that, if generation
    is ever pointed at an instruct model, it's kept in terminal-output mode
    rather than conversational-assistant mode — with no assistant/meta framing.
    """
    return (
        "Terminal session. Emit only the literal output of each command — the "
        "contents of files as they are read — with no commentary, preamble, or "
        "meta. Continue the current file in the same voice and format, and bring "
        "the channel to its collapse before the message count is reached."
    )


def build_chat_messages(
    examples: list[str],
    target_style: str,
    target_collapse: CollapseType,
    target_users: int = 4,
    target_messages: int = 30,
    channel: str = "#aethera",
) -> list[dict]:
    """
    Build messages array for chat-based generation.
    
    Returns:
        List of message dicts with 'role' and 'content'
    """
    messages = [
        {"role": "system", "content": build_system_prompt()},
    ]
    
    # Add examples as assistant messages (showing what good output looks like)
    for example in examples:
        messages.append({
            "role": "user",
            "content": "Generate an IRC log with the following header:\n\n" + example.split("\n")[0],
        })
        messages.append({
            "role": "assistant",
            "content": example,
        })
    
    # Build target header
    target_header = build_header(
        channel=channel,
        user_count=target_users,
        message_count=target_messages,
        style=target_style,
        collapse_type=target_collapse,
    )
    
    # Request generation
    messages.append({
        "role": "user",
        "content": f"Generate an IRC log with the following header:\n\n{target_header}",
    })
    
    return messages
