#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cliAction = exports.cli = exports.mergeFilePaths = exports.mergeFileGlob = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/**
 * Find GraphQL files based on a glob pattern and merge the results.
 * @param {string} fileGlob - A glob pattern to find files, e.g. '*.graphql'
 * @return {Promise<string>} A promise of the resulting string.
 */
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

/**
 * Find GraphQL files based on a glob pattern and merge the results.
 * @param {string} fileGlob - A glob pattern to find files, e.g. '*.graphql'
 * @return {Promise<string>} A promise of the resulting string.
 */


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

/**
 * Merges an array of GraphQL strings into one
 * @param {string[]} schemaStrs - An array of GraphQL strings.
 * @return {string} The resulting merged GraphQL string.
 */


var cli = exports.cli = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
    var _this = this;

    var program = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _commander2.default;
    var command;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (module.parent) {
              _context4.next = 8;
              break;
            }

            program.version(_package.version).usage('[options] <glob ...>');

            cliAddHelp(cliAddBasics(program));

            program.parse(process.argv);
            _context4.next = 6;
            return cliAction(program, program.args, program);

          case 6:
            _context4.next = 11;
            break;

          case 8:
            command = program.command('merge <glob ...>');

            cliAddHelp(cliAddBasics(command));
            command.action(function () {
              var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(inputGlob, options) {
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return cliAction(command, inputGlob.split(' '), options);

                      case 2:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, _this);
              }));

              return function (_x4, _x5) {
                return _ref4.apply(this, arguments);
              };
            }());

          case 11:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function cli() {
    return _ref3.apply(this, arguments);
  };
}();

var cliAction = exports.cliAction = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(program) {
    var fileGlobs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var _ref6 = arguments[2];
    var outFile = _ref6.outFile;
    var mergeGlobsPromises, schemaStrs, schemaStr;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (fileGlobs.length) {
              _context5.next = 2;
              break;
            }

            return _context5.abrupt('return', program.help());

          case 2:
            mergeGlobsPromises = fileGlobs.map(mergeFileGlob);
            _context5.next = 5;
            return _promise2.default.all(mergeGlobsPromises);

          case 5:
            schemaStrs = _context5.sent;
            schemaStr = mergeStrings(schemaStrs);

            if (!outFile) {
              _context5.next = 12;
              break;
            }

            _context5.next = 10;
            return (0, _gqlUtils.writeFileObject)({
              filePath: outFile,
              fileContents: schemaStr
            });

          case 10:
            _context5.next = 13;
            break;

          case 12:
            console.log(schemaStr);

          case 13:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function cliAction(_x6) {
    return _ref5.apply(this, arguments);
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

/**
 * Merges duplicate definitions in a single GraphQL string
 * @param {string} schemaStr - The GraphQL String.
 * @return {string} The resulting merged GraphQL string.
 */
function mergeString(schemaStr) {
  var schemaAst = (0, _language.parse)(schemaStr);
  return mergeAst(schemaAst);
}

/**
 * Merges duplicate definitions in a single GraphQL abstract-syntax tree
 * @param {Document} schemaAst - The GraphQL AST.
 * @return {string} The resulting merged GraphQL string.
 */
function mergeAst(schemaAst) {
  var typeDefs = {};

  // Go through the AST and extract/merge type definitions.
  var editedAst = (0, _language.visit)(schemaAst, {
    enter: function enter(node) {
      var nodeName = node.name ? node.name.value : null;

      // Don't transform TypeDefinitions directly
      if (!nodeName || !node.kind.endsWith('TypeDefinition')) {
        return;
      }

      var oldNode = typeDefs[nodeName];

      if (!oldNode) {
        // First time seeing this type so just store the value.
        typeDefs[nodeName] = node;
        return null;
      }

      // This type is defined multiple times, so merge the fields and values.
      var concatProps = ['fields', 'values', 'types'];
      concatProps.forEach(function (propName) {
        if (node[propName] && oldNode[propName]) {
          node[propName] = oldNode[propName].concat(node[propName]);
        }
      });

      typeDefs[nodeName] = node;
      return null;
    }
  });

  var remainingNodesStr = (0, _gqlFormat.formatAst)(editedAst);
  var typeDefsStr = (0, _values2.default)(typeDefs).map(_gqlFormat.formatAst).join('\n');
  var fullSchemaStr = remainingNodesStr + '\n\n' + typeDefsStr;

  return (0, _gqlFormat.formatString)(fullSchemaStr);
}

function cliAddBasics(command) {
  return command.description(_package.description).option('-o, --out-file <path>', 'Output GraphQL file, otherwise use stdout');
}

function cliAddHelp(command) {
  var commandName = !module.parent ? 'gql-merge' : 'gql merge';
  return command.on('--help', function () {
    return console.log('  Examples:\n    $ ' + commandName + ' **/*.graphql > schema.graphql\n    $ ' + commandName + ' -o schema.graphql **/*.graphql\n    $ ' + commandName + ' dir1/*.graphql dir2/*.graphql > schema.graphql\n  ');
  });
}

if (!module.parent) {
  cli();
}