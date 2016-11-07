#!/usr/bin/env node
/* @flow */
import program from 'commander'
import {parse,visit,print,} from 'graphql/language'
import {formatString,} from 'gql-format'
import {readFileGlob, readFilePaths, writeFileObject,} from 'gql-utils'
import {version, description,} from '../package.json'

export default {
  mergeFileGlob,
  mergeFilePaths,
  mergeStrings,
  mergeString,
  mergeAst,
}

export async function mergeFileGlob(fileGlob: string): Promise<string> {
  const fileDetails = await readFileGlob(fileGlob)
  const fileContents = fileDetails.map(f => f.fileContents)
  return mergeStrings(fileContents)
}

export async function mergeFilePaths(filePaths: string[]): Promise<string> {
  const fileDetails = await readFilePaths(filePaths)
  const fileContents = fileDetails.map(f => f.fileContents)
  return mergeStrings(fileContents)
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

export async function cli() {
  program
    .version(version)
    .description(description)
    .usage('[options] <glob ...>')
    .option('-o, --out-file <path>', 'Output GraphQL file, otherwise use stdout')
    .option('-v, --verbose', 'Enable verbose logging')
    .on('--help', function() {
      console.log(`  Examples:

    $ gql-merge **/*.graphql > schema.graphql
    $ gql-merge -o schema.graphql **/*.graphql
    $ gql-merge dir1/*.graphql dir2/*.graphql > schema.graphql
`)
    })
    .parse(process.argv)
  if (program.args.length) {
    const fileGlobs = program.args
    const mergeGlobsPromises = fileGlobs.map(mergeFileGlob)
    const schemaStrs = await Promise.all(mergeGlobsPromises)
    const schemaStr = mergeStrings(schemaStrs)

    const outFile = program.outFile
    if (outFile) {
      await writeFileObject({
        filePath: outFile,
        fileContents: schemaStr,
      })
    } else {
      console.log(schemaStr)
    }
  } else {
    program.help()
  }

}

if (!module.parent) {
  cli()
}
