#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cli = exports.mergeFilePaths = exports.mergeFileGlob = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var mergeFileGlob = exports.mergeFileGlob = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(fileGlob) {
    var fileDetails, fileContents;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _gqlUtils.readFileGlob)(fileGlob);

          case 2:
            fileDetails = _context.sent;
            fileContents = fileDetails.map(function (f) {
              return f.fileContents;
            });
            return _context.abrupt('return', mergeStrings(fileContents));

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function mergeFileGlob(_x) {
    return _ref.apply(this, arguments);
  };
}();

var mergeFilePaths = exports.mergeFilePaths = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(filePaths) {
    var fileDetails, fileContents;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _gqlUtils.readFilePaths)(filePaths);

          case 2:
            fileDetails = _context2.sent;
            fileContents = fileDetails.map(function (f) {
              return f.fileContents;
            });
            return _context2.abrupt('return', mergeStrings(fileContents));

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function mergeFilePaths(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var cli = exports.cli = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
    var fileGlobs, mergeGlobsPromises, schemaStrs, schemaStr, outFile;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _commander2.default.version(_package.version).description(_package.description).usage('[options] <glob ...>').option('-o, --out-file <path>', 'Output GraphQL file, otherwise use stdout').option('-v, --verbose', 'Enable verbose logging').on('--help', function () {
              console.log('  Examples:\n\n    $ gql-merge **/*.graphql > schema.graphql\n    $ gql-merge -o schema.graphql **/*.graphql\n    $ gql-merge dir1/*.graphql dir2/*.graphql > schema.graphql\n');
            }).parse(process.argv);

            if (!_commander2.default.args.length) {
              _context3.next = 17;
              break;
            }

            fileGlobs = _commander2.default.args;
            mergeGlobsPromises = fileGlobs.map(mergeFileGlob);
            _context3.next = 6;
            return _promise2.default.all(mergeGlobsPromises);

          case 6:
            schemaStrs = _context3.sent;
            schemaStr = mergeStrings(schemaStrs);
            outFile = _commander2.default.outFile;

            if (!outFile) {
              _context3.next = 14;
              break;
            }

            _context3.next = 12;
            return (0, _gqlUtils.writeFileObject)({
              filePath: outFile,
              fileContents: schemaStr
            });

          case 12:
            _context3.next = 15;
            break;

          case 14:
            process.stdout.write(schemaStr);

          case 15:
            _context3.next = 18;
            break;

          case 17:
            _commander2.default.help();

          case 18:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function cli() {
    return _ref3.apply(this, arguments);
  };
}();

exports.mergeStrings = mergeStrings;
exports.mergeString = mergeString;
exports.mergeAst = mergeAst;

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _language = require('graphql/language');

var _gqlFormat = require('gql-format');

var _gqlUtils = require('gql-utils');

var _package = require('../package.json');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  mergeFileGlob: mergeFileGlob,
  mergeFilePaths: mergeFilePaths,
  mergeStrings: mergeStrings,
  mergeString: mergeString,
  mergeAst: mergeAst
};
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

if (!module.parent) {
  cli();
}