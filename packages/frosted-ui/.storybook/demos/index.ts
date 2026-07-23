import type { ComponentType } from 'react';

import AccordionDemo from './accordion';
import accordionSource from './accordion?raw';
import AlertDialogDemo from './alert-dialog';
import alertDialogSource from './alert-dialog?raw';
import AutocompleteDemo from './autocomplete';
import autocompleteSource from './autocomplete?raw';
import AvatarDemo from './avatar';
import avatarSource from './avatar?raw';
import AvatarGroupDemo from './avatar-group';
import avatarGroupSource from './avatar-group?raw';
import AvatarStackDemo from './avatar-stack';
import avatarStackSource from './avatar-stack?raw';
import BadgeDemo from './badge';
import badgeSource from './badge?raw';
import BlockquoteDemo from './blockquote';
import blockquoteSource from './blockquote?raw';
import BreadcrumbsDemo from './breadcrumbs';
import breadcrumbsSource from './breadcrumbs?raw';
import ButtonDemo from './button';
import buttonSource from './button?raw';
import CalendarDemo from './calendar';
import calendarSource from './calendar?raw';
import CalloutDemo from './callout';
import calloutSource from './callout?raw';
import CardDemo from './card';
import cardSource from './card?raw';
import CheckboxDemo from './checkbox';
import checkboxSource from './checkbox?raw';
import CircularProgressDemo from './circular-progress';
import circularProgressSource from './circular-progress?raw';
import CodeDemo from './code';
import codeSource from './code?raw';
import ComboboxDemo from './combobox';
import comboboxSource from './combobox?raw';
import ContextMenuDemo from './context-menu';
import contextMenuSource from './context-menu?raw';
import CreditCardDemo from './credit-card';
import creditCardSource from './credit-card?raw';
import DataListDemo from './data-list';
import dataListSource from './data-list?raw';
import DateFieldDemo from './date-field';
import dateFieldSource from './date-field?raw';
import DatePickerDemo from './date-picker';
import datePickerSource from './date-picker?raw';
import DateRangePickerDemo from './date-range-picker';
import dateRangePickerSource from './date-range-picker?raw';
import DialogDemo from './dialog';
import dialogSource from './dialog?raw';
import DrawerDemo from './drawer';
import drawerSource from './drawer?raw';
import DropdownMenuDemo from './dropdown-menu';
import dropdownMenuSource from './dropdown-menu?raw';
import EmDemo from './em';
import emSource from './em?raw';
import EmptyStateDemo from './empty-state';
import emptyStateSource from './empty-state?raw';
import FieldDemo from './field';
import fieldSource from './field?raw';
import FieldsetDemo from './fieldset';
import fieldsetSource from './fieldset?raw';
import FilterChipDemo from './filter-chip';
import filterChipSource from './filter-chip?raw';
import FormDemo from './form';
import formSource from './form?raw';
import GridDemo from './grid';
import gridSource from './grid?raw';
import HStackDemo from './h-stack';
import hStackSource from './h-stack?raw';
import HeadingDemo from './heading';
import headingSource from './heading?raw';
import HoverCardDemo from './hover-card';
import hoverCardSource from './hover-card?raw';
import IconButtonDemo from './icon-button';
import iconButtonSource from './icon-button?raw';
import IconsDemo from './icons';
import iconsSource from './icons?raw';
import InsetDemo from './inset';
import insetSource from './inset?raw';
import KbdDemo from './kbd';
import kbdSource from './kbd?raw';
import LayoutDemo from './layout';
import layoutSource from './layout?raw';
import LightboxDemo from './lightbox';
import lightboxSource from './lightbox?raw';
import LinkDemo from './link';
import linkSource from './link?raw';
import NumberFieldDemo from './number-field';
import numberFieldSource from './number-field?raw';
import OtpFieldDemo from './otp-field';
import otpFieldSource from './otp-field?raw';
import OverlayDemo from './overlay';
import overlaySource from './overlay?raw';
import PopoverDemo from './popover';
import popoverSource from './popover?raw';
import PortalDemo from './portal';
import portalSource from './portal?raw';
import ProgressDemo from './progress';
import progressSource from './progress?raw';
import QuoteDemo from './quote';
import quoteSource from './quote?raw';
import RadioButtonGroupDemo from './radio-button-group';
import radioButtonGroupSource from './radio-button-group?raw';
import RadioGroupDemo from './radio-group';
import radioGroupSource from './radio-group?raw';
import ScrollAreaDemo from './scroll-area';
import scrollAreaSource from './scroll-area?raw';
import ScrollGalleryDemo from './scroll-gallery';
import scrollGallerySource from './scroll-gallery?raw';
import SegmentedControlDemo from './segmented-control';
import segmentedControlSource from './segmented-control?raw';
import SegmentedControlNavDemo from './segmented-control-nav';
import segmentedControlNavSource from './segmented-control-nav?raw';
import SegmentedControlRadioGroupDemo from './segmented-control-radio-group';
import segmentedControlRadioGroupSource from './segmented-control-radio-group?raw';
import SelectDemo from './select';
import selectSource from './select?raw';
import SeparatorDemo from './separator';
import separatorSource from './separator?raw';
import SheetDemo from './sheet';
import sheetSource from './sheet?raw';
import ShineDemo from './shine';
import shineSource from './shine?raw';
import SkeletonDemo from './skeleton';
import skeletonSource from './skeleton?raw';
import SliderDemo from './slider';
import sliderSource from './slider?raw';
import SpacerDemo from './spacer';
import spacerSource from './spacer?raw';
import SpinnerDemo from './spinner';
import spinnerSource from './spinner?raw';
import StackedHorizontalBarChartDemo from './stacked-horizontal-bar-chart';
import stackedHorizontalBarChartSource from './stacked-horizontal-bar-chart?raw';
import StrongDemo from './strong';
import strongSource from './strong?raw';
import SwitchDemo from './switch';
import switchSource from './switch?raw';
import TableDemo from './table';
import tableSource from './table?raw';
import TabsDemo from './tabs';
import tabsSource from './tabs?raw';
import TabsNavDemo from './tabs-nav';
import tabsNavSource from './tabs-nav?raw';
import TextDemo from './text';
import textSource from './text?raw';
import TextAreaDemo from './text-area';
import textAreaSource from './text-area?raw';
import TextFieldDemo from './text-field';
import textFieldSource from './text-field?raw';
import ToastDemo from './toast';
import toastSource from './toast?raw';
import TooltipDemo from './tooltip';
import tooltipSource from './tooltip?raw';
import VStackDemo from './v-stack';
import vStackSource from './v-stack?raw';
import VisuallyHiddenDemo from './visually-hidden';
import visuallyHiddenSource from './visually-hidden?raw';
import WidgetStackDemo from './widget-stack';
import widgetStackSource from './widget-stack?raw';
import ZStackDemo from './z-stack';
import zStackSource from './z-stack?raw';

