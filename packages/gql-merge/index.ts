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
  buildSchema
} from 'graphql/utilities'
import {
  formatString
} from 'gql-format'

const readFile = Bluebird.promisify(fs.readFile)

export async function mergeGlob(inputGlob: string): Promise<string> {
  const filePaths: string[] = glob.sync(inputGlob)
  return mergeFilePaths(filePaths)
}

export async function mergeFilePaths(filePaths: string[]): Promise<string> {
  const fileReads: Bluebird<Buffer>[] = filePaths.map(file => readFile(file))
  const schemaBufs: Buffer[] = await Promise.all(fileReads)
  const schemaStrs: string[] = schemaBufs.map(s => s.toString())
  return mergeStrings(schemaStrs)
}

export async function mergeStrings(schemaStrs: string[]): Promise<string> {
  const schemaStr: string = schemaStrs.join('\n\n')
  return mergeString(schemaStr)
}

export async function mergeString(schemaStr: string): Promise<string> {
  const schemaAst: Document = parse(schemaStr)
  return mergeAst(schemaAst)
}

export async function mergeAst(schemaAst: Document) {
  const typeDefs = {}

  const editedAst: Document = visit(schemaAst, {
    enter(node) {
      console.log(node)
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

  return Promise.resolve(fullSchemaStr)
}
