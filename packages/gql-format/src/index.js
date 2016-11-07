#!/usr/bin/env node
/* @flow */
import commander from 'commander'
import { parse, print, } from 'graphql/language'
import { readFileGlob, readFilePaths, writeFileObjects, } from 'gql-utils'
import { version, description, } from '../package.json'

export default {
  formatString,
  formatFileGlob,
  formatFileObjects,
  formatString,
}

/**
 * Find files matching the input glob, format them, and overwrite the originals.
 * @param {string} fileGlob - A glob pattern to find files, e.g. '*.graphql'
 * @return {Promise} The write files promise
 */
export async function formatFileGlob(fileGlob: string) {
  const fileObjects = await readFileGlob(fileGlob)
  return await formatFileObjects(fileObjects)
}

/**
 * Find files based on paths, format them, and overwrite the originals.
 * @param {string[]} filePaths - An array of file paths to look for.
 * @return {Promise<null>} The write files promise
 */
export async function formatFilePaths(filePaths: string[]) {
  const fileObjects = await readFilePaths(filePaths)
  return await formatFileObjects(fileObjects)
}

/**
 * Formats file contents and saves the result to the file path.
 * @param {{filePath: string, fileContents: string}[]} - An array of file paths
 * and content.
 * @return {Promise<null>} The write files promise
 */
export async function formatFileObjects(fileObjects : {filePath : string, fileContents : string}[]) {
  const fileObjectsFormatted = fileObjects.map(({filePath, fileContents}) => ({
    filePath,
    fileContents: formatString(fileContents),
  }))
  return await writeFileObjects(fileObjectsFormatted)
}

/**
 * Format a GraphQL schema string.
 * @param {string} schemaStr - The raw GraphQL string to format.
 * @return {string} The formatted string.
 */
export function formatString(schemaStr: string): string {
  const schemaAst: Document = parse(schemaStr)
  return print(schemaAst)
}

/**
 * The command-line interface for formatting GraphQL files. If this module is
 * being imported, it will register itself as a commander command 'format'.
 * Otherwise, it will run the CLI.
 * @param program - The commander object to modify.
 */
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
    command.action(async (inputGlob, options) => {
      await cliAction(command, inputGlob.split(' '))
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

async function cliAction(program, fileGlobs=[]) {
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
