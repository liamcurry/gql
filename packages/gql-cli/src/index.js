#!/usr/bin/env node
/* @flow */
import * as fs from 'fs'
import * as program from 'commander'
import {cli as format} from 'gql-format'
import {cli as merge} from 'gql-merge'
import {version} from '../package.json'

program
  .version(version)
  .description('Tools for working with GraphQL files')

program
  .command('merge <glob>')
  .description('Merge multiple GraphQL files into one')
  .option('-o, --out <path>', 'Output GraphQL file')
  .option('-v, --verbose', 'Enable verbose logging')
  .action(async (glob, options) => {
    const schemaStr = await mergeGlob(glob)
    if (options.out) {
      fs.writeFileSync(options.out, schemaStr)
    } else {
      process.stdout.write(schemaStr)
    }
  })

program
  .command('format <glob>')
  .description('Formats GraphQL files')
  .option('-w, --write', 'Overwrites existing GraphQL files with formatted version')
  .option('-v, --verbose', 'Enable verbose logging')
  .action((glob, options) => {
    console.log('format')
  })

program.parse(process.argv)
