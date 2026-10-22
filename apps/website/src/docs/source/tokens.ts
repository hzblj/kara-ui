import {readFileSync} from 'node:fs'
import path from 'node:path'

import {parse} from '@babel/parser'

import {fromCheckout, REPO_ROOT} from './repo'

/**
 * The design tokens, read out of `@hzblj/kara-theme`'s sources at build time. The files are plain object literals with
 * a handful of constructor calls (`native(…)`, `adaptive(…)`), so a small evaluator over their syntax tree is enough —
 * and the reference can never list a token the library does not have.
 */

export type ColorSource =
  | {android?: string; dark?: string; ios?: string; kind: 'native'; light?: string}
  | {dark: string; kind: 'adaptive'; light: string}
  | {kind: 'hex'; value: string}

export type ColorTokenDoc = {name: string; source: ColorSource}

export type TextStyleDoc = {
  fontSize: number
  lineHeight: number
  name: string
  role: string
  scalesWith: string
  weight: string
}

export type Tokens = {
  breakpoints: [string, number][]
  colors: ColorTokenDoc[]
  durations: [string, number][]
  opacity: [string, number][]
  radii: [string, number][]
  spacing: [string, number][]
  textStyles: TextStyleDoc[]
}

const THEME = path.join(REPO_ROOT, 'packages/theme/src')

type Node = {type: string; [key: string]: unknown}

type Value = number | string | boolean | undefined | Value[] | {[key: string]: Value}

const program = (file: string) =>
  parse(readFileSync(path.join(THEME, file), 'utf8'), {plugins: ['typescript'], sourceType: 'module'}).program
    .body as unknown as Node[]

/** The value of `export const <name> = …` in a file, evaluated against `scope`. */
const constants = (file: string, scope: Record<string, Value> = {}) => {
  const found: Record<string, Value> = {}

  for (const statement of program(file)) {
    const declaration = statement.type === 'ExportNamedDeclaration' ? (statement.declaration as Node | null) : null

    if (declaration?.type !== 'VariableDeclaration') {
      continue
    }

    for (const declarator of declaration.declarations as Node[]) {
      const name = (declarator.id as Node).name as string
      found[name] = evaluate(declarator.init as Node, {...scope, ...found})
    }
  }

  return found
}

const keyOf = (key: Node) => (key.type === 'Identifier' ? (key.name as string) : String(key.value))

const evaluate = (node: Node | undefined, scope: Record<string, Value>): Value => {
  if (!node) {
    return undefined
  }

  switch (node.type) {
    case 'TSAsExpression':
    case 'TSSatisfiesExpression':
      return evaluate(node.expression as Node, scope)
    case 'NumericLiteral':
    case 'StringLiteral':
    case 'BooleanLiteral':
      return node.value as Value
    case 'Identifier':
      return scope[node.name as string]
    case 'ArrayExpression':
      return (node.elements as Node[]).map(element => evaluate(element, scope))
    case 'ObjectExpression': {
      const object: Record<string, Value> = {}

      for (const property of node.properties as Node[]) {
        if (property.type === 'ObjectProperty') {
          object[keyOf(property.key as Node)] = evaluate(property.value as Node, scope)
        }
      }

      return object
    }
    case 'MemberExpression': {
      const target = evaluate(node.object as Node, scope)
      const key = node.computed ? evaluate(node.property as Node, scope) : (node.property as Node).name
      return Array.isArray(target) ? target[Number(key)] : (target as Record<string, Value> | undefined)?.[String(key)]
    }
    case 'CallExpression': {
      const callee = (node.callee as Node).name as string
      const [argument] = (node.arguments as Node[]).map(entry => evaluate(entry, scope))
      return {...(argument as Record<string, Value>), kind: callee}
    }
    default:
      return undefined
  }
}

const entries = (value: Value) => Object.entries(value as Record<string, number>)

const sourceOf = (value: Value): ColorSource | undefined => {
  if (typeof value === 'string') {
    return {kind: 'hex', value}
  }

  const object = value as Record<string, string> | undefined

  if (object?.kind === 'native') {
    return {android: object.android, dark: object.dark, ios: object.ios, kind: 'native', light: object.light}
  }

  if (object?.kind === 'adaptive') {
    return {dark: object.dark ?? '', kind: 'adaptive', light: object.light ?? ''}
  }

  return undefined
}

/** `{content: {on: {bg: …}}}` → `content.on.bg`. The shadow family has its own page section, so it stays out. */
const flatten = (tree: Value, prefix = ''): ColorTokenDoc[] =>
  Object.entries(tree as Record<string, Value>).flatMap(([key, value]) => {
    const name = prefix ? `${prefix}.${key}` : key
    const source = sourceOf(value)

    if (source) {
      return [{name, source}]
    }

    return typeof value === 'object' && value !== null && !Array.isArray(value) ? flatten(value, name) : []
  })

const build = (): Tokens => {
  const scales = constants('primitives/colors.ts')
  const {palette} = constants('themes/palette.ts', {...scales, MAX_CONTRAST_SURFACE: {}})
  const {spacing} = constants('primitives/spacing.ts')
  const {radii} = constants('primitives/radii.ts')
  const {opacity} = constants('primitives/opacity.ts')
  const {duration} = constants('primitives/duration.ts')
  const {breakpoints} = constants('primitives/breakpoints.ts')
  const {textStyles} = constants('primitives/typography.ts')
  const colors = Object.entries(palette as Record<string, Value>)
    .filter(([family]) => family !== 'shadow')
    .flatMap(([family, tree]) => flatten(tree, family))

  return {
    breakpoints: entries(breakpoints).sort((first, second) => first[1] - second[1]),
    colors,
    durations: entries(duration),
    opacity: entries(opacity),
    radii: entries(radii).sort((first, second) => first[1] - second[1]),
    spacing: entries(spacing),
    textStyles: Object.entries(textStyles as Record<string, Omit<TextStyleDoc, 'name'>>)
      .map(([name, style]) => ({...style, name}))
      .sort((first, second) => second.fontSize - first.fontSize || first.name.localeCompare(second.name)),
  }
}

export const readTokens = fromCheckout(build)
