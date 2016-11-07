#!/usr/bin/env node
/* @flow */
import commander from 'commander'
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
  const fileObjectsFormatted = fileObjects.map(({filePath, fileContents}) => ({
    filePath,
    fileContents: formatString(fileContents),
  }))
  return await writeFileObjects(fileObjectsFormatted)
}

export async function cli(program=commander) {
  if (!module.parent) {
    program
      .version(version)
      .usage('[options] <glob ...>')

    cliAddHelp(cliAddBasics(program))

    program.parse(process.argv)
    await cliAction(program, program.args)
  } else {
    const command = program.command('format <glob ...>')
    cliAddHelp(cliAddBasics(command))
    command.action((inputGlob, options) => {
      cliAction(command, inputGlob.split(' '))
    })
  }
}

function cliAddBasics(command) {
  return command.description(description)
}

function cliAddHelp(command) {
  const commandName =
    !module.parent
      ? 'gql-format'
      : 'gql format'
  return command.on('--help', () => console.log(`  Examples:

    $ ${commandName} **/*.graphql
    $ ${commandName} dir1/*.graphql dir2/*.graphql
  `))
}

export async function cliAction(program, fileGlobs=[]) {
  if (!fileGlobs.length) {
    return program.help()
  }
  console.log
  const formatFilePromises = fileGlobs.map(formatFileGlob)
  return await Promise.all(formatFilePromises)
}

if (!module.parent) {
  cli()
}
