"""
#oikos: joining, talking, nick rules, flood control, kicks, and that nobody's
IP ever leaves the server. The hub is driven with fake sockets via asyncio.run
(no async plugin), and the route once end to end through TestClient.
"""
import asyncio
import json

import pytest
from fastapi.testclient import TestClient

from aethera.api import chat as chat_api
from aethera.chat import ChatHub, Refused
from aethera.main import app
from aethera.models.models import Comment


class FakeSocket:
    def __init__(self, fail: bool = False):
        self.sent: list[dict] = []
        self.fail = fail
        self.closed: int | None = None

    async def send_json(self, data):
        if self.fail:
            raise ConnectionError("gone")
        self.sent.append(data)

    async def close(self, code: int = 1000):
        self.closed = code

    def of(self, kind: str) -> list[dict]:
        return [m for m in self.sent if m["type"] == kind]

    def events(self, kind: str | None = None) -> list[dict]:
        evs = [m["event"] for m in self.of("event")]
        return [e for e in evs if kind is None or e["kind"] == kind]


class Clock:
    def __init__(self):
        self.t = 1000.0

    def __call__(self) -> float:
        return self.t


def hello(nick: str, password: str | None = None) -> str:
    return json.dumps({"type": "hello", "nick": nick, "password": password})


def say(text: str, action: bool = False) -> str:
    return json.dumps({"type": "say", "text": text, "action": action})


def run(coro):
    return asyncio.run(coro)


def test_join_greets_and_tells_the_channel():
    async def go():
        hub = ChatHub()
        a, b = FakeSocket(), FakeSocket()
        await hub.admit(a, "1.1.1.1", hello("ada"))
        await hub.admit(b, "2.2.2.2", hello("bob", "hunter2"))
        welcome = b.of("welcome")[0]
        assert welcome["channel"] == "#oikos"
        assert [n["nick"] for n in welcome["names"]] == ["ada", "bob"]
        # ada was there first: she hears bob arrive, with his trip as his host
        trip = Comment.generate_tripcode("hunter2")
        joins = a.events("join")
        assert joins and joins[-1]["nick"] == "bob"
        assert joins[-1]["mask"] == f"~bob@{trip}.trip.aetherawi.red"
        # and bob's backlog has ada's join in it
        assert [e["nick"] for e in welcome["backlog"]] == ["ada"]

    run(go())


def test_no_ip_ever_leaves_the_server():
    async def go():
        hub = ChatHub()
        a, b = FakeSocket(), FakeSocket()
        m = await hub.admit(a, "203.0.113.9", hello("ada"))
        await hub.admit(b, "198.51.100.7", hello("bob"))
        await hub.handle(m, say("hi"))
        await hub.handle(m, json.dumps({"type": "whois", "nick": "bob"}))
        blob = json.dumps(a.sent + b.sent)
        assert "203.0.113.9" not in blob and "198.51.100.7" not in blob

    run(go())


def test_messages_are_cleaned_and_capped():
    async def go():
        hub = ChatHub()
        a = FakeSocket()
        m = await hub.admit(a, "1.1.1.1", hello("ada"))
        await hub.handle(m, say("\x03" + "4red‮ evil\nline "))
        assert a.events("message")[-1]["text"] == "4red evil line"
        await hub.handle(m, say("x" * 401))
        assert a.of("error")[-1]["code"] == "417"
        await hub.handle(m, say("   "))
        assert len(a.events("message")) == 1

    run(go())


@pytest.mark.parametrize("nick,code", [("9lives", "432"), ("has space", "432"), ("ChanServ", "432"), ("luxia", "432")])
def test_bad_nicks_are_refused(nick, code):
    async def go():
        hub = ChatHub()
        s = FakeSocket()
        with pytest.raises(Refused):
            await hub.admit(s, "1.1.1.1", hello(nick))
        assert s.of("error")[0]["code"] == code
        assert hub.count == 0

    run(go())


def test_reserved_nick_is_fine_for_an_op_trip():
    async def go():
        trip = Comment.generate_tripcode("the-house-key")
        hub = ChatHub(ops=frozenset({trip}))
        s = FakeSocket()
        m = await hub.admit(s, "1.1.1.1", hello("luxia", "the-house-key"))
        assert m.op and m.nick == "luxia"
        assert s.of("welcome")[0]["op"] is True

    run(go())


def test_nick_in_use_and_nick_change():
    async def go():
        hub = ChatHub()
        a, b = FakeSocket(), FakeSocket()
        ma = await hub.admit(a, "1.1.1.1", hello("ada"))
        with pytest.raises(Refused):
            await hub.admit(b, "2.2.2.2", hello("ADA"))
        assert b.of("error")[0]["code"] == "433"
        await hub.handle(ma, json.dumps({"type": "nick", "nick": "ada_"}))
        assert a.events("nick")[-1] == {**a.events("nick")[-1], "nick": "ada", "target": "ada_"}
        assert [n.nick for n in hub.names()] == ["ada_"]
        # the old name is free again
        await hub.admit(b, "2.2.2.2", hello("ada"))
        assert hub.count == 2

    run(go())


