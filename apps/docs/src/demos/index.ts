import type { ComponentType } from 'react';

import AvatarDemo from './avatar';
import avatarSource from './avatar?raw';
import BadgeDemo from './badge';
import badgeSource from './badge?raw';
import ButtonDemo from './button';
import buttonSource from './button?raw';
import CardDemo from './card';
import cardSource from './card?raw';
import CheckboxDemo from './checkbox';
import checkboxSource from './checkbox?raw';
import DialogDemo from './dialog';
import dialogSource from './dialog?raw';
import IconsDemo from './icons';
import iconsSource from './icons?raw';
import LayoutDemo from './layout';
import layoutSource from './layout?raw';
import SelectDemo from './select';
import selectSource from './select?raw';
import SwitchDemo from './switch';
import switchSource from './switch?raw';
import TabsDemo from './tabs';
import tabsSource from './tabs?raw';
import TextFieldDemo from './text-field';
import textFieldSource from './text-field?raw';
import TooltipDemo from './tooltip';
import tooltipSource from './tooltip?raw';

export interface DemoEntry {
  /** Unique id, referenced from MDX via `<Demo id="…" />`. */
  id: string;
  /** Human readable title, used on the kitchen-sink page. */
  title: string;
  /** Docs page this demo belongs to. */
  docPath: string;
  component: ComponentType;
  /** The demo's source code, shown alongside the live preview. */
  source: string;
}

export const demos: DemoEntry[] = [
  { id: 'layout', title: 'Layout', docPath: '/docs/layout', component: LayoutDemo, source: layoutSource },
  { id: 'icons', title: 'Icons', docPath: '/docs/icons', component: IconsDemo, source: iconsSource },
  { id: 'button', title: 'Button', docPath: '/docs/components/button', component: ButtonDemo, source: buttonSource },
  { id: 'badge', title: 'Badge', docPath: '/docs/components/badge', component: BadgeDemo, source: badgeSource },
  { id: 'avatar', title: 'Avatar', docPath: '/docs/components/avatar', component: AvatarDemo, source: avatarSource },
  { id: 'card', title: 'Card', docPath: '/docs/components/card', component: CardDemo, source: cardSource },
  {
    id: 'checkbox',
    title: 'Checkbox',
    docPath: '/docs/components/checkbox',
    component: CheckboxDemo,
    source: checkboxSource,
  },
  { id: 'switch', title: 'Switch', docPath: '/docs/components/switch', component: SwitchDemo, source: switchSource },
  { id: 'select', title: 'Select', docPath: '/docs/components/select', component: SelectDemo, source: selectSource },
  { id: 'tabs', title: 'Tabs', docPath: '/docs/components/tabs', component: TabsDemo, source: tabsSource },
  { id: 'dialog', title: 'Dialog', docPath: '/docs/components/dialog', component: DialogDemo, source: dialogSource },
  {
    id: 'tooltip',
    title: 'Tooltip',
    docPath: '/docs/components/tooltip',
    component: TooltipDemo,
    source: tooltipSource,
  },
  {
    id: 'text-field',
    title: 'Text Field',
    docPath: '/docs/components/text-field',
    component: TextFieldDemo,
    source: textFieldSource,
  },
];

export function getDemo(id: string): DemoEntry | undefined {
  return demos.find((demo) => demo.id === id);
}
