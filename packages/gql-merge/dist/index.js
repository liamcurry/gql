#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeFilePaths = exports.mergeGlob = exports.cli = undefined;

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var cli = exports.cli = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var schemaStr, outFile;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _commander2.default.version(_package.version).description(_package.description).usage('[options] <glob>').option('-o, --out-file <path>', 'Output GraphQL file, otherwise use stdout').option('-v, --verbose', 'Enable verbose logging');

            _commander2.default.parse(process.argv);
            _context.next = 4;
            return mergeGlob(_glob2.default);

          case 4:
            schemaStr = _context.sent;
            outFile = _commander2.default.outFile;

            if (!outFile) {
              _context.next = 11;
              break;
            }

            _context.next = 9;
            return writeFileAsync(outFile, schemaStr);

          case 9:
            _context.next = 12;
            break;

          case 11:
            process.stdout.write(schemaStr);

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function cli() {
    return _ref.apply(this, arguments);
  };
}();

var mergeGlob = exports.mergeGlob = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(inputGlob) {
    var filePaths;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return globAsync(inputGlob);

          case 2:
            filePaths = _context2.sent;
            return _context2.abrupt('return', mergeFilePaths(filePaths));

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function mergeGlob(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var mergeFilePaths = exports.mergeFilePaths = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(filePaths) {
    var fileReads, schemaBufs, schemaStrs;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            fileReads = filePaths.map(function (file) {
              return readFileAsync(file);
            });
            _context3.next = 3;
            return _promise2.default.all(fileReads);

          case 3:
            schemaBufs = _context3.sent;
            schemaStrs = schemaBufs.map(function (s) {
              return s.toString();
            });
            return _context3.abrupt('return', mergeStrings(schemaStrs));

          case 6:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function mergeFilePaths(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

exports.mergeStrings = mergeStrings;
exports.mergeString = mergeString;
exports.mergeAst = mergeAst;

var _bluebird = require('bluebird');

var _fs = require('fs');

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _language = require('graphql/language');

var _gqlFormat = require('gql-format');

var _package = require('../package.json');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var readFileAsync = (0, _bluebird.promisify)(_fs.readFile);
var writeFileAsync = (0, _bluebird.promisify)(_fs.writeFile);
var globAsync = (0, _bluebird.promisify)(_glob2.default);

if (!module.parent) {
  cli();
}

function mergeStrings(schemaStrs) {
  var schemaStr = schemaStrs.join('\n\n');
  return mergeString(schemaStr);
}

function mergeString(schemaStr) {
  var schemaAst = (0, _language.parse)(schemaStr);
  return mergeAst(schemaAst);
}

function mergeAst(schemaAst) {
  var typeDefs = {};

  var editedAst = (0, _language.visit)(schemaAst, {
    enter: function enter(node) {
      var nodeName = node.name ? node.name.value : null;
      if (!nodeName || !node.kind.endsWith('TypeDefinition')) {
        return;
      }

      var oldNode = typeDefs[nodeName];
      if (!oldNode) {
        typeDefs[nodeName] = node;
        return null;
      }

      var concatProps = ['fields', 'values'];

      concatProps.forEach(function (propName) {
        if (node[propName]) {
          node[propName] = oldNode[propName].concat(node[propName]);
        }
      });

      typeDefs[nodeName] = node;
      return null;
    }
  });

  var remainingNodesStr = (0, _language.print)(editedAst);
  var typeDefsStr = (0, _values2.default)(typeDefs).map(_language.print).join('\n');
  var fullSchemaStr = remainingNodesStr + '\n\n' + typeDefsStr;

  return (0, _gqlFormat.formatString)(fullSchemaStr);
}