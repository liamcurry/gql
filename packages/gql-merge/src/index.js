#!/usr/bin/env node
import {promisify} from 'bluebird'
import {readFile, writeFile} from 'fs'
import glob from 'glob'
import program from 'commander'
import {parse,visit,print} from 'graphql/language'
import {formatString} from 'gql-format'
import {version, description} from '../package.json'

const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)
const globAsync = promisify(glob)

if (!module.parent) {
  cli()
}

export async function cli() {
  program
    .version(version)
    .description(description)
    .usage('[options] <glob>')
    .option('-o, --out-file <path>', 'Output GraphQL file, otherwise use stdout')
    .option('-v, --verbose', 'Enable verbose logging')

  program.parse(process.argv)
  const schemaStr = await mergeGlob(glob)
  const outFile = program.outFile
  if (outFile) {
    await writeFileAsync(outFile, schemaStr)
  } else {
    process.stdout.write(schemaStr)
  }
}

export async function mergeGlob(inputGlob: string): Promise<string> {
  const filePaths: string[] = await globAsync(inputGlob)
  return mergeFilePaths(filePaths)
}

export async function mergeFilePaths(filePaths: string[]): Promise<string> {
  const fileReads = filePaths.map(file => readFileAsync(file))
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
      const nodeName = node.name ? node.name.value : null
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

  const remainingNodesStr = print(editedAst)
  const typeDefsStr = Object.values(typeDefs).map(print).join('\n')
  const fullSchemaStr = `${remainingNodesStr}\n\n${typeDefsStr}`

  return formatString(fullSchemaStr)
}
