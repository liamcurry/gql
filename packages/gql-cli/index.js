#!/usr/bin/env node
"use strict";
const program = require("commander");
const gql_merge_1 = require("gql-merge");
const package_json_1 = require("./package.json");
program.version(package_json_1.version);
program
    .command('merge <glob>')
    .description('Merge multiple GraphQL files into one')
    .option('-o, --out <path>', 'Output GraphQL file')
    .option('-v, --verbose', 'Enable verbose logging')
    .action((glob, options) => {
    gql_merge_1.mergeGlob(glob)
        .then(schemaStr => {
        console.log(schemaStr);
    })
        .catch(err => {
        console.error(err);
        process.exit(1);
    });
});
program
    .command('format <glob>')
    .description('Formats GraphQL files')
    .option('-w, --write', 'Overwrites existing GraphQL files with formatted version')
    .option('-v, --verbose', 'Enable verbose logging')
    .action((glob, options) => {
    console.log('format');
});
program.parse(process.argv);
