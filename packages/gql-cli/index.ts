#!/usr/bin/env node
import * as program from 'commander'
import {formatGlob} from 'gql-format'
import {mergeGlob} from 'gql-merge'
import {version} from './package.json'

program.version(version)

program
  .command('merge <glob>')
  .description('Merge multiple GraphQL files into one')
  .option('-o, --out <path>', 'Output GraphQL file')
  .option('-v, --verbose', 'Enable verbose logging')
  .action((glob, options) => {
    mergeGlob(glob)
      .then(schemaStr => {
        console.log(schemaStr)
        // todo: write to a file
      })
      .catch(err => {
        console.error(err)
        process.exit(1)
      })
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
