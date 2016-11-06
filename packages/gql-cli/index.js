#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const fs = require("fs");
const program = require("commander");
const gql_merge_1 = require("gql-merge");
const package_json_1 = require("./package.json");
program
    .version(package_json_1.version)
    .description('Tools for working with GraphQL files');
program
    .command('merge <glob>')
    .description('Merge multiple GraphQL files into one')
    .option('-o, --out <path>', 'Output GraphQL file')
    .option('-v, --verbose', 'Enable verbose logging')
    .action((glob, options) => __awaiter(this, void 0, void 0, function* () {
    const schemaStr = yield gql_merge_1.mergeGlob(glob);
    if (options.out) {
        fs.writeFileSync(options.out, schemaStr);
    }
    else {
        process.stdout.write(schemaStr);
    }
}));
program
    .command('format <glob>')
    .description('Formats GraphQL files')
    .option('-w, --write', 'Overwrites existing GraphQL files with formatted version')
    .option('-v, --verbose', 'Enable verbose logging')
    .action((glob, options) => {
    console.log('format');
});
program.parse(process.argv);
