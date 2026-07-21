/**
 * Hugeicons adapter (@hugeicons/react + @hugeicons/core-free-icons).
 * Importing this module registers it:
 *
 *   import '@aussieljk/frosted/icons/hugeicons';
 *
 * Or scope it with `<IconProvider library={hugeiconsAdapter}>`.
 */
import {
  Alert02Icon,
  AlertCircleIcon,
  ArrowDown01Icon,
  ArrowDown02Icon,
  ArrowLeft01Icon,
  ArrowLeft02Icon,
  ArrowRight01Icon,
  ArrowRight02Icon,
  ArrowUp01Icon,
  ArrowUp02Icon,
  Calendar03Icon,
  CallIcon,
  Camera01Icon,
  Cancel01Icon,
  Clock01Icon,
  Copy01Icon,
  Delete02Icon,
  Download01Icon,
  File01Icon,
  FilterIcon,
  Folder01Icon,
  GlobalIcon,
  HelpCircleIcon,
  Home01Icon,
  Image01Icon,
  InformationCircleIcon,
  Link01Icon,
  LinkSquare02Icon,
  Login01Icon,
  Logout01Icon,
  Mail01Icon,
  Menu01Icon,
  MinusSignIcon,
  Moon02Icon,
  MoreHorizontalIcon,
  MoreVerticalIcon,
  Notification03Icon,
  PauseIcon,
  PencilEdit02Icon,
  PlayIcon,
  PlusSignIcon,
  RefreshIcon,
  Search01Icon,
  Settings01Icon,
  SquareLock02Icon,
  SquareUnlock02Icon,
  StarIcon,
  Sun03Icon,
  Tick02Icon,
  Upload01Icon,
  UserIcon,
  UserMultiple02Icon,
  ViewIcon,
  ViewOffSlashIcon,
  FavouriteIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import * as React from 'react';
import { registerIconAdapter } from '../registry';
import type { AdapterIconComponent, IconAdapter } from '../types';

function toNumber(value: number | string | undefined): number | undefined {
  if (value == null) return undefined;
  return typeof value === 'number' ? value : parseFloat(value);
}

let warnedBrokenCjs = false;

/** Binds a Hugeicons svg object to the `HugeiconsIcon` renderer. */
function wrap(icon: IconSvgElement): AdapterIconComponent {
  // @hugeicons/core-free-icons declares `"type": "module"` but ships a CommonJS
  // `require` entry, which Node parses as ESM and resolves to an empty module.
  // Guard so plain-CJS consumers degrade to rendering nothing instead of crashing;
  // bundlers and ESM consumers resolve the working ESM build and are unaffected.
  if (icon == null) {
    if (!warnedBrokenCjs) {
      warnedBrokenCjs = true;
      console.warn(
        '[frosted-ui] @hugeicons/core-free-icons resolved to an empty module ' +
          '(its CommonJS entry is broken upstream). Load the hugeicons adapter from ESM instead.',
      );
    }
    const Empty: AdapterIconComponent = () => null;
    return Empty;
  }
  const Component: AdapterIconComponent = ({ width, height, strokeWidth, ...props }) =>
    React.createElement(HugeiconsIcon, {
      icon,
      size: toNumber(width ?? height),
      strokeWidth: toNumber(strokeWidth),
      ...props,
    });
  return Component;
}

export const hugeiconsAdapter: IconAdapter = {
  name: 'hugeicons',
  icons: {
    AlertCircle: wrap(AlertCircleIcon),
    ArrowDown: wrap(ArrowDown02Icon),
    ArrowLeft: wrap(ArrowLeft02Icon),
    ArrowRight: wrap(ArrowRight02Icon),
    ArrowUp: wrap(ArrowUp02Icon),
    Bell: wrap(Notification03Icon),
    Calendar: wrap(Calendar03Icon),
    Camera: wrap(Camera01Icon),
    Check: wrap(Tick02Icon),
    ChevronDown: wrap(ArrowDown01Icon),
    ChevronLeft: wrap(ArrowLeft01Icon),
    ChevronRight: wrap(ArrowRight01Icon),
    ChevronUp: wrap(ArrowUp01Icon),
    Clock: wrap(Clock01Icon),
    Close: wrap(Cancel01Icon),
    Copy: wrap(Copy01Icon),
    DotsHorizontal: wrap(MoreHorizontalIcon),
    DotsVertical: wrap(MoreVerticalIcon),
    Download: wrap(Download01Icon),
    Edit: wrap(PencilEdit02Icon),
    ExternalLink: wrap(LinkSquare02Icon),
    Eye: wrap(ViewIcon),
    EyeOff: wrap(ViewOffSlashIcon),
    File: wrap(File01Icon),
    Filter: wrap(FilterIcon),
    Folder: wrap(Folder01Icon),
    Globe: wrap(GlobalIcon),
    Heart: wrap(FavouriteIcon),
    HelpCircle: wrap(HelpCircleIcon),
    Home: wrap(Home01Icon),
    Image: wrap(Image01Icon),
    Info: wrap(InformationCircleIcon),
    Link: wrap(Link01Icon),
    Lock: wrap(SquareLock02Icon),
    LogIn: wrap(Login01Icon),
    LogOut: wrap(Logout01Icon),
    Mail: wrap(Mail01Icon),
    Menu: wrap(Menu01Icon),
    Minus: wrap(MinusSignIcon),
    Moon: wrap(Moon02Icon),
    Pause: wrap(PauseIcon),
    Phone: wrap(CallIcon),
    Play: wrap(PlayIcon),
    Plus: wrap(PlusSignIcon),
    Refresh: wrap(RefreshIcon),
    Search: wrap(Search01Icon),
    Settings: wrap(Settings01Icon),
    Star: wrap(StarIcon),
    Sun: wrap(Sun03Icon),
    Trash: wrap(Delete02Icon),
    Unlock: wrap(SquareUnlock02Icon),
    Upload: wrap(Upload01Icon),
    User: wrap(UserIcon),
    Users: wrap(UserMultiple02Icon),
    Warning: wrap(Alert02Icon),
  },
};

registerIconAdapter(hugeiconsAdapter);
