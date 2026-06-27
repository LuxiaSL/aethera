"""
IRC Fragment Review Tool — a tiny local web UI for reading the banked pool.

NOT the public viewer. This is a throwaway curation/reading tool: it opens
data/irc.sqlite READ-ONLY (so it never interferes with a running banking job),
renders every fragment terminal-style, color-codes quality, and auto-polls so
newly-banked fragments show up as they land.

Spin up:
    uv run python -m aethera.irc.review            # http://127.0.0.1:7878
    uv run python -m aethera.irc.review --port 8123 --db data/irc.sqlite

Stdlib only (sqlite3 + http.server). Binds to localhost.
"""

from __future__ import annotations

import argparse
import json
import sqlite3
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


DB_PATH = "data/irc.sqlite"


def _read_fragments(db_path: str) -> list[dict]:
    """Read all fragments from the DB read-only (safe alongside a writer)."""
    uri = f"file:{Path(db_path).resolve()}?mode=ro"
    con = sqlite3.connect(uri, uri=True, timeout=5)
    try:
        con.execute("PRAGMA busy_timeout=3000")
        rows = con.execute(
            "SELECT id, style, collapse_type, quality_score, manual_rating, "
            "times_shown, generated_at, collapse_start_index, messages_json "
            "FROM irc_fragments ORDER BY generated_at DESC"
        ).fetchall()
    finally:
        con.close()

    out = []
    for r in rows:
        try:
            messages = json.loads(r[8])
        except Exception:
            messages = []
        out.append({
            "id": r[0],
            "style": r[1],
            "collapse_type": r[2],
            "quality_score": r[3],
            "manual_rating": r[4],
            "times_shown": r[5],
            "generated_at": r[6],
            "collapse_start_index": r[7] if r[7] is not None else -1,
            "message_count": len(messages),
            "messages": messages,
        })
    return out


