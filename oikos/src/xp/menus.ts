/**
 * menus.ts — what's in the menus.
 *
 * The parts every Explorer window shares (Edit, Favorites, Help, most of
 * View) and the menu a place gets when you right-click it, in a tile or on its
 * screen in the room. Only what can be done is listed: a menu of greyed-out
 * filler reads as a mock-up, not a machine.
 */

import { isExternal, type Site } from '../data';
import * as icons from './icons';
import type { MenuEntry } from './menu';
import { addressOf, type Shell } from './shell';

export function copyAddress(shell: Shell, site: Site): void {
  const addr = addressOf(site);
  const p = navigator.clipboard?.writeText(addr);
  if (!p) {
    shell.balloon("couldn't copy", addr);
    return;
  }
  void p.then(
    () => shell.balloon('copied', addr),
    () => shell.balloon("couldn't copy", addr),
  );
}

/** "Go to dreams", with ↗ when it opens in a new window */
export function goLabel(site: Site): string {
  return `Go to ${site.title}${isExternal(site.href) ? ' ↗' : ''}`;
}

/** a place's own menu: right-click on a tile or its screen, or a pane's File menu */
export function siteMenu(shell: Shell, site: Site, inPane = false): MenuEntry[] {
  const items: MenuEntry[] = [];
  // one name per action, everywhere: Open (its pane), Go to (leave for the page),
  // Show in Room (the camera), Tune In (the live page on its own screen)
  if (!inPane) items.push({ label: 'Open', bold: true, run: () => shell.play(site.id) });
  items.push({ label: goLabel(site), bold: inPane, run: () => shell.open(site) });
  // both need the room (WebGL)
  items.push({ label: 'Show in Room', run: () => shell.look(site.id), disabled: !shell.canTune });
  if (site.tune) items.push({ label: 'Tune In', run: () => shell.tuneIn(site.id), disabled: !shell.canTune });
  if (site.id === 'irc') items.push({ label: 'Join #aethera', run: () => shell.chat('#aethera') });
  items.push('sep', { label: 'Copy Address', run: () => copyAddress(shell, site) });
  return items;
}

export function editMenu(shell: Shell, site: Site | null): MenuEntry[] {
  // the one thing here worth copying is where a place leads (no Ctrl+C: that key
  // is the browser's, and copies the selection, not this)
  return [{ label: 'Copy Address', disabled: !site, run: () => site && copyAddress(shell, site) }];
}

export function favoritesMenu(shell: Shell): MenuEntry[] {
  return [
    { label: 'Add to Favorites...', disabled: true },
    { label: 'Organize Favorites...', disabled: true },
    'sep',
    ...shell.dir.sites
      .filter((s) => s.group === 'here')
      .map((s): MenuEntry => ({ label: s.title, icon: icons.tape(s.accent), run: () => shell.play(s.id) })),
  ];
}

export function helpMenu(shell: Shell): MenuEntry[] {
  return [{ label: 'About æthera', run: () => shell.about() }];
}

export interface ViewParts {
  toolbar: HTMLElement;
  address: HTMLElement;
  status: HTMLElement;
  /** Tiles / Icons / List, for windows that have views */
  views?: MenuEntry[];
  up?: () => void;
  refresh(): void;
}

function toggle(el: HTMLElement): void {
  el.hidden = !el.hidden;
}

export function viewMenu(shell: Shell, p: ViewParts): MenuEntry[] {
  return [
    {
      label: 'Toolbars',
      submenu: () => [
        { label: 'Standard Buttons', checked: !p.toolbar.hidden, run: () => toggle(p.toolbar) },
        { label: 'Address Bar', checked: !p.address.hidden, run: () => toggle(p.address) },
      ],
    },
    { label: 'Status Bar', checked: !p.status.hidden, run: () => toggle(p.status) },
    ...(p.views ? (['sep', ...p.views] as MenuEntry[]) : []),
    'sep',
    {
      label: 'Go To',
      submenu: () => [
        { label: 'Back', shortcut: 'Alt+Left', disabled: !shell.canBack, run: () => shell.back() },
        { label: 'Forward', shortcut: 'Alt+Right', disabled: !shell.canForward, run: () => shell.forward() },
        { label: 'Up One Level', disabled: !p.up, run: () => p.up?.() },
        'sep',
        // no Alt+Home: that key is the browser's, and leaves the site
        { label: '~', run: () => shell.home() },
      ],
    },
    { label: 'Refresh', run: () => p.refresh() },
  ];
}
