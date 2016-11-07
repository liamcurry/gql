#!/usr/bin/env node
/* @flow */
import program from 'commander'
import { parse, print, } from 'graphql/language'
import { readFileGlob, readFilePaths, writeFileObjects, } from 'gql-utils'
import { version, description, } from '../package.json'

export function formatString(schemaStr: string): string {
  const schemaAst: Document = parse(schemaStr)
  return print(schemaAst)
}

export async function formatFileGlob(fileGlob: string) {
  const fileObjects = await readFileGlob(fileGlob)
  return await formatFileObjects(fileObjects)
}

export async function formatFilePaths(filePaths: string[]) {
  const fileObjects = await readFilePaths(filePaths)
  return await formatFileObjects(fileObjects)
}

export async function formatFileObjects(fileObjects) {
  const fileObjectsFormatted = fileObjects.map(({filePath, fileContents, }) => ({
    filePath,
    fileContents: formatString(fileContents),
  }))
  return await writeFileObjects(fileObjectsFormatted)
}

export async function cli() {
  program
    .version(version)
    .description(description)
    .usage('[options] <glob>')
    .parse(process.argv)
  if (program.args.length) {
    const inputGlobs = program.args
    const formatFilePromises = inputGlobs.map(formatFileGlob)
    return await Promise.all(formatFilePromises)
  } else {
    program.help()
  }
}

if (!module.parent) {
  cli()
}
