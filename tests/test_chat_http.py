"""
#oikos over HTTP (agents, scripts, curl), and #aethera's memory: the history
the broadcaster keeps for late listeners and for /api/irc/recent.
"""
import asyncio
import json

import pytest
from fastapi.testclient import TestClient

from aethera.api import chat as chat_api
from aethera.api import irc as irc_api
from aethera.chat import ChatHub
from aethera.chat.sessions import HTTP_BURST, HttpSessions
from aethera.irc.broadcaster import AFTERIMAGE, REPLAY_MAX, IRCBroadcaster
from aethera.main import app
from aethera.utils.rate_limit import RATE_LIMITS


@pytest.fixture
def client():
    chat_api._hub = ChatHub()
    chat_api._sessions = None
    RATE_LIMITS.clear()
    yield TestClient(app)
    chat_api._hub = None
    chat_api._sessions = None
    RATE_LIMITS.clear()


def join(client, nick, password=None, fmt=""):
    r = client.post(f"/api/chat/join{fmt}", json={"nick": nick, "password": password})
    return r


def auth(token):
    return {"authorization": f"Bearer {token}"}


# ---- the HTTP flow ------------------------------------------------------------

def test_guide_is_plain_text_and_names_the_calls(client):
    r = client.get("/api/chat")
    assert r.status_code == 200 and r.headers["content-type"].startswith("text/plain")
    for word in ("JOIN", "TALK", "LISTEN", "LEAVE", "/api/chat/join", "/api/irc/recent", "Bearer"):
        assert word in r.text


def test_two_programs_talk(client):
    a = join(client, "ada").json()
    b = join(client, "bob").json()
    assert [n["nick"] for n in b["names"]] == ["ada", "bob"]

    r = client.post("/api/chat/send", headers={**auth(a["token"]), "content-type": "text/plain"}, content="hello, room")
    assert r.json()["ok"] is True
    r = client.post("/api/chat/send", headers=auth(b["token"]), json={"line": "/me waves"})
    assert r.json()["ok"] is True

    ev = client.get(f"/api/chat/events?since={b['cursor']}", headers=auth(b["token"])).json()
    kinds = [(e["event"]["kind"], e["event"]["nick"], e["event"]["text"]) for e in ev["events"]]
    assert ("message", "ada", "hello, room") in kinds
    assert ("action", "bob", "waves") in kinds  # your own lines come back too
    # nothing new: an empty answer, same cursor
    again = client.get(f"/api/chat/events?since={ev['cursor']}", headers=auth(b["token"])).json()
    assert again["events"] == [] and again["cursor"] == ev["cursor"]


def test_text_format_reads_like_irc(client):
    r = join(client, "ada", fmt="?format=text")
    assert r.headers["content-type"].startswith("text/plain")
    first, *rest = r.text.splitlines()
    assert first.startswith("token: ")
    token = first.split(": ", 1)[1]
    assert "* Now talking in #oikos" in rest
    assert rest[-1].startswith("-- cursor ")
    client.post("/api/chat/send", headers={**auth(token), "content-type": "text/plain"}, content="plain words")
    t = client.get("/api/chat/events?since=0&format=text", headers=auth(token)).text.splitlines()
    assert any(line.endswith("<ada> plain words") for line in t)
    assert t[-1].startswith("-- cursor ")


def test_whois_and_errors_answer_in_the_reply(client):
    a = join(client, "ada", "sesame").json()
    b = join(client, "bob").json()
    r = client.post("/api/chat/send?format=text", headers=auth(b["token"]), json={"line": "/whois ada"}).text
    assert "ada is identified by tripcode" in r and ".trip.aetherawi.red" in r
    # answered in the reply, so not again in the feed
    feed = client.get("/api/chat/events?since=0", headers=auth(b["token"])).json()
    assert not any(e["type"] == "whois" for e in feed["events"])
    assert feed["missed"] is False
    r = client.post("/api/chat/send", headers=auth(b["token"]), json={"line": "/frobnicate"}).json()
    assert r["ok"] is False and r["replies"][0]["code"] == "421"
    r = client.post("/api/chat/send", headers=auth(b["token"]), json={"line": "/kick ada"}).json()
    assert r["replies"][0]["code"] == "482"
    # a line starting with // is said, one slash stripped
    client.post("/api/chat/send", headers=auth(a["token"]), json={"line": "//etc/motd is a file"})
    ev = client.get("/api/chat/events?since=0", headers=auth(b["token"])).json()
    assert any(e["event"]["text"] == "/etc/motd is a file" for e in ev["events"] if e["type"] == "event")


