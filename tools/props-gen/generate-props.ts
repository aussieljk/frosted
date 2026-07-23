/**
 * Generates `packages/frosted-ui/.storybook/generated/component-props.json` from
 * the @aussieljk/frosted sources, for storybook's `<PropsTable component="…" />` block.
 *
 * For every component exported from `packages/frosted-ui/src/index.ts` (including
 * namespace parts like `Dialog.Root` and attached parts like `Grid.Row`) it extracts:
 *
 * - prop name, required flag and pretty-printed type (enums expanded) from the
 *   component's props interface, via the TypeScript checker;
 * - the JSDoc description and `@default` tag of each prop (interface first, with the
 *   matching `*.props.ts` PropDef entry as fallback);
 * - default values declared in the `*PropDefs` objects (`<name>.props.ts`).
 *
 * DOM props inherited from `@types/react` (the hundreds of standard HTML attributes)
 * are omitted; props declared in @aussieljk/frosted itself or in Base UI primitives are kept.
 *
 * Run with `bun run generate:props` (from the repo root). This package exists only
 * to scope its own `typescript` dependency — a classic JS-API compiler, NOT the
 * repo-wide TypeScript 7 native compiler, which has no JS API.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const frostedSrc = path.join(repoRoot, 'packages/frosted-ui/src');
const entryFile = path.join(frostedSrc, 'index.ts');
const outFile = path.join(repoRoot, 'packages/frosted-ui/.storybook/generated/component-props.json');

interface PropInfo {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description?: string;
  deprecated?: boolean;
}

interface ComponentEntry {
  /** JSDoc description of the component itself, when present. */
  description?: string;
  props: PropInfo[];
}

// Exports that look like components but should not get prop tables.
const SKIPPED_EXPORTS = new Set(['Icons']);
// Structural/DOM plumbing props that would be noise in every table.
const SKIPPED_PROPS = new Set(['className', 'style', 'ref', 'key']);

const program = ts.createProgram([entryFile], {
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  strict: true,
  skipLibCheck: true,
  esModuleInterop: true,
  resolveJsonModule: true,
});
const checker = program.getTypeChecker();

const entrySource = program.getSourceFile(entryFile);
if (!entrySource) throw new Error(`Could not load ${entryFile}`);
const entryModule = checker.getSymbolAtLocation(entrySource);
if (!entryModule) throw new Error('Could not resolve the @aussieljk/frosted entry module symbol');

const FORMAT_FLAGS =
  ts.TypeFormatFlags.NoTruncation |
  ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope |
  ts.TypeFormatFlags.UseSingleQuotesForStringLiteralType;

function resolveAlias(symbol: ts.Symbol): ts.Symbol {
  return symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
}

function isDeclaredIn(symbol: ts.Symbol, test: (fileName: string) => boolean): boolean {
  return (symbol.getDeclarations() ?? []).some((d) => test(d.getSourceFile().fileName));
}

/** The props type of a component-like symbol, or undefined when it isn't a component. */
function getPropsType(type: ts.Type): ts.Type | undefined {
  const signature = type.getCallSignatures().find((sig) => sig.parameters.length >= 1);
  if (!signature) return undefined;
  const propsParam = signature.parameters[0];
  const decl = propsParam.valueDeclaration ?? propsParam.getDeclarations()?.[0];
  const propsType = decl ? checker.getTypeOfSymbolAtLocation(propsParam, decl) : checker.getTypeOfSymbol(propsParam);
  // A props argument must be object-like.
  if (!(propsType.flags & (ts.TypeFlags.Object | ts.TypeFlags.Intersection | ts.TypeFlags.Union))) return undefined;
  return propsType;
}

function formatType(type: ts.Type): string {
  return checker
    .typeToString(type, undefined, FORMAT_FLAGS)
    .replace(/^undefined \| /, '')
    .replace(/ \| undefined$/, '');
}

function extractProps(propsType: ts.Type): PropInfo[] {
  const own: PropInfo[] = [];
  const inherited: PropInfo[] = [];

  for (const prop of propsType.getProperties()) {
    const name = prop.getName();
    if (SKIPPED_PROPS.has(name) || name.startsWith('__')) continue;

    const fromFrosted = isDeclaredIn(prop, (f) => f.startsWith(frostedSrc));
    const fromBaseUi = isDeclaredIn(prop, (f) => f.includes('@base-ui'));
    // Drop props that only come from @types/react etc. (native DOM attributes).
    if (!fromFrosted && !fromBaseUi) continue;

    const decl = prop.valueDeclaration ?? prop.getDeclarations()?.[0];
    const type = decl ? checker.getTypeOfSymbolAtLocation(prop, decl) : checker.getTypeOfSymbol(prop);

    const tags = prop.getJsDocTags(checker);
    const defaultTag = tags.find((t) => t.name === 'default');
    const description = ts.displayPartsToString(prop.getDocumentationComment(checker)).trim();

    const info: PropInfo = {
      name,
      type: formatType(type),
      required: !(prop.flags & ts.SymbolFlags.Optional),
    };
    if (defaultTag?.text) info.default = ts.displayPartsToString(defaultTag.text).trim();
    if (description) info.description = description;
    if (tags.some((t) => t.name === 'deprecated')) info.deprecated = true;

    (fromFrosted ? own : inherited).push(info);
  }

  return [...own, ...inherited];
}

// ---------------------------------------------------------------------------
// PropDef defaults/descriptions from the `*PropDefs` exports (`<name>.props.ts`)
// ---------------------------------------------------------------------------

interface PropDefInfo {
  default?: string;
  description?: string;
}

/** e.g. `DialogContent` -> `{ size: { default: "'3'", description: '…' } }` */
const propDefsByTarget = new Map<string, Map<string, PropDefInfo>>();

