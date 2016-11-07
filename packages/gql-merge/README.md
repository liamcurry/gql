# gql-merge

[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![npm](https://img.shields.io/npm/v/gql-merge.svg?style=flat-square)](https://www.npmjs.com/package/gql-merge)
[![npm](https://img.shields.io/npm/dm/gql-merge.svg?style=flat-square)](https://www.npmjs.com/package/gql-merge)
[![npm](https://img.shields.io/npm/l/gql-merge.svg?style=flat-square)](https://www.npmjs.com/package/gql-merge)

> Tools for merging GraphQL documents

## Table of Contents

- [Installation](#installation)
- [CLI](#cli)
- [API](#api)

## Installation

```
$ npm i -g gql-merge
```

## CLI

```
$ gql-merge -h

  Usage: gql-merge [options] <glob ...>

  Tools for merging GraphQL documents

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -o, --out-file <path>  Output GraphQL file, otherwise use stdout
    -v, --verbose          Enable verbose logging

  Examples:

    $ gql-merge **/*.graphql > schema.graphql
    $ gql-merge -o schema.graphql **/*.graphql
    $ gql-merge dir1/*.graphql dir2/*.graphql > schema.graphql

```

## API

More detailed docs coming soon.

### `mergeFileGlob`

### `mergeFilePaths`

### `mergeStrings`

### `mergeString`

### `mergeAst`