def test_http_members_are_paced(client):
    a = join(client, "chatty").json()
    oks = [client.post("/api/chat/send", headers=auth(a["token"]), json={"line": f"line {i}"}).json()["ok"] for i in range(HTTP_BURST + 1)]
    assert oks == [True] * HTTP_BURST + [False]


def test_no_token_or_parted_is_401(client):
    assert client.get("/api/chat/events").status_code == 401
    assert client.post("/api/chat/send", headers=auth("nope"), json={"line": "hi"}).status_code == 401
    a = join(client, "ada").json()
    b = join(client, "bob").json()
    assert client.post("/api/chat/part", headers=auth(a["token"])).status_code == 200
    assert client.get("/api/chat/events", headers=auth(a["token"])).status_code == 401
    ev = client.get("/api/chat/events?since=0", headers=auth(b["token"])).json()
    quits = [e["event"] for e in ev["events"] if e["type"] == "event" and e["event"]["kind"] == "quit"]
    assert quits and quits[-1]["nick"] == "ada" and quits[-1]["text"] == "Leaving"


def test_bad_join_and_taken_nick(client):
    assert client.post("/api/chat/join", content="not json").status_code == 400
    assert join(client, "ada").status_code == 200
    r = join(client, "ADA")
    assert r.status_code == 409 and r.json()["code"] == "433"


def test_join_rate_limit(client):
    codes = []
    for i in range(chat_api.JOINS_PER_MIN + 1):
        r = join(client, f"n{i}")
        codes.append(r.status_code)
        if r.status_code == 200:
            client.post("/api/chat/part", headers=auth(r.json()["token"]))
    assert codes[-1] == 429 and all(c == 200 for c in codes[:-1])


# ---- sessions, below HTTP -------------------------------------------------------

class Clock:
    def __init__(self):
        self.t = 100.0

    def __call__(self):
        return self.t


def test_quiet_sessions_ping_out_and_polls_keep_you_in():
    async def go():
        clock = Clock()
        hub = ChatHub(clock=clock)
        store = HttpSessions(hub, idle_s=90, clock=clock)
        quiet, _ = await store.join("1.1.1.1", "quiet", None)
        busy, _ = await store.join("2.2.2.2", "busy", None)
        clock.t += 60
        store.get(busy.token)  # a poll
        clock.t += 40
        assert await store.reap() == 1
        assert [n.nick for n in hub.names()] == ["busy"]
        quits = [d["event"] for _, d in busy.items if d.get("type") == "event" and d["event"]["kind"] == "quit"]
        assert quits[-1]["nick"] == "quiet" and quits[-1]["text"] == "Ping timeout"
        assert store.get(quiet.token) is None
        if store._reaper:
            store._reaper.cancel()

    asyncio.run(go())


def test_long_poll_wakes_on_a_line():
    async def go():
        hub = ChatHub()
        store = HttpSessions(hub)
        a, _ = await store.join("1.1.1.1", "ada", None)
        b, _ = await store.join("2.2.2.2", "bob", None)
        mark = b.cursor

        async def later():
            await asyncio.sleep(0.05)
            await store.line(a, "wake up")

        t0 = asyncio.get_running_loop().time()
        await asyncio.gather(b.wait(mark, 5), later())
        assert asyncio.get_running_loop().time() - t0 < 1
        items, missed = b.since(mark)
        assert not missed and items[-1]["event"]["text"] == "wake up"
        if store._reaper:
            store._reaper.cancel()

    asyncio.run(go())


def test_kicked_session_is_told_then_closed():
    async def go():
        from aethera.models.models import Comment

        trip = Comment.generate_tripcode("op")
        hub = ChatHub(ops=frozenset({trip}))
        store = HttpSessions(hub)
        op, _ = await store.join("1.1.1.1", "op", "op")
        pest, _ = await store.join("2.2.2.2", "pest", None)
        await store.line(op, "/kick pest bye")
        items, _ = pest.since(0)
        assert pest.closed and pest.kicked
        assert items[-1]["event"]["kind"] == "kick"
        r = await store.line(pest, "hello?")
        assert r[0]["code"] == "NOTCONN"
        if store._reaper:
            store._reaper.cancel()

    asyncio.run(go())


# ---- #aethera's memory ----------------------------------------------------------

