#!/usr/bin/env node
/* @flow */
import program from 'commander'
import {cli as formatCli} from 'gql-format'
import {cli as mergeCli} from 'gql-merge'
import {version, description,} from '../package.json'

program
  .version(version)
  .description(description)

mergeCli(program)
formatCli(program)

program.parse(process.argv)