def test_flood_warns_then_quits_with_excess_flood():
    async def go():
        clock = Clock()
        hub = ChatHub(clock=clock, burst=3)
        a, watcher = FakeSocket(), FakeSocket()
        m = await hub.admit(a, "1.1.1.1", hello("spam"))
        await hub.admit(watcher, "2.2.2.2", hello("w"))
        for _ in range(3):
            assert await hub.handle(m, say("x"))
        assert await hub.handle(m, say("x"))  # strike 1
        assert a.of("error")[-1]["code"] == "FLOOD"
        assert await hub.handle(m, say("x"))  # strike 2
        assert not await hub.handle(m, say("x"))  # strike 3: gone
        quits = watcher.events("quit")
        assert quits[-1]["nick"] == "spam" and quits[-1]["text"] == "Excess Flood"
        assert hub.count == 1
        # time refills the bucket for everyone else
        clock.t += 10

    run(go())


def test_kick_needs_op_and_bans_for_a_while():
    async def go():
        clock = Clock()
        trip = Comment.generate_tripcode("op-pass")
        hub = ChatHub(ops=frozenset({trip}), clock=clock, ban_s=600)
        op_s, pest_s = FakeSocket(), FakeSocket()
        op = await hub.admit(op_s, "1.1.1.1", hello("opper", "op-pass"))
        pest = await hub.admit(pest_s, "6.6.6.6", hello("pest"))

        await hub.handle(pest, json.dumps({"type": "kick", "nick": "opper"}))
        assert pest_s.of("error")[-1]["code"] == "482"

        await hub.handle(op, json.dumps({"type": "kick", "nick": "pest", "reason": "enough"}))
        kick = op_s.events("kick")[-1]
        assert kick["target"] == "pest" and kick["text"] == "enough"
        assert pest_s.events("kick")  # they're told before the door closes
        assert pest_s.closed == 4001
        assert hub.count == 1

        again = FakeSocket()
        with pytest.raises(Refused):
            await hub.admit(again, "6.6.6.6", hello("pest2"))
        assert again.of("error")[0]["code"] == "474"
        clock.t += 601
        await hub.admit(FakeSocket(), "6.6.6.6", hello("pest2"))

    run(go())


def test_per_ip_and_capacity_limits():
    async def go():
        hub = ChatHub(per_ip=2, max_members=3)
        await hub.admit(FakeSocket(), "1.1.1.1", hello("a1"))
        await hub.admit(FakeSocket(), "1.1.1.1", hello("a2"))
        s = FakeSocket()
        with pytest.raises(Refused):
            await hub.admit(s, "1.1.1.1", hello("a3"))
        assert s.of("error")[0]["code"] == "465"
        await hub.admit(FakeSocket(), "2.2.2.2", hello("b1"))
        full = FakeSocket()
        with pytest.raises(Refused):
            await hub.admit(full, "3.3.3.3", hello("c1"))
        assert full.of("error")[0]["code"] == "471"

    run(go())


def test_dead_sockets_are_quit_not_crashed_on():
    async def go():
        hub = ChatHub()
        a, dead = FakeSocket(), FakeSocket()
        m = await hub.admit(a, "1.1.1.1", hello("ada"))
        await hub.admit(dead, "2.2.2.2", hello("ghost"))
        dead.fail = True
        await hub.handle(m, say("anyone?"))
        quits = a.events("quit")
        assert quits[-1]["nick"] == "ghost" and quits[-1]["text"] == "Connection reset by peer"
        assert [n.nick for n in hub.names()] == ["ada"]

    run(go())


def test_leave_is_idempotent_and_backlog_is_bounded():
    async def go():
        hub = ChatHub(backlog=5, burst=100)
        a = FakeSocket()
        m = await hub.admit(a, "1.1.1.1", hello("ada"))
        for i in range(20):
            await hub.handle(m, say(f"line {i}"))
        await hub.leave(m)
        await hub.leave(m)
        s = FakeSocket()
        await hub.admit(s, "2.2.2.2", hello("bob"))
        backlog = s.of("welcome")[0]["backlog"]
        assert len(backlog) == 5
        assert sum(1 for e in backlog if e["kind"] == "quit") == 1

    run(go())


def test_route_end_to_end():
    chat_api._hub = ChatHub()
    try:
        client = TestClient(app)
        with client.websocket_connect("/ws/chat") as ws:
            ws.send_text(hello("tester"))
            welcome = ws.receive_json()
            assert welcome["type"] == "welcome" and welcome["nick"] == "tester"
            ws.send_text(say("hello, room"))
            ev = ws.receive_json()
            assert ev["event"]["kind"] == "message" and ev["event"]["text"] == "hello, room"
            status = client.get("/api/chat/status").json()
            assert status == {"channel": "#oikos", "count": 1, "names": [{"nick": "tester", "op": False}]}
        assert chat_api._hub.count == 0
    finally:
        chat_api._hub = None
