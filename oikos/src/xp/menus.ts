/**
 * menus.ts — what's in the menus.
 *
 * The parts every Explorer window shares (Edit, Favorites, Tools, Help, most
 * of View) and the menu a tape gets when you right-click it, in a tile or on
 * its screen in the room. XP greyed what couldn't be done rather than hiding
 * it, and so do these: the greyed items are the ones that have no meaning in
 * this house (there is nothing to cut, nothing to map a drive to).
 */

import type { Site } from '../data';
import * as icons from './icons';
import type { MenuEntry } from './menu';
import { addressOf, type Shell } from './shell';

export function copyAddress(shell: Shell, site: Site): void {
  const addr = addressOf(site);
  const p = navigator.clipboard?.writeText(addr);
  if (!p) {
    shell.balloon('Could not copy', addr);
    return;
  }
  void p.then(
    () => shell.balloon('Copied', addr),
    () => shell.balloon('Could not copy', addr),
  );
}

/** a tape's own menu: right-click on a tile or its screen, or a pane's File menu */
export function siteMenu(shell: Shell, site: Site, inPane = false): MenuEntry[] {
  const items: MenuEntry[] = [];
  if (inPane) items.push({ label: `Open ${site.title}`, bold: true, run: () => shell.open(site) });
  else {
    items.push({ label: 'Play', bold: true, run: () => shell.play(site.id) });
    items.push({ label: `Go to ${site.title}`, run: () => shell.open(site) });
  }
  // both need the room (WebGL)
  items.push({ label: 'Look at its screen', run: () => shell.look(site.id), disabled: !shell.canTune });
  if (site.tune) items.push({ label: 'Watch it here', run: () => shell.tuneIn(site.id), disabled: !shell.canTune });
  if (site.id === 'irc') items.push({ label: 'Join in mIRC', run: () => shell.chat() });
  items.push('sep', { label: 'Copy Address', run: () => copyAddress(shell, site) });
  if (!inPane) items.push('sep', { label: 'Properties', run: () => shell.play(site.id) });
  return items;
}

export function editMenu(shell: Shell, site: Site | null): MenuEntry[] {
  return [
    { label: 'Undo', shortcut: 'Ctrl+Z', disabled: true },
    'sep',
    { label: 'Cut', shortcut: 'Ctrl+X', disabled: true },
    // the one thing here worth copying is where a tape leads
    { label: 'Copy', shortcut: 'Ctrl+C', disabled: !site, run: () => site && copyAddress(shell, site) },
    { label: 'Paste', shortcut: 'Ctrl+V', disabled: true },
    'sep',
    { label: 'Select All', shortcut: 'Ctrl+A', disabled: true },
    { label: 'Invert Selection', disabled: true },
  ];
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

export function toolsMenu(): MenuEntry[] {
  return [
    { label: 'Map Network Drive...', disabled: true },
    { label: 'Disconnect Network Drive...', disabled: true },
    { label: 'Synchronize...', disabled: true },
    'sep',
    { label: 'Folder Options...', disabled: true },
  ];
}

export function helpMenu(shell: Shell): MenuEntry[] {
  return [
    { label: 'Help and Support Center', disabled: true },
    'sep',
    { label: 'About æthera', run: () => shell.about() },
  ];
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
        { label: 'Home Page', shortcut: 'Alt+Home', run: () => shell.home() },
      ],
    },
    { label: 'Refresh', shortcut: 'F5', run: () => p.refresh() },
  ];
}
