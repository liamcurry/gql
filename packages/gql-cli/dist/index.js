#!/usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _gqlFormat = require('gql-format');

var _gqlMerge = require('gql-merge');

var _package = require('../package.json');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version(_package.version).description(_package.description);

(0, _gqlMerge.cli)(_commander2.default);
(0, _gqlFormat.cli)(_commander2.default);

_commander2.default.parse(process.argv);