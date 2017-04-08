# gql-merge

[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![npm](https://img.shields.io/npm/v/gql-merge.svg?style=flat-square)](https://www.npmjs.com/package/gql-merge)
[![npm](https://img.shields.io/npm/dm/gql-merge.svg?style=flat-square)](https://www.npmjs.com/package/gql-merge)
[![npm](https://img.shields.io/npm/l/gql-merge.svg?style=flat-square)](https://www.npmjs.com/package/gql-merge)

> Tools for merging GraphQL documents

## Table of Contents

- [Background](#background)
- [Installation](#installation)
- [CLI](#cli)
- [API](#api)

## Background


This repo contains tools for merging definitions into multiple GraphQL documents
into one. For example, say you have these two files GraphQL files:

```graphql
type Post {
  id: ID!
  content: String
}

type Query {
  postById(id: ID!): Post
}
```

```graphql
type Author {
  id: ID!
  name: String
}

type Query {
  postsByAuthorId(id: ID!): [Post]
}
```

You can use the `gql-merge` CLI to combine these files into one:

```
$ gql-merge --out-file schema.graphql testdata/readme*
```

The resulting file would look like this:

```graphql
type Post {
  id: ID!
  content: String
}

type Query {
  postById(id: ID!): Post
  postsByAuthorId(id: ID!): [Post]
}

type Author {
  id: ID!
  name: String
}
```

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

You can also import the package. The following example merges all files living in the `data/types` folder.

```
import fs from 'fs';
import path from 'path';
import { mergeStrings } from 'gql-merge';

const typesDir = path.resolve(__dirname, 'data/types');
const typeFiles = fs.readdirSync(typesDir);
const types = typeFiles.map(file => fs.readFileSync(path.join(typesDir, file), 'utf-8'));
const typeDefs = mergeStrings(types);
```

More detailed docs coming soon.

### `mergeFileGlob`

### `mergeFilePaths`

### `mergeStrings`

### `mergeString`

### `mergeAst`