async def _none():
    return None


def msg(i, t="message"):
    return {"type": "message", "data": {"nick": f"g{i}", "content": f"line {i}", "type": t, "timestamp": "04:12:00"}}


class FakeWS:
    def __init__(self):
        self.sent = []

    async def accept(self):
        pass

    async def send_json(self, m):
        self.sent.append(m)


def test_new_listeners_get_the_fragment_so_far():
    async def go():
        b = IRCBroadcaster(get_next_fragment=_none)
        for i in range(5):
            await b._broadcast(msg(i))
        await b._broadcast({"type": "fragment_end"})
        for i in range(5, 8):
            await b._broadcast(msg(i))
        ws = FakeWS()
        await b.connect(ws)
        assert ws.sent[0]["type"] == "connected"
        replayed = [m["data"]["content"] for m in ws.sent[1:]]
        assert replayed == ["line 5", "line 6", "line 7"]
        assert all(m.get("replay") for m in ws.sent[1:])
        # and they're live after that
        await b._broadcast(msg(8))
        assert ws.sent[-1]["data"]["content"] == "line 8" and "replay" not in ws.sent[-1]

    asyncio.run(go())


def test_between_fragments_they_get_an_afterimage():
    async def go():
        b = IRCBroadcaster(get_next_fragment=_none)
        for i in range(20):
            await b._broadcast(msg(i))
        await b._broadcast({"type": "collapse_start", "collapseType": "netsplit"})
        await b._broadcast({"type": "fragment_end"})
        tail = [p for _, p in b._replay_tail()]
        assert len(tail) == AFTERIMAGE + 1 and tail[-1]["type"] == "fragment_end"
        assert tail[0]["data"]["content"] == f"line {20 - AFTERIMAGE}"

    asyncio.run(go())


def test_a_long_fragment_is_cut_but_keeps_its_collapse():
    async def go():
        b = IRCBroadcaster(get_next_fragment=_none)
        await b._broadcast({"type": "collapse_start", "collapseType": "gline"})
        for i in range(REPLAY_MAX + 10):
            await b._broadcast(msg(i))
        tail = [p for _, p in b._replay_tail()]
        assert tail[0]["type"] == "collapse_start"
        assert len(tail) == REPLAY_MAX + 1

    asyncio.run(go())


def test_irc_recent_long_polls_and_reads_as_text():
    b = IRCBroadcaster(get_next_fragment=_none)
    b._running = True  # don't start real playback in a test
    irc_api._broadcaster = b
    try:
        asyncio.run(b._broadcast(msg(1)))
        asyncio.run(b._broadcast({"type": "message", "data": {"nick": "~Morrigan", "content": "", "type": "kick",
                                                              "timestamp": "04:13:00", "meta": {"target": "Scratch", "reason": "curse"}}}))
        c = TestClient(app)
        j = c.get("/api/irc/recent").json()
        assert j["cursor"] == 2 and [i["seq"] for i in j["items"]] == [1, 2]
        t = c.get("/api/irc/recent?format=text").text.splitlines()
        assert t == ["[04:12] <g1> line 1", "[04:13] * Scratch was kicked by ~Morrigan (curse)", "-- cursor 2"]
        assert c.get("/api/irc/recent?since=2").json()["items"] == []
    finally:
        irc_api._broadcaster = None


def test_irc_wait_since_wakes():
    async def go():
        b = IRCBroadcaster(get_next_fragment=_none)

        async def later():
            await asyncio.sleep(0.05)
            await b._broadcast(msg(1))

        t0 = asyncio.get_running_loop().time()
        await asyncio.gather(b.wait_since(0, 5), later())
        assert asyncio.get_running_loop().time() - t0 < 1

    asyncio.run(go())


def test_missed_only_when_the_queue_really_overflowed():
    async def go():
        from aethera.chat import sessions as sess

        hub = ChatHub(burst=10_000)
        store = HttpSessions(hub)
        slow, _ = await store.join("1.1.1.1", "slow", None)
        loud, _ = await store.join("2.2.2.2", "loud", None)
        loud.member.burst = 10_000
        loud.member.tokens = 10_000.0
        _, missed = slow.since(0)
        assert missed is False
        for i in range(sess.QUEUE + 5):
            await store.line(loud, f"line {i}")
        items, missed = slow.since(0)
        assert missed is True and len(items) == sess.QUEUE
        if store._reaper:
            store._reaper.cancel()

    asyncio.run(go())
