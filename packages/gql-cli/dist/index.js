#!/usr/bin/env node
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _commander = require('commander');

var program = _interopRequireWildcard(_commander);

var _gqlFormat = require('gql-format');

var _gqlMerge = require('gql-merge');

var _package = require('../package.json');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

program.version(_package.version).description('Tools for working with GraphQL files');


program.command('merge <glob>').description('Merge multiple GraphQL files into one').option('-o, --out <path>', 'Output GraphQL file').option('-v, --verbose', 'Enable verbose logging').action(function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(glob, options) {
    var schemaStr;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return mergeGlob(glob);

          case 2:
            schemaStr = _context.sent;

            if (options.out) {
              fs.writeFileSync(options.out, schemaStr);
            } else {
              process.stdout.write(schemaStr);
            }

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

program.command('format <glob>').description('Formats GraphQL files').option('-w, --write', 'Overwrites existing GraphQL files with formatted version').option('-v, --verbose', 'Enable verbose logging').action(function (glob, options) {
  console.log('format');
});

program.parse(process.argv);