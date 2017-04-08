#!/usr/bin/env node
/* @flow */
import commander from 'commander'
import { getDescription } from 'graphql/utilities/buildASTSchema'
import { parse, visit } from 'graphql/language'
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
  return formatAst(schemaAst)
}
/**
 * Converts an AST into a string, using one set of reasonable
 * formatting rules.
 */
export function formatAst(ast) {
  return visit(ast, { leave: printDocASTReducer });
}

const printDocASTReducer = {
  Name: node => node.value,
  Variable: node => '$' + node.name,

  // Document

  Document: node => join(node.definitions, '\n\n') + '\n',

  OperationDefinition(node) {
    const op = node.operation;
    const name = node.name;
    const varDefs = wrap('(', join(node.variableDefinitions, ', '), ')');
    const directives = join(node.directives, ' ');
    const selectionSet = node.selectionSet;
    // Anonymous queries with no directives or variable definitions can use
    // the query short form.
    return !name && !directives && !varDefs && op === 'query' ?
      selectionSet :
      join([ op, join([ name, varDefs ]), directives, selectionSet ], ' ');
  },

  VariableDefinition: ({ variable, type, defaultValue }) =>
    variable + ': ' + type + wrap(' = ', defaultValue),

  SelectionSet: ({ selections }) => block(selections),

  Field: ({ alias, name, arguments: args, directives, selectionSet }) =>
    join([
      wrap('', alias, ': ') + name + wrap('(', join(args, ', '), ')'),
      join(directives, ' '),
      selectionSet
    ], ' '),

  Argument: ({ name, value }) => name + ': ' + value,

  // Fragments

  FragmentSpread: ({ name, directives }) =>
    '...' + name + wrap(' ', join(directives, ' ')),

  InlineFragment: ({ typeCondition, directives, selectionSet }) =>
    join([
      '...',
      wrap('on ', typeCondition),
      join(directives, ' '),
      selectionSet
    ], ' '),

  FragmentDefinition: ({ name, typeCondition, directives, selectionSet }) =>
    `fragment ${name} on ${typeCondition} ` +
    wrap('', join(directives, ' '), ' ') +
    selectionSet,

  // Value

  IntValue: ({ value }) => value,
  FloatValue: ({ value }) => value,
  StringValue: ({ value }) => JSON.stringify(value),
  BooleanValue: ({ value }) => JSON.stringify(value),
  NullValue: () => 'null',
  EnumValue: ({ value }) => value,
  ListValue: ({ values }) => '[' + join(values, ', ') + ']',
  ObjectValue: ({ fields }) => '{' + join(fields, ', ') + '}',
  ObjectField: ({ name, value }) => name + ': ' + value,

  // Directive

  Directive: ({ name, arguments: args }) =>
    '@' + name + wrap('(', join(args, ', '), ')'),

  // Type

  NamedType: ({ name }) => name,
  ListType: ({ type }) => '[' + type + ']',
  NonNullType: ({ type }) => type + '!',

  // Type System Definitions

  SchemaDefinition: ({ directives, operationTypes }) =>
    join([
      'schema',
      join(directives, ' '),
      block(operationTypes),
    ], ' '),

  OperationTypeDefinition: ({ operation, type }) =>
    operation + ': ' + type,

  ScalarTypeDefinition: ({ name, directives }) =>
    join([ 'scalar', name, join(directives, ' ') ], ' '),

  ObjectTypeDefinition: ({ name, interfaces, directives, fields }) =>
    join([
      'type',
      name,
      wrap('implements ', join(interfaces, ', ')),
      join(directives, ' '),
      block(fields)
    ], ' '),

  FieldDefinition: ({ name, arguments: args, type, directives }) =>
    name +
    wrap('(', join(args, ', '), ')') +
    ': ' + type +
    wrap(' ', join(directives, ' ')),

  InputValueDefinition: ({ name, type, defaultValue, directives }) =>
    join([
      name + ': ' + type,
      wrap('= ', defaultValue),
      join(directives, ' ')
    ], ' '),

  InterfaceTypeDefinition: ({ name, directives, fields }) =>
    join([
      'interface',
      name,
      join(directives, ' '),
      block(fields)
    ], ' '),

  UnionTypeDefinition: ({ name, directives, types }) =>
    join([
      'union',
      name,
      join(directives, ' '),
      '= ' + join(types, ' | ')
    ], ' '),

  EnumTypeDefinition: ({ name, directives, values }) =>
    join([
      'enum',
      name,
      join(directives, ' '),
      block(values)
    ], ' '),

  EnumValueDefinition: ({ name, directives }) =>
    join([ name, join(directives, ' ') ], ' '),

  InputObjectTypeDefinition: ({ name, directives, fields }) =>
    join([
      'input',
      name,
      join(directives, ' '),
      block(fields)
    ], ' '),

  TypeExtensionDefinition: ({ definition }) => `extend ${definition}`,

  DirectiveDefinition: ({ name, arguments: args, locations }) =>
    'directive @' + name + wrap('(', join(args, ', '), ')') +
    ' on ' + join(locations, ' | '),
};


Object
    .keys(printDocASTReducer)
    .filter(key => key !== 'Name')
    .forEach(key => {
        const fn = printDocASTReducer[key];
        printDocASTReducer[key] = withDescription(fn);
    });


function withDescription(fn) {
    return function (node) {
        const desc = getDescription(node);
        const descText = desc ? '# ' + desc + '\n' : '';
        return descText + fn(node);
    }
}

/**
 * Given maybeArray, print an empty string if it is null or empty, otherwise
 * print all items together separated by separator if provided
 */
function join(maybeArray, separator) {
  return maybeArray ? maybeArray.filter(x => x).join(separator || '') : '';
}

/**
 * Given array, print each item on its own line, wrapped in an
 * indented "{ }" block.
 */
function block(array) {
  return array && array.length !== 0 ?
    indent('{\n' + join(array, '\n')) + '\n}' :
    '{}';
}

/**
 * If maybeString is not null or empty, then wrap with start and end, otherwise
 * print an empty string.
 */
function wrap(start, maybeString, end) {
  return maybeString ?
    start + maybeString + (end || '') :
    '';
}

function indent(maybeString) {
  return maybeString && maybeString.replace(/\n/g, '\n  ');
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
  const formatFilePromises = fileGlobs.map(formatFileGlob)
  return await Promise.all(formatFilePromises)
}

if (!module.parent) {
  cli()
}