PAGE = r"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>IRC fragment review</title>
<style>
  :root {
    --bg:#0b0d10; --panel:#12161b; --panel2:#161b22; --fg:#c9d1d9; --dim:#6e7681;
    --accent:#58a6ff; --green:#3fb950; --yellow:#d29922; --red:#f85149;
    --sys:#8b949e; --quit:#f85149; --action:#a371f7; --collapse:#1f1115;
  }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--fg);
    font:14px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; }
  header { position:sticky; top:0; z-index:10; background:var(--panel);
    border-bottom:1px solid #21262d; padding:10px 16px; display:flex;
    gap:14px; align-items:center; flex-wrap:wrap; }
  header h1 { font-size:15px; margin:0; color:var(--accent); font-weight:600; }
  header .stat { color:var(--dim); font-size:12px; }
  header label { color:var(--dim); font-size:12px; display:flex; gap:5px; align-items:center; }
  select, input[type=range] { background:var(--panel2); color:var(--fg);
    border:1px solid #30363d; border-radius:5px; padding:3px 6px; font:inherit; font-size:12px; }
  #dot { width:8px; height:8px; border-radius:50%; background:var(--green); display:inline-block; }
  #dot.stale { background:var(--dim); }
  main { padding:16px; max-width:1000px; margin:0 auto; }
  .frag { background:var(--panel); border:1px solid #21262d; border-radius:8px;
    margin-bottom:16px; overflow:hidden; }
  .frag.new { animation:flash 1.6s ease-out; }
  @keyframes flash { from { box-shadow:0 0 0 2px var(--green); } to { box-shadow:none; } }
  .fhead { display:flex; gap:12px; align-items:center; padding:9px 13px;
    background:var(--panel2); cursor:pointer; flex-wrap:wrap; border-bottom:1px solid #21262d; }
  .fhead:hover { background:#1b222b; }
  .badge { font-size:11px; padding:2px 7px; border-radius:10px; font-weight:600; }
  .badge.q-hi { background:rgba(63,185,80,.15); color:var(--green); }
  .badge.q-mid { background:rgba(210,153,34,.15); color:var(--yellow); }
  .badge.q-lo { background:rgba(248,81,73,.15); color:var(--red); }
  .tag { font-size:11px; color:var(--dim); }
  .tag b { color:var(--fg); font-weight:600; }
  .fid { color:var(--dim); font-size:11px; margin-left:auto; }
  .log { padding:10px 14px; white-space:pre-wrap; word-break:break-word; }
  .frag.collapsed .log { display:none; }
  .line { display:flex; gap:8px; }
  .ts { color:var(--dim); flex:0 0 auto; opacity:.6; }
  .nick { font-weight:600; }
  .msg .body { color:var(--fg); }
  .system .body, .join .body, .part .body { color:var(--sys); font-style:italic; }
  .action .body { color:var(--action); font-style:italic; }
  .quit .body, .kick .body { color:var(--quit); }
  .line.in-collapse { background:var(--collapse); }
  .empty { color:var(--dim); text-align:center; padding:60px; }
</style>
</head>
<body>
<header>
  <h1>IRC fragment review</h1>
  <span id="dot" title="auto-refresh"></span>
  <span class="stat" id="summary">loading…</span>
  <label>sort
    <select id="sort">
      <option value="new">newest</option>
      <option value="score">highest score</option>
      <option value="low">lowest score</option>
    </select>
  </label>
  <label>min score <span id="minlbl">0.0</span>
    <input type="range" id="minq" min="0" max="1" step="0.05" value="0">
  </label>
  <label>style
    <select id="style"><option value="">all</option></select>
  </label>
  <label><input type="checkbox" id="auto" checked> auto</label>
</header>
<main id="list"><div class="empty">loading…</div></main>

<script>
const NICK_COLORS = ["#58a6ff","#3fb950","#d29922","#a371f7","#f778ba","#39c5cf",
  "#ff7b72","#7ee787","#ffa657","#79c0ff","#d2a8ff","#56d364"];
function nickColor(n){let h=0;for(const c of n)h=(h*31+c.charCodeAt(0))>>>0;return NICK_COLORS[h%NICK_COLORS.length];}
function esc(s){return (s||"").replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));}
function qclass(q){return q==null?"q-mid":q>=0.7?"q-hi":q>=0.5?"q-mid":"q-lo";}

function renderLine(m, i, collapseIdx){
  const t = m.type || "message";
  const ts = esc(m.timestamp||"");
  const nk = esc(m.nick||"");
  const ct = esc(m.content||"");
  let inner;
  if(t==="message"){
    inner = `<span class="nick" style="color:${nickColor(nk)}">&lt;${nk}&gt;</span> <span class="body">${ct}</span>`;
  } else if(t==="action"){
    inner = `<span class="body">* ${nk} ${ct}</span>`;
  } else if(t==="quit"){
    inner = `<span class="body">⤫ ${nk} has quit${ct?` (${ct})`:""}</span>`;
  } else if(t==="part"){
    inner = `<span class="body">← ${nk} has left${ct?` (${ct})`:""}</span>`;
  } else if(t==="join"){
    inner = `<span class="body">→ ${nk} has joined</span>`;
  } else if(t==="kick"){
    const meta=m.meta||{}; const tgt=esc(meta.target||""); const rs=esc(meta.reason||"");
    inner = `<span class="body">⚠ ${tgt} was kicked by ${nk}${rs?` (${rs})`:""}</span>`;
  } else { // system / other
    inner = `<span class="body">*** ${ct||nk}</span>`;
  }
  const inC = (collapseIdx>=0 && i>=collapseIdx) ? " in-collapse" : "";
  return `<div class="line ${t}${inC}"><span class="ts">[${ts}]</span><span>${inner}</span></div>`;
}

function renderFrag(f){
  const q = f.quality_score;
  const qtxt = q==null ? "—" : q.toFixed(2);
  const rating = f.manual_rating ? ` ★${f.manual_rating}` : "";
  const log = f.messages.map((m,i)=>renderLine(m,i,f.collapse_start_index)).join("");
  return `<div class="frag" data-id="${f.id}">
    <div class="fhead" onclick="this.parentElement.classList.toggle('collapsed')">
      <span class="badge ${qclass(q)}">q ${qtxt}${rating}</span>
      <span class="tag"><b>${esc(f.style)}</b> / ${esc(f.collapse_type)}</span>
      <span class="tag">${f.message_count} msgs</span>
      <span class="tag">${esc((f.generated_at||"").replace("T"," ").slice(0,19))}</span>
      <span class="fid">${esc(f.id)}</span>
    </div>
    <div class="log">${log}</div>
  </div>`;
}

let lastIds = new Set();
let allFrags = [];

function applyView(){
  const sort = document.getElementById("sort").value;
  const minq = parseFloat(document.getElementById("minq").value);
  const style = document.getElementById("style").value;
  let v = allFrags.filter(f => (f.quality_score==null?0:f.quality_score) >= minq)
                  .filter(f => !style || f.style===style);
  if(sort==="score") v = [...v].sort((a,b)=>(b.quality_score||0)-(a.quality_score||0));
  else if(sort==="low") v = [...v].sort((a,b)=>(a.quality_score||0)-(b.quality_score||0));
  // "new" keeps DB order (already newest-first)
  const list = document.getElementById("list");
  list.innerHTML = v.length ? v.map(renderFrag).join("") : '<div class="empty">no fragments match</div>';
  // flash brand-new ones
  for(const el of list.querySelectorAll(".frag")){
    if(!lastIds.has(el.dataset.id)) el.classList.add("new");
  }
}

async function refresh(){
  try{
    const r = await fetch("/api/fragments");
    const data = await r.json();
    const newIds = new Set(data.map(f=>f.id));
    // populate style filter once
    const styleSel = document.getElementById("style");
    const styles = [...new Set(data.map(f=>f.style))].sort();
    if(styleSel.options.length-1 !== styles.length){
      const cur = styleSel.value;
      styleSel.innerHTML = '<option value="">all</option>' + styles.map(s=>`<option>${esc(s)}</option>`).join("");
      styleSel.value = cur;
    }
    const scored = data.filter(f=>f.quality_score!=null);
    const avg = scored.length ? (scored.reduce((a,f)=>a+f.quality_score,0)/scored.length) : 0;
    document.getElementById("summary").textContent =
      `${data.length} fragments · avg q ${avg.toFixed(2)} · ${scored.filter(f=>f.quality_score>=0.7).length} strong (≥0.7)`;
    allFrags = data;
    applyView();
    lastIds = newIds;
    document.getElementById("dot").classList.remove("stale");
  }catch(e){
    document.getElementById("dot").classList.add("stale");
  }
}

document.getElementById("sort").onchange = applyView;
document.getElementById("style").onchange = applyView;
document.getElementById("minq").oninput = e => {
  document.getElementById("minlbl").textContent = parseFloat(e.target.value).toFixed(2);
  applyView();
};
let timer = setInterval(()=>{ if(document.getElementById("auto").checked) refresh(); }, 5000);
refresh();
</script>
</body>
</html>"""


class Handler(BaseHTTPRequestHandler):
    db_path = DB_PATH

    def log_message(self, *a):  # quiet
        pass

    def _send(self, code: int, body: bytes, ctype: str):
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/":
            self._send(200, PAGE.encode("utf-8"), "text/html; charset=utf-8")
        elif path == "/api/fragments":
            try:
                data = _read_fragments(self.db_path)
                body = json.dumps(data).encode("utf-8")
                self._send(200, body, "application/json")
            except Exception as e:
                self._send(500, json.dumps({"error": str(e)}).encode(), "application/json")
        else:
            self._send(404, b"not found", "text/plain")


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(
        prog="python -m aethera.irc.review",
        description="Local read-only web UI for reviewing banked IRC fragments.",
    )
    parser.add_argument("--port", type=int, default=7878, help="Port (default: 7878)")
    parser.add_argument("--db", default=DB_PATH, help=f"SQLite path (default: {DB_PATH})")
    parser.add_argument("--host", default="127.0.0.1", help="Bind host (default: 127.0.0.1)")
    args = parser.parse_args(argv)

    db = Path(args.db)
    if not db.exists():
        print(f"DB not found: {db.resolve()}", file=sys.stderr)
        return 1

    Handler.db_path = str(db)
    server = ThreadingHTTPServer((args.host, args.port), Handler)
    n = len(_read_fragments(str(db)))
    print(f"IRC fragment review → http://{args.host}:{args.port}  ({n} fragments, reading {db})")
    print("Ctrl-C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nstopped.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
