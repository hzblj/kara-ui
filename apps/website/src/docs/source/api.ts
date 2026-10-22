import {readdirSync, readFileSync} from 'node:fs'
import path from 'node:path'

import {parse} from '@babel/parser'

import {fromCheckout, REPO_ROOT} from './repo'

/**
 * The props tables, read out of the library's own `*.types.ts` at build time: names, types and JSDoc from the shared
 * contract, defaults from the destructuring in each platform's implementation. Nothing here is written by hand, so the
 * tables cannot drift from the code.
 */

export type ApiDefaults = {android?: string; ios?: string}

export type ApiMember = {
  defaults: ApiDefaults
  description: string
  name: string
  optional: boolean
  type: string
}

export type ApiType = {
  description: string
  /** What the type is intersected with besides its own members — `ResponsiveSx`, `Omit<RNTextProps, 'style'>`. */
  extends: string[]
  members: ApiMember[]
  name: string
}

export type ApiAlias = {description: string; name: string; text: string}

export type Api = {aliases: Record<string, ApiAlias>; types: Record<string, ApiType>}

const SOURCES = ['packages/components/src', 'packages/router/src', 'packages/sx/src']

type Node = {
  end: number
  leadingComments?: {type: string; value: string}[]
  start: number
  type: string
  [key: string]: unknown
}

const walk = (dir: string): string[] =>
  readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })

const parseFile = (file: string) =>
  parse(readFileSync(file, 'utf8'), {
    plugins: ['typescript', ...(file.endsWith('.tsx') ? (['jsx'] as const) : [])],
    sourceType: 'module',
  }).program.body as unknown as Node[]

/** A JSDoc block as prose: the leading stars gone, wrapped lines joined, blank lines kept as paragraph breaks. */
const jsdoc = (node: Node | undefined): string => {
  const block = node?.leadingComments
    ?.filter(comment => comment.type === 'CommentBlock' && comment.value.startsWith('*'))
    .at(-1)

  if (!block) {
    return ''
  }

  return block.value
    .split('\n')
    .map(line => line.replace(/^\s*\*+ ?/, '').trimEnd())
    .join('\n')
    .trim()
    .split(/\n\s*\n/)
    .map(paragraph => paragraph.replace(/\s*\n\s*/g, ' '))
    .join('\n\n')
}

const flat = (text: string) =>
  text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '')
    .replace(/\s+/g, ' ')
    .trim()

/**
 * A type as one readable line. Object literals and unions are printed from the tree — their members are separated by
 * line breaks in the source, which collapsing whitespace alone would run together — and everything else is the source,
 * comments dropped and whitespace collapsed.
 */
const typeText = (source: string, node: Node): string => {
  if (node.type === 'TSTypeLiteral') {
    const members = (node.members as Node[]).map(member => {
      const annotation = (member.typeAnnotation as Node | undefined)?.typeAnnotation as Node | undefined

      return member.type === 'TSPropertySignature' && annotation
        ? `${memberName(member.key as Node)}${member.optional ? '?' : ''}: ${typeText(source, annotation)}`
        : flat(source.slice(member.start, member.end)).replace(/[;,]$/, '')
    })

    return `{${members.join('; ')}}`
  }

  if (node.type === 'TSUnionType') {
    return (node.types as Node[]).map(part => typeText(source, part)).join(' | ')
  }

  return flat(source.slice(node.start, node.end)).replace(/^\| /, '')
}

const memberName = (key: Node) => (key.type === 'Identifier' ? (key.name as string) : String(key.value))

const membersOf = (source: string, literal: Node): ApiMember[] =>
  (literal.members as Node[]).flatMap(member => {
    if (member.type === 'TSPropertySignature') {
      const annotation = (member.typeAnnotation as Node | undefined)?.typeAnnotation as Node | undefined

      return [
        {
          defaults: {},
          description: jsdoc(member),
          name: memberName(member.key as Node),
          optional: Boolean(member.optional),
          type: annotation ? typeText(source, annotation) : 'unknown',
        },
      ]
    }

    if (member.type === 'TSMethodSignature') {
      const text = typeText(source, member)
      const name = memberName(member.key as Node)

      return [
        {
          defaults: {},
          description: jsdoc(member),
          name,
          optional: Boolean(member.optional),
          type: text.slice(text.indexOf('(')).replace(/\): /, ') => '),
        },
      ]
    }

    return []
  })

