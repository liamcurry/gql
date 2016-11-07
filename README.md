# gql

[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![Travis](https://img.shields.io/travis/liamcurry/gql.svg?style=flat-square)]()

> Tools for working with GraphQL documents

**Warning: these tools are still in an early phase and there will be issues. Bug reports and pull-requests are welcome!**

## Table of Contents

- [Background](#background)
- [Install](#getting-started)
    - [Packages](#packages)
- [Contribute](#contribute)
- [License](#license)

## Background

Building GraphQL schemas in the GraphQL native language (i.e. `.graphql` files)
has several benefits over using a programming language:

- Your data structures are language agnostic so only the resolvers need to be
programmed.
- The GraphQL language is terser than most programming languages.
- Schemas rarely change after compile time; most people won't take advantage
of progammatic schemas.
- Schemas can be accessed without a GraphQL server.

Hopefully the tools in this repository make it easier to work with GraphQL files.

## Install

The quickest way to get started is by globally installing the `gql` command-line interface:

```
$ npm i -g gql-cli
```

### Packages

Package | Description | Version | Dependencies
------- | ----------- | ------- | ------------
[`gql-cli`](https://www.npmjs.com/package/gql-cli) | Command-line interface for `gql` GraphQL tools | [![npm](https://img.shields.io/npm/v/gql-cli.svg?style=flat-square)](https://www.npmjs.com/package/gql-cli) |[![Dependency Status](https://david-dm.org/liamcurry/gql.svg?path=packages/gql-cli)](https://david-dm.org/liamcurry/gql?path=packages/gql-cli)
[`gql-format`](https://www.npmjs.com/package/gql-format) | Tools for formatting GraphQL documents | [![npm](https://img.shields.io/npm/v/gql-format.svg?style=flat-square)](https://www.npmjs.com/package/gql-format) |[![Dependency Status](https://david-dm.org/liamcurry/gql.svg?path=packages/gql-format)](https://david-dm.org/liamcurry/gql?path=packages/gql-format)
[`gql-merge`](https://www.npmjs.com/package/gql-merge) | Tools for merging GraphQL documents | [![npm](https://img.shields.io/npm/v/gql-merge.svg?style=flat-square)](https://www.npmjs.com/package/gql-merge) |[![Dependency Status](https://david-dm.org/liamcurry/gql.svg?path=packages/gql-merge)](https://david-dm.org/liamcurry/gql?path=packages/gql-merge)
[`gql-lint`](https://www.npmjs.com/package/gql-lint) | Tools for linting GraphQL documents | [![npm](https://img.shields.io/npm/v/gql-lint.svg?style=flat-square)](https://www.npmjs.com/package/gql-lint) |[![Dependency Status](https://david-dm.org/liamcurry/gql.svg?path=packages/gql-lint)](https://david-dm.org/liamcurry/gql?path=packages/gql-lint)

## Contribute

Feel free to dive in! [Open an issue](/liamcurry/gql/issues/new) or submit PRs.

Standard Readme follows the [Contributor Covenant Code of Conduct](http://contributor-covenant.org/version/1/3/0/).

## License

MIT (c) Liam Curry
