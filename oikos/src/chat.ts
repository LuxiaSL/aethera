/**
 * chat.ts — the line to #oikos, the channel where people talk.
 *
 * Unlike the feeds in data.ts this is never opened on its own: it connects
 * when you join from mIRC, as the nick you chose, and says goodbye when you
 * part or close the window. The password (for a tripcode) is held only for
 * as long as the connection might need to be re-made, and never stored.
 *
 * Shapes mirror aethera/chat/hub.py.
 */

export type ChatKind = 'message' | 'action' | 'join' | 'part' | 'quit' | 'kick' | 'nick' | 'topic';

export interface ChatEvent {
  kind: ChatKind;
  nick: string;
  at: number; // epoch ms
  mask?: string | null;
  text: string;
  target?: string | null;
}

export interface ChatName {
  nick: string;
  op: boolean;
}

export interface Welcome {
  channel: string;
  nick: string;
  mask: string;
  op: boolean;
  topic: string;
  names: ChatName[];
  backlog: ChatEvent[];
}

export interface WhoisReply {
  nick: string;
  mask: string;
  op: boolean;
  signon: number;
  trip: string | null;
}

export interface ChatHandlers {
  welcome(w: Welcome): void;
  event(e: ChatEvent): void;
  whois(w: WhoisReply): void;
  error(code: string, text: string): void;
  /** the line dropped; `retrying` when it will try again by itself;
   *  `takenOver` when another connection of ours took the seat */
  closed(retrying: boolean, kicked: boolean, takenOver: boolean): void;
}

/** 4001: the hub closes a kicked member's socket with this */
const KICKED = 4001;
/** 4002: our tripcode sat down elsewhere (another tab): don't fight it for the seat */
const TAKEN_OVER = 4002;
const RETRIES = 4;

export class ChatLink {
  private ws: WebSocket | null = null;
  private tries = 0;
  private timer = 0;
  private wanted = false;
  private welcomed = false;
  private refused = false;

  constructor(
    private nick: string,
    private password: string | null,
    private readonly on: ChatHandlers,
  ) {}

  get open(): boolean {
    return this.welcomed && this.ws?.readyState === WebSocket.OPEN;
  }

  connect(): void {
    this.wanted = true;
    this.refused = false;
    clearTimeout(this.timer);
    const proto = location.protocol === 'https:' ? 'wss' : 'ws';
    let ws: WebSocket;
    try {
      ws = new WebSocket(`${proto}://${location.host}/ws/chat`);
    } catch {
      this.on.closed(false, false, false);
      return;
    }
    this.ws = ws;
    this.welcomed = false;
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'hello', nick: this.nick, password: this.password || null }));
    };
    ws.onmessage = (ev) => {
      let msg: { type?: string; [k: string]: unknown };
      try {
        msg = JSON.parse(String(ev.data));
      } catch {
        return;
      }
      switch (msg.type) {
        case 'welcome': {
          const w = msg as unknown as Welcome;
          this.welcomed = true;
          this.tries = 0;
          this.nick = w.nick;
          this.on.welcome(w);
          break;
        }
        case 'event': {
          const e = (msg as { event?: ChatEvent }).event;
          if (!e) break;
          // follow our own renames, so a reconnect comes back as who we are now
          if (e.kind === 'nick' && e.nick === this.nick && e.target) this.nick = e.target;
          this.on.event(e);
          break;
        }
        case 'whois':
          this.on.whois(msg as unknown as WhoisReply);
          break;
        case 'error': {
          // turned away at the door (nick taken, banned, full): don't keep knocking
          if (!this.welcomed) this.refused = true;
          this.on.error(String(msg.code ?? ''), String(msg.text ?? ''));
          break;
        }
      }
    };
    ws.onclose = (ev) => {
      if (this.ws !== ws) return;
      this.ws = null;
      const kicked = ev.code === KICKED;
      const takenOver = ev.code === TAKEN_OVER;
      const retrying = this.wanted && !kicked && !takenOver && !this.refused && this.tries < RETRIES;
      this.welcomed = false;
      this.on.closed(retrying, kicked, takenOver);
      if (!retrying) {
        this.wanted = false;
        return;
      }
      this.tries++;
      this.timer = window.setTimeout(() => this.connect(), 2000 * 2 ** (this.tries - 1));
    };
  }

  send(msg: Record<string, unknown>): boolean {
    if (!this.open || !this.ws) return false;
    try {
      this.ws.send(JSON.stringify(msg));
      return true;
    } catch {
      return false;
    }
  }

  close(): void {
    this.wanted = false;
    clearTimeout(this.timer);
    const ws = this.ws;
    this.ws = null;
    this.welcomed = false;
    this.password = null;
    if (ws) {
      ws.onclose = null;
      try {
        ws.close();
      } catch {
        /* already gone */
      }
    }
  }
}
