import * as Bluebird from 'bluebird'
import * as _ from 'lodash'
import * as fs from 'fs'
import * as path from 'path'
import * as glob from 'glob'
import {
  parse,
  visit,
  print
} from 'graphql/language'
import {
  formatString
} from 'gql-format'

const readFileAsync = Bluebird.promisify(fs.readFile)
const globAsync = Bluebird.promisify(glob)

export async function mergeGlob(inputGlob: string): Promise<string> {
  const filePaths: string[] = await globAsync(inputGlob)
  return mergeFilePaths(filePaths)
}

export async function mergeFilePaths(filePaths: string[]): Promise<string> {
  const fileReads: Bluebird<Buffer>[] = filePaths.map(file => readFileAsync(file))
  const schemaBufs: Buffer[] = await Promise.all(fileReads)
  const schemaStrs: string[] = schemaBufs.map(s => s.toString())
  return mergeStrings(schemaStrs)
}

export function mergeStrings(schemaStrs: string[]): string {
  const schemaStr: string = schemaStrs.join('\n\n')
  return mergeString(schemaStr)
}

export function mergeString(schemaStr: string): string {
  const schemaAst: Document = parse(schemaStr)
  return mergeAst(schemaAst)
}

export function mergeAst(schemaAst: Document): string {
  const typeDefs = {}

  const editedAst: Document = visit(schemaAst, {
    enter(node) {
      const nodeName = _.get(node, 'name.value')
      if (!nodeName || !node.kind.endsWith('TypeDefinition')) {
        return
      }

      const oldNode = typeDefs[nodeName]
      if (!oldNode) {
        typeDefs[nodeName] = node
        return null
      }

      const concatProps = ['fields', 'values']

      concatProps.forEach(propName => {
        if (node[propName]) {
          node[propName] = oldNode[propName].concat(node[propName])
        }
      })

      typeDefs[nodeName] = node
      return null
    }
  })

  const fullSchemaStr = formatString(`${print(editedAst)}

${_.values(typeDefs).map(print).join('\n')}`)

  return fullSchemaStr
}