function literalToString(type: ts.Type): string | undefined {
  if (type.isStringLiteral()) return `'${type.value}'`;
  if (type.isNumberLiteral()) return String(type.value);
  if (type.flags & ts.TypeFlags.BooleanLiteral) {
    return (type as unknown as { intrinsicName: string }).intrinsicName;
  }
  return undefined;
}

function collectPropDefs(exportName: string, symbol: ts.Symbol) {
  const target = exportName.slice(0, -'PropDefs'.length);
  const targetId = target.charAt(0).toUpperCase() + target.slice(1);

  const defs = new Map<string, PropDefInfo>();
  const type = checker.getTypeOfSymbolAtLocation(symbol, entrySource!);
  for (const prop of type.getProperties()) {
    const info: PropDefInfo = {};
    const propDefType = checker.getTypeOfSymbol(prop);
    const defaultSymbol = propDefType.getProperty('default');
    if (defaultSymbol) {
      const literal = literalToString(checker.getTypeOfSymbol(defaultSymbol));
      if (literal !== undefined) info.default = literal;
    }
    const description = ts.displayPartsToString(prop.getDocumentationComment(checker)).trim();
    if (description) info.description = description;
    const defaultTag = prop.getJsDocTags(checker).find((t) => t.name === 'default');
    if (defaultTag?.text) info.default = ts.displayPartsToString(defaultTag.text).trim();
    if (info.default !== undefined || info.description) defs.set(prop.getName(), info);
  }
  if (defs.size > 0) propDefsByTarget.set(targetId, defs);
}

// ---------------------------------------------------------------------------
// Walk the package exports
// ---------------------------------------------------------------------------

const components = new Map<string, ComponentEntry>();

function addComponent(fullName: string, symbol: ts.Symbol, type: ts.Type) {
  const propsType = getPropsType(type);
  if (!propsType) return;
  const props = extractProps(propsType);
  if (props.length === 0) return;

  const entry: ComponentEntry = { props };
  const description = ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim();
  if (description) entry.description = description;
  components.set(fullName, entry);

  // Attached parts, e.g. `Grid.Row`, `Overlay.Content` (Object.assign pattern).
  const properties = type.getProperties();
  if (properties.length <= 12) {
    for (const part of properties) {
      if (!/^[A-Z]/.test(part.getName())) continue;
      const partType = checker.getTypeOfSymbol(part);
      const partProps = getPropsType(partType);
      if (!partProps) continue;
      const extracted = extractProps(partProps);
      if (extracted.length === 0) continue;
      const partEntry: ComponentEntry = { props: extracted };
      const partDescription = ts.displayPartsToString(part.getDocumentationComment(checker)).trim();
      if (partDescription) partEntry.description = partDescription;
      components.set(`${fullName}.${part.getName()}`, partEntry);
    }
  }
}

for (const exported of checker.getExportsOfModule(entryModule)) {
  const name = exported.getName();
  if (name.endsWith('PropDefs')) {
    collectPropDefs(name, resolveAlias(exported));
    continue;
  }
  if (!/^[A-Z]/.test(name) || name === name.toUpperCase() || SKIPPED_EXPORTS.has(name)) continue;

  const resolved = resolveAlias(exported);
  const type = checker.getTypeOfSymbolAtLocation(exported, entrySource);

  // Callable => a component (this must be checked before the namespace branch:
  // `Button.displayName = …` expando assignments give components module flags too).
  if (type.getCallSignatures().length > 0) {
    addComponent(name, resolved, type);
    continue;
  }

  if (resolved.flags & ts.SymbolFlags.Module) {
    // Namespace export, e.g. `export * as Dialog from './dialog'`.
    for (const part of checker.getExportsOfModule(resolved)) {
      const partName = part.getName();
      if (!/^[A-Z]/.test(partName)) continue;
      const partResolved = resolveAlias(part);
      if (!(partResolved.flags & ts.SymbolFlags.Value)) continue;
      const partType = checker.getTypeOfSymbolAtLocation(part, entrySource);
      const propsType = getPropsType(partType);
      if (!propsType) continue;
      const props = extractProps(propsType);
      if (props.length === 0) continue;
      const entry: ComponentEntry = { props };
      const description = ts.displayPartsToString(partResolved.getDocumentationComment(checker)).trim();
      if (description) entry.description = description;
      components.set(`${name}.${partName}`, entry);
    }
    continue;
  }
}

// ---------------------------------------------------------------------------
// Merge PropDef defaults/descriptions into the extracted props
// ---------------------------------------------------------------------------

for (const [fullName, entry] of components) {
  const flatId = fullName.replace(/\./g, '');
  const [namespace, part] = fullName.split('.');
  const defs =
    propDefsByTarget.get(flatId) ??
    // `textFieldPropDefs` documents `TextField.Root`, `tooltipPropDefs` documents `Tooltip`, …
    (part === 'Root' || part === undefined ? propDefsByTarget.get(namespace) : undefined);
  if (!defs) continue;

  for (const prop of entry.props) {
    const def = defs.get(prop.name);
    if (!def) continue;
    if (prop.default === undefined && def.default !== undefined) prop.default = def.default;
    if (!prop.description && def.description) prop.description = def.description;
  }
}

// ---------------------------------------------------------------------------
// Emit
// ---------------------------------------------------------------------------

const output = {
  '//': 'GENERATED FILE - do not edit. Run `bun run generate:props` (repo root) to regenerate.',
  components: Object.fromEntries([...components.entries()].sort(([a], [b]) => a.localeCompare(b))),
};

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, `${JSON.stringify(output, null, 2)}\n`);

console.log(`Extracted prop tables for ${components.size} components -> ${path.relative(repoRoot, outFile)}`);