/** `Bucket<{…}>` — a constraint wrapped around a literal — reads as the literal it holds. */
const unwrapBucket = (node: Node): Node => {
  const [first] = ((node.typeParameters as Node | undefined)?.params as Node[] | undefined) ?? []
  return node.type === 'TSTypeReference' && first?.type === 'TSTypeLiteral' ? first : node
}

const isLiteralUnion = (node: Node) =>
  node.type === 'TSUnionType' && (node.types as Node[]).every(part => part.type === 'TSLiteralType')

const readTypes = (api: Api, file: string) => {
  const source = readFileSync(file, 'utf8')

  for (const statement of parseFile(file)) {
    // Unexported aliases too: the pieces `ViewSx` is assembled from are what its props table is made of.
    const declaration = statement.type === 'ExportNamedDeclaration' ? (statement.declaration as Node | null) : statement

    if (declaration?.type !== 'TSTypeAliasDeclaration') {
      continue
    }

    const name = (declaration.id as Node).name as string
    const annotation = unwrapBucket(declaration.typeAnnotation as Node)
    const description = jsdoc(statement)
    const parts = annotation.type === 'TSIntersectionType' ? (annotation.types as Node[]) : [annotation]
    const literals = parts.filter(part => part.type === 'TSTypeLiteral')

    if (literals.length > 0) {
      api.types[name] = {
        description,
        extends: parts.filter(part => part.type !== 'TSTypeLiteral').map(part => typeText(source, part)),
        members: literals.flatMap(literal => membersOf(source, literal)),
        name,
      }
    } else if (isLiteralUnion(annotation) || annotation.type === 'TSTypeReference') {
      api.aliases[name] = {description, name, text: typeText(source, annotation)}
    }
  }
}

/** `({disabled = false, size = 'md'}: ButtonProps) =>` — the defaults, under the props type they destructure. */
const readDefaults = (file: string, into: Map<string, Record<string, string>>) => {
  const source = readFileSync(file, 'utf8')

  const visit = (node: unknown) => {
    if (!node || typeof node !== 'object') {
      return
    }

    const candidate = node as Node

    if (
      (candidate.type === 'ArrowFunctionExpression' || candidate.type === 'FunctionDeclaration') &&
      Array.isArray(candidate.params)
    ) {
      const [first] = candidate.params as Node[]
      const annotation = (first?.typeAnnotation as Node | undefined)?.typeAnnotation as Node | undefined
      const typeName =
        annotation?.type === 'TSTypeReference' ? ((annotation.typeName as Node).name as string) : undefined

      if (first?.type === 'ObjectPattern' && typeName) {
        const found = into.get(typeName) ?? {}

        for (const property of first.properties as Node[]) {
          const value = property.value as Node | undefined

          if (property.type === 'ObjectProperty' && value?.type === 'AssignmentPattern') {
            found[memberName(property.key as Node)] = source.slice(
              (value.right as Node).start,
              (value.right as Node).end
            )
          }
        }

        into.set(typeName, found)
      }
    }

    for (const [key, child] of Object.entries(candidate)) {
      if (key === 'leadingComments' || key === 'trailingComments' || key === 'loc') {
        continue
      }

      if (Array.isArray(child)) {
        child.forEach(visit)
      } else {
        visit(child)
      }
    }
  }

  parseFile(file).forEach(visit)
}

const isImplementation = (file: string) =>
  /\.(tsx?)$/.test(file) && !/\.(types|stories|check|test)\.tsx?$/.test(file) && !file.endsWith('contract.check.ts')

const build = (): Api => {
  const api: Api = {aliases: {}, types: {}}
  const files = SOURCES.flatMap(source => walk(path.join(REPO_ROOT, source)))
  const defaults = {android: new Map<string, Record<string, string>>(), ios: new Map<string, Record<string, string>>()}

  for (const file of files.filter(file => file.endsWith('.types.ts') || file.endsWith('sx.types.ts'))) {
    readTypes(api, file)
  }

  for (const file of files.filter(isImplementation)) {
    if (file.includes('.android.')) {
      readDefaults(file, defaults.android)
    } else if (file.includes('.ios.')) {
      readDefaults(file, defaults.ios)
    } else {
      readDefaults(file, defaults.ios)
      readDefaults(file, defaults.android)
    }
  }

  for (const type of Object.values(api.types)) {
    for (const member of type.members) {
      member.defaults = {
        android: defaults.android.get(type.name)?.[member.name],
        ios: defaults.ios.get(type.name)?.[member.name],
      }
    }
  }

  return api
}

export const readApi = fromCheckout(build)
