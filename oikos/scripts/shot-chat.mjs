/**
 * shot-chat.mjs — two people in #oikos, through the real UI: ada (an op, by
 * her tripcode) and bob. They talk, bob asks who ada is, tries a name that
 * isn't his, and gets kicked. Photographs both sides.
 *
 * The server must run with AETHERA_CHAT_OPS set to the tripcode of --op-pass.
 *
 *   npm run shot-chat -- [--base http://localhost:2222] [--out shots/chat] [--op-pass local-op-test]
 */

import { mkdirSync } from 'fs';
import { resolve } from 'path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]]] : acc), []),
);
const base = args.base ?? 'http://localhost:2222';
const out = resolve(args.out ?? 'shots/chat');
const opPass = args['op-pass'] ?? 'local-op-test';
mkdirSync(out, { recursive: true });

const { chromium } = await import('playwright');
// no WebGL: two software-rendered rooms at once starve each other, and the
// chat doesn't need the room (this is also the no-WebGL desktop's path)
const browser = await chromium.launch({ args: ['--disable-3d-apis', '--disable-webgl'] });
const errors = [];
const fails = [];
const check = (ok, what) => {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`);
  if (!ok) fails.push(what);
};

async function person(tag) {
  // separate contexts: separate localStorage, like two people
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 800 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`${tag} pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/favicon|Failed to load resource|hljs/.test(m.text())) errors.push(`${tag} console: ${m.text()}`);
  });
  await page.goto(`${base}/oikos#mirc`, { waitUntil: 'domcontentloaded' });
  await page.locator('.mirc-window').waitFor({ timeout: 60000 });
  return page;
}

const type = async (page, line) => {
  const input = page.locator('.mirc-input');
  await input.fill(line);
  await input.press('Enter');
  await page.waitForTimeout(400);
};
const log = (page) => page.locator('.mirc-pane:not([hidden]) .mirc-log').innerText();
const title = (page) => page.locator('.mirc-window .xp-title').textContent();

async function join(page, nick, pass) {
  await type(page, '/join #oikos');
  const dlg = page.locator('.mirc-connect');
  await dlg.waitFor();
  await dlg.locator('input[type=text]').fill(nick);
  if (pass) await dlg.locator('input[type=password]').fill(pass);
  await dlg.getByRole('button', { name: 'Connect' }).click();
  await page.waitForTimeout(1200);
}

const ada = await person('ada');
const bob = await person('bob');

await join(ada, 'ada', opPass);
check((await title(ada))?.includes('#oikos [1]'), `ada is in #oikos alone: ${await title(ada)}`);
check((await ada.locator('.mirc-pane:not([hidden]) .mirc-nicks').innerText()).includes('@ada'), 'ada is @ by her tripcode');

// bob first tries a reserved name, gets asked again, then picks his own
await type(bob, '/join #oikos');
await bob.locator('.mirc-connect input[type=text]').fill('luxia');
await bob.locator('.mirc-connect').getByRole('button', { name: 'Connect' }).click();
await bob.waitForTimeout(1200);
const err = await bob.locator('.mirc-connect .err').textContent().catch(() => null);
check(!!err && /Erroneous/i.test(err), `a reserved nick is refused and the dialog comes back: ${err}`);
await bob.locator('.mirc-connect input[type=text]').fill('bob');
await bob.locator('.mirc-connect').getByRole('button', { name: 'Connect' }).click();
await bob.waitForTimeout(1200);

await type(ada, 'hello, whoever you are');
await type(bob, 'hi! is this thing live?');
await type(bob, '/me looks around the room of screens');
await type(bob, '/whois ada');
await type(ada, '/topic the living room · tonight: nobody is haunted');
await ada.waitForTimeout(600);

const adaLog = await log(ada);
const bobLog = await log(bob);
check(bobLog.includes('<ada> hello, whoever you are'), 'bob hears ada');
check(adaLog.includes('<bob> hi! is this thing live?'), 'ada hears bob');
check(adaLog.includes('* bob looks around the room of screens'), 'actions arrive');
check(/ada is ~ada@\w+\.trip\.aetherawi\.red/.test(bobLog), 'whois shows the trip as the host');
check(bobLog.includes('ada is a channel operator'), 'whois knows ada is an op');
check((await title(bob))?.includes('nobody is haunted'), `topic reaches bob's title: ${await title(bob)}`);
check(!/127\.0\.0\.1|::1/.test(adaLog + bobLog), 'no IP anywhere in either transcript');
await ada.screenshot({ path: `${out}/ada.png` });
await bob.screenshot({ path: `${out}/bob.png` });

await type(bob, '/kick ada');
check((await log(bob)).includes("You're not channel operator"), 'bob cannot kick');
await type(ada, '/kick bob too much looking around');
await bob.waitForTimeout(1000);
check((await log(bob)).includes('You were kicked from #oikos by ada (too much looking around)'), 'bob is told he was kicked');
check((await log(ada)).includes('bob was kicked by ada'), 'ada sees the kick');
await bob.screenshot({ path: `${out}/bob-kicked.png` });

// kicked means banned for a while: joining again is refused
await type(bob, '/join #oikos');
// the dialog waits for him (the Enter that typed /join must not also submit it)
check((await bob.locator('.mirc-connect').count()) === 1, 'the Connect dialog opens and waits, nick remembered');
check((await bob.locator('.mirc-connect input[type=text]').inputValue()) === 'bob', 'it remembers his nick');
await bob.locator('.mirc-connect').getByRole('button', { name: 'Connect' }).click();
await bob.waitForTimeout(1200);
await bob.getByRole('tab', { name: 'Status' }).click();
check((await log(bob)).includes('Cannot join channel (+b)'), 'and is banned for a while');

// and #aethera still refuses everyone, with the hint
await ada.getByRole('tab', { name: '#aethera' }).click();
await type(ada, 'can the ghosts hear me');
check((await log(ada)).includes('#aethera Cannot send to channel'), '#aethera is still +m');
check((await log(ada)).includes('<ada> can the ghosts hear me'), '#aethera echo uses your chat nick');

await browser.close();
if (errors.length) console.error(errors.join('\n'));
console.log(fails.length || errors.length ? `${fails.length} failed, ${errors.length} page errors` : `all good → ${out}`);
process.exit(fails.length || errors.length ? 1 : 0);