export interface DemoEntry {
  /** Unique id, referenced from MDX via `<Demo id="…" />`. */
  id: string;
  /** Human readable title, used on the Examples page. */
  title: string;
  component: ComponentType;
  /** The demo's source code, shown alongside the live preview. */
  source: string;
}

export const demos: DemoEntry[] = [
  // Layout & structure
  { id: 'layout', title: 'Layout', component: LayoutDemo, source: layoutSource },
  { id: 'h-stack', title: 'HStack', component: HStackDemo, source: hStackSource },
  { id: 'v-stack', title: 'VStack', component: VStackDemo, source: vStackSource },
  { id: 'z-stack', title: 'ZStack', component: ZStackDemo, source: zStackSource },
  { id: 'grid', title: 'Grid', component: GridDemo, source: gridSource },
  { id: 'spacer', title: 'Spacer', component: SpacerDemo, source: spacerSource },
  { id: 'inset', title: 'Inset', component: InsetDemo, source: insetSource },
  { id: 'separator', title: 'Separator', component: SeparatorDemo, source: separatorSource },
  { id: 'overlay', title: 'Overlay', component: OverlayDemo, source: overlaySource },
  { id: 'scroll-area', title: 'Scroll Area', component: ScrollAreaDemo, source: scrollAreaSource },
  { id: 'portal', title: 'Portal', component: PortalDemo, source: portalSource },
  { id: 'visually-hidden', title: 'Visually Hidden', component: VisuallyHiddenDemo, source: visuallyHiddenSource },
  // Typography
  { id: 'text', title: 'Text', component: TextDemo, source: textSource },
  { id: 'heading', title: 'Heading', component: HeadingDemo, source: headingSource },
  { id: 'link', title: 'Link', component: LinkDemo, source: linkSource },
  { id: 'code', title: 'Code', component: CodeDemo, source: codeSource },
  { id: 'kbd', title: 'Kbd', component: KbdDemo, source: kbdSource },
  { id: 'em', title: 'Em', component: EmDemo, source: emSource },
  { id: 'strong', title: 'Strong', component: StrongDemo, source: strongSource },
  { id: 'quote', title: 'Quote', component: QuoteDemo, source: quoteSource },
  { id: 'blockquote', title: 'Blockquote', component: BlockquoteDemo, source: blockquoteSource },
  // Icons
  { id: 'icons', title: 'Icons', component: IconsDemo, source: iconsSource },
  // Buttons
  { id: 'button', title: 'Button', component: ButtonDemo, source: buttonSource },
  { id: 'icon-button', title: 'Icon Button', component: IconButtonDemo, source: iconButtonSource },
  // Forms
  { id: 'text-field', title: 'Text Field', component: TextFieldDemo, source: textFieldSource },
  { id: 'text-area', title: 'Text Area', component: TextAreaDemo, source: textAreaSource },
  { id: 'number-field', title: 'Number Field', component: NumberFieldDemo, source: numberFieldSource },
  { id: 'otp-field', title: 'OTP Field', component: OtpFieldDemo, source: otpFieldSource },
  { id: 'checkbox', title: 'Checkbox', component: CheckboxDemo, source: checkboxSource },
  { id: 'switch', title: 'Switch', component: SwitchDemo, source: switchSource },
  { id: 'radio-group', title: 'Radio Group', component: RadioGroupDemo, source: radioGroupSource },
  {
    id: 'radio-button-group',
    title: 'Radio Button Group',
    component: RadioButtonGroupDemo,
    source: radioButtonGroupSource,
  },
  { id: 'slider', title: 'Slider', component: SliderDemo, source: sliderSource },
  { id: 'select', title: 'Select', component: SelectDemo, source: selectSource },
  { id: 'field', title: 'Field', component: FieldDemo, source: fieldSource },
  { id: 'fieldset', title: 'Fieldset', component: FieldsetDemo, source: fieldsetSource },
  { id: 'form', title: 'Form', component: FormDemo, source: formSource },
  // Pickers
  { id: 'calendar', title: 'Calendar', component: CalendarDemo, source: calendarSource },
  { id: 'date-field', title: 'Date Field', component: DateFieldDemo, source: dateFieldSource },
  { id: 'date-picker', title: 'Date Picker', component: DatePickerDemo, source: datePickerSource },
  {
    id: 'date-range-picker',
    title: 'Date Range Picker',
    component: DateRangePickerDemo,
    source: dateRangePickerSource,
  },
  { id: 'autocomplete', title: 'Autocomplete', component: AutocompleteDemo, source: autocompleteSource },
  { id: 'combobox', title: 'Combobox', component: ComboboxDemo, source: comboboxSource },
  { id: 'filter-chip', title: 'Filter Chip', component: FilterChipDemo, source: filterChipSource },
  // Overlays
  { id: 'dialog', title: 'Dialog', component: DialogDemo, source: dialogSource },
  { id: 'alert-dialog', title: 'Alert Dialog', component: AlertDialogDemo, source: alertDialogSource },
  { id: 'sheet', title: 'Sheet', component: SheetDemo, source: sheetSource },
  { id: 'drawer', title: 'Drawer', component: DrawerDemo, source: drawerSource },
  { id: 'popover', title: 'Popover', component: PopoverDemo, source: popoverSource },
  { id: 'hover-card', title: 'Hover Card', component: HoverCardDemo, source: hoverCardSource },
  { id: 'tooltip', title: 'Tooltip', component: TooltipDemo, source: tooltipSource },
  { id: 'toast', title: 'Toast', component: ToastDemo, source: toastSource },
  { id: 'lightbox', title: 'Lightbox', component: LightboxDemo, source: lightboxSource },
  // Menus
  { id: 'dropdown-menu', title: 'Dropdown Menu', component: DropdownMenuDemo, source: dropdownMenuSource },
  { id: 'context-menu', title: 'Context Menu', component: ContextMenuDemo, source: contextMenuSource },
  // Navigation
  { id: 'tabs', title: 'Tabs', component: TabsDemo, source: tabsSource },
  { id: 'tabs-nav', title: 'Tabs Nav', component: TabsNavDemo, source: tabsNavSource },
  {
    id: 'segmented-control',
    title: 'Segmented Control',
    component: SegmentedControlDemo,
    source: segmentedControlSource,
  },
  {
    id: 'segmented-control-nav',
    title: 'Segmented Control Nav',
    component: SegmentedControlNavDemo,
    source: segmentedControlNavSource,
  },
  {
    id: 'segmented-control-radio-group',
    title: 'Segmented Control Radio Group',
    component: SegmentedControlRadioGroupDemo,
    source: segmentedControlRadioGroupSource,
  },
  { id: 'breadcrumbs', title: 'Breadcrumbs', component: BreadcrumbsDemo, source: breadcrumbsSource },
  { id: 'accordion', title: 'Accordion', component: AccordionDemo, source: accordionSource },
  // Data display
  { id: 'card', title: 'Card', component: CardDemo, source: cardSource },
  { id: 'badge', title: 'Badge', component: BadgeDemo, source: badgeSource },
  { id: 'avatar', title: 'Avatar', component: AvatarDemo, source: avatarSource },
  { id: 'avatar-group', title: 'Avatar Group', component: AvatarGroupDemo, source: avatarGroupSource },
  { id: 'avatar-stack', title: 'Avatar Stack', component: AvatarStackDemo, source: avatarStackSource },
  { id: 'table', title: 'Table', component: TableDemo, source: tableSource },
  { id: 'data-list', title: 'Data List', component: DataListDemo, source: dataListSource },
  { id: 'callout', title: 'Callout', component: CalloutDemo, source: calloutSource },
  { id: 'empty-state', title: 'Empty State', component: EmptyStateDemo, source: emptyStateSource },
  { id: 'progress', title: 'Progress', component: ProgressDemo, source: progressSource },
  {
    id: 'circular-progress',
    title: 'Circular Progress',
    component: CircularProgressDemo,
    source: circularProgressSource,
  },
  {
    id: 'stacked-horizontal-bar-chart',
    title: 'Stacked Horizontal Bar Chart',
    component: StackedHorizontalBarChartDemo,
    source: stackedHorizontalBarChartSource,
  },
  // Misc
  { id: 'skeleton', title: 'Skeleton', component: SkeletonDemo, source: skeletonSource },
  { id: 'spinner', title: 'Spinner', component: SpinnerDemo, source: spinnerSource },
  { id: 'shine', title: 'Shine', component: ShineDemo, source: shineSource },
  { id: 'scroll-gallery', title: 'Scroll Gallery', component: ScrollGalleryDemo, source: scrollGallerySource },
  { id: 'widget-stack', title: 'Widget Stack', component: WidgetStackDemo, source: widgetStackSource },
  { id: 'credit-card', title: 'Credit Card', component: CreditCardDemo, source: creditCardSource },
];

export function getDemo(id: string): DemoEntry | undefined {
  return demos.find((demo) => demo.id === id);
}
