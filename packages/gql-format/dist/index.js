#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cli = exports.formatFileObjects = exports.formatFilePaths = exports.formatFileGlob = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

/**
 * Find files matching the input glob, format them, and overwrite the originals.
 * @param {string} fileGlob - A glob pattern to find files, e.g. '*.graphql'
 * @return {Promise} The write files promise
 */
var formatFileGlob = exports.formatFileGlob = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(fileGlob) {
    var fileObjects;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _gqlUtils.readFileGlob)(fileGlob);

          case 2:
            fileObjects = _context.sent;
            _context.next = 5;
            return formatFileObjects(fileObjects);

          case 5:
            return _context.abrupt('return', _context.sent);

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function formatFileGlob(_x) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Find files based on paths, format them, and overwrite the originals.
 * @param {string[]} filePaths - An array of file paths to look for.
 * @return {Promise<null>} The write files promise
 */


var formatFilePaths = exports.formatFilePaths = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(filePaths) {
    var fileObjects;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _gqlUtils.readFilePaths)(filePaths);

          case 2:
            fileObjects = _context2.sent;
            _context2.next = 5;
            return formatFileObjects(fileObjects);

          case 5:
            return _context2.abrupt('return', _context2.sent);

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function formatFilePaths(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Formats file contents and saves the result to the file path.
 * @param {{filePath: string, fileContents: string}[]} - An array of file paths
 * and content.
 * @return {Promise<null>} The write files promise
 */


var formatFileObjects = exports.formatFileObjects = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(fileObjects) {
    var fileObjectsFormatted;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            fileObjectsFormatted = fileObjects.map(function (_ref4) {
              var filePath = _ref4.filePath,
                  fileContents = _ref4.fileContents;
              return {
                filePath: filePath,
                fileContents: formatString(fileContents)
              };
            });
            _context3.next = 3;
            return (0, _gqlUtils.writeFileObjects)(fileObjectsFormatted);

          case 3:
            return _context3.abrupt('return', _context3.sent);

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function formatFileObjects(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * Format a GraphQL schema string.
 * @param {string} schemaStr - The raw GraphQL string to format.
 * @return {string} The formatted string.
 */


/**
 * The command-line interface for formatting GraphQL files. If this module is
 * being imported, it will register itself as a commander command 'format'.
 * Otherwise, it will run the CLI.
 * @param program - The commander object to modify.
 */
var cli = exports.cli = function () {
  var _ref37 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
    var _this = this;

    var program = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _commander2.default;
    var command;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (module.parent) {
              _context5.next = 8;
              break;
            }

            program.version(_package.version).usage('[options] <glob ...>');

            cliAddHelp(cliAddBasics(program));

            program.parse(process.argv);
            _context5.next = 6;
            return cliAction(program, program.args);

          case 6:
            _context5.next = 11;
            break;

          case 8:
            command = program.command('format <glob ...>');

            cliAddHelp(cliAddBasics(command));
            command.action(function () {
              var _ref38 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(inputGlob, options) {
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return cliAction(command, inputGlob.split(' '));

                      case 2:
                      case 'end':
                        return _context4.stop();
                    }
                  }
                }, _callee4, _this);
              }));

              return function (_x5, _x6) {
                return _ref38.apply(this, arguments);
              };
            }());

          case 11:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function cli() {
    return _ref37.apply(this, arguments);
  };
}();

var cliAction = function () {
  var _ref39 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(program) {
    var fileGlobs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var formatFilePromises;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            if (fileGlobs.length) {
              _context6.next = 2;
              break;
            }

            return _context6.abrupt('return', program.help());

          case 2:
            formatFilePromises = fileGlobs.map(formatFileGlob);
            _context6.next = 5;
            return _promise2.default.all(formatFilePromises);

          case 5:
            return _context6.abrupt('return', _context6.sent);

          case 6:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function cliAction(_x7) {
    return _ref39.apply(this, arguments);
  };
}();

exports.formatString = formatString;
exports.formatAst = formatAst;

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _buildASTSchema = require('graphql/utilities/buildASTSchema');

var _language = require('graphql/language');

var _gqlUtils = require('gql-utils');

var _package = require('../package.json');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _defineProperty3.default)({
  formatString: formatString,
  formatFileGlob: formatFileGlob,
  formatFileObjects: formatFileObjects
}, 'formatString', formatString);
function formatString(schemaStr) {
  var schemaAst = (0, _language.parse)(schemaStr);
  return formatAst(schemaAst);
}
/**
 * Converts an AST into a string, using one set of reasonable
 * formatting rules.
 */
function formatAst(ast) {
  return (0, _language.visit)(ast, { leave: printDocASTReducer });
}

var printDocASTReducer = {
  Name: function Name(node) {
    return node.value;
  },
  Variable: function Variable(node) {
    return '$' + node.name;
  },

  // Document

  Document: function Document(node) {
    return join(node.definitions, '\n\n') + '\n';
  },

  OperationDefinition: function OperationDefinition(node) {
    var op = node.operation;
    var name = node.name;
    var varDefs = wrap('(', join(node.variableDefinitions, ', '), ')');
    var directives = join(node.directives, ' ');
    var selectionSet = node.selectionSet;
    // Anonymous queries with no directives or variable definitions can use
    // the query short form.
    return !name && !directives && !varDefs && op === 'query' ? selectionSet : join([op, join([name, varDefs]), directives, selectionSet], ' ');
  },


  VariableDefinition: function VariableDefinition(_ref5) {
    var variable = _ref5.variable,
        type = _ref5.type,
        defaultValue = _ref5.defaultValue;
    return variable + ': ' + type + wrap(' = ', defaultValue);
  },

  SelectionSet: function SelectionSet(_ref6) {
    var selections = _ref6.selections;
    return block(selections);
  },

  Field: function Field(_ref7) {
    var alias = _ref7.alias,
        name = _ref7.name,
        args = _ref7.arguments,
        directives = _ref7.directives,
        selectionSet = _ref7.selectionSet;
    return join([wrap('', alias, ': ') + name + wrap('(', join(args, ', '), ')'), join(directives, ' '), selectionSet], ' ');
  },

  Argument: function Argument(_ref8) {
    var name = _ref8.name,
        value = _ref8.value;
    return name + ': ' + value;
  },

  // Fragments

  FragmentSpread: function FragmentSpread(_ref9) {
    var name = _ref9.name,
        directives = _ref9.directives;
    return '...' + name + wrap(' ', join(directives, ' '));
  },

  InlineFragment: function InlineFragment(_ref10) {
    var typeCondition = _ref10.typeCondition,
        directives = _ref10.directives,
        selectionSet = _ref10.selectionSet;
    return join(['...', wrap('on ', typeCondition), join(directives, ' '), selectionSet], ' ');
  },

  FragmentDefinition: function FragmentDefinition(_ref11) {
    var name = _ref11.name,
        typeCondition = _ref11.typeCondition,
        directives = _ref11.directives,
        selectionSet = _ref11.selectionSet;
    return 'fragment ' + name + ' on ' + typeCondition + ' ' + wrap('', join(directives, ' '), ' ') + selectionSet;
  },

  // Value

  IntValue: function IntValue(_ref12) {
    var value = _ref12.value;
    return value;
  },
  FloatValue: function FloatValue(_ref13) {
    var value = _ref13.value;
    return value;
  },
  StringValue: function StringValue(_ref14) {
    var value = _ref14.value;
    return (0, _stringify2.default)(value);
  },
  BooleanValue: function BooleanValue(_ref15) {
    var value = _ref15.value;
    return (0, _stringify2.default)(value);
  },
  NullValue: function NullValue() {
    return 'null';
  },
  EnumValue: function EnumValue(_ref16) {
    var value = _ref16.value;
    return value;
  },
  ListValue: function ListValue(_ref17) {
    var values = _ref17.values;
    return '[' + join(values, ', ') + ']';
  },
  ObjectValue: function ObjectValue(_ref18) {
    var fields = _ref18.fields;
    return '{' + join(fields, ', ') + '}';
  },
  ObjectField: function ObjectField(_ref19) {
    var name = _ref19.name,
        value = _ref19.value;
    return name + ': ' + value;
  },

  // Directive

  Directive: function Directive(_ref20) {
    var name = _ref20.name,
        args = _ref20.arguments;
    return '@' + name + wrap('(', join(args, ', '), ')');
  },

  // Type

  NamedType: function NamedType(_ref21) {
    var name = _ref21.name;
    return name;
  },
  ListType: function ListType(_ref22) {
    var type = _ref22.type;
    return '[' + type + ']';
  },
  NonNullType: function NonNullType(_ref23) {
    var type = _ref23.type;
    return type + '!';
  },

  // Type System Definitions

  SchemaDefinition: function SchemaDefinition(_ref24) {
    var directives = _ref24.directives,
        operationTypes = _ref24.operationTypes;
    return join(['schema', join(directives, ' '), block(operationTypes)], ' ');
  },

  OperationTypeDefinition: function OperationTypeDefinition(_ref25) {
    var operation = _ref25.operation,
        type = _ref25.type;
    return operation + ': ' + type;
  },

  ScalarTypeDefinition: function ScalarTypeDefinition(_ref26) {
    var name = _ref26.name,
        directives = _ref26.directives;
    return join(['scalar', name, join(directives, ' ')], ' ');
  },

  ObjectTypeDefinition: function ObjectTypeDefinition(_ref27) {
    var name = _ref27.name,
        interfaces = _ref27.interfaces,
        directives = _ref27.directives,
        fields = _ref27.fields;
    return join(['type', name, wrap('implements ', join(interfaces, ', ')), join(directives, ' '), block(fields)], ' ');
  },

  FieldDefinition: function FieldDefinition(_ref28) {
    var name = _ref28.name,
        args = _ref28.arguments,
        type = _ref28.type,
        directives = _ref28.directives;
    return name + wrap('(', join(args, ', '), ')') + ': ' + type + wrap(' ', join(directives, ' '));
  },

  InputValueDefinition: function InputValueDefinition(_ref29) {
    var name = _ref29.name,
        type = _ref29.type,
        defaultValue = _ref29.defaultValue,
        directives = _ref29.directives;
    return join([name + ': ' + type, wrap('= ', defaultValue), join(directives, ' ')], ' ');
  },

  InterfaceTypeDefinition: function InterfaceTypeDefinition(_ref30) {
    var name = _ref30.name,
        directives = _ref30.directives,
        fields = _ref30.fields;
    return join(['interface', name, join(directives, ' '), block(fields)], ' ');
  },

  UnionTypeDefinition: function UnionTypeDefinition(_ref31) {
    var name = _ref31.name,
        directives = _ref31.directives,
        types = _ref31.types;
    return join(['union', name, join(directives, ' '), '= ' + join(types, ' | ')], ' ');
  },

  EnumTypeDefinition: function EnumTypeDefinition(_ref32) {
    var name = _ref32.name,
        directives = _ref32.directives,
        values = _ref32.values;
    return join(['enum', name, join(directives, ' '), block(values)], ' ');
  },

  EnumValueDefinition: function EnumValueDefinition(_ref33) {
    var name = _ref33.name,
        directives = _ref33.directives;
    return join([name, join(directives, ' ')], ' ');
  },

  InputObjectTypeDefinition: function InputObjectTypeDefinition(_ref34) {
    var name = _ref34.name,
        directives = _ref34.directives,
        fields = _ref34.fields;
    return join(['input', name, join(directives, ' '), block(fields)], ' ');
  },

  TypeExtensionDefinition: function TypeExtensionDefinition(_ref35) {
    var definition = _ref35.definition;
    return 'extend ' + definition;
  },

  DirectiveDefinition: function DirectiveDefinition(_ref36) {
    var name = _ref36.name,
        args = _ref36.arguments,
        locations = _ref36.locations;
    return 'directive @' + name + wrap('(', join(args, ', '), ')') + ' on ' + join(locations, ' | ');
  }
};

(0, _keys2.default)(printDocASTReducer).filter(function (key) {
  return key !== 'Name';
}).forEach(function (key) {
  var fn = printDocASTReducer[key];
  printDocASTReducer[key] = withDescription(fn);
});

function withDescription(fn) {
  return function (node) {
    var desc = (0, _buildASTSchema.getDescription)(node);
    var descText = desc ? '# ' + desc + '\n' : '';
    return descText + fn(node);
  };
}

/**
 * Given maybeArray, print an empty string if it is null or empty, otherwise
 * print all items together separated by separator if provided
 */
function join(maybeArray, separator) {
  return maybeArray ? maybeArray.filter(function (x) {
    return x;
  }).join(separator || '') : '';
}

/**
 * Given array, print each item on its own line, wrapped in an
 * indented "{ }" block.
 */
function block(array) {
  return array && array.length !== 0 ? indent('{\n' + join(array, '\n')) + '\n}' : '{}';
}

/**
 * If maybeString is not null or empty, then wrap with start and end, otherwise
 * print an empty string.
 */
function wrap(start, maybeString, end) {
  return maybeString ? start + maybeString + (end || '') : '';
}

function indent(maybeString) {
  return maybeString && maybeString.replace(/\n/g, '\n  ');
}

function cliAddBasics(command) {
  return command.description(_package.description);
}

function cliAddHelp(command) {
  var commandName = !module.parent ? 'gql-format' : 'gql format';
  return command.on('--help', function () {
    return console.log('  Examples:\n\n    $ ' + commandName + ' **/*.graphql\n    $ ' + commandName + ' dir1/*.graphql dir2/*.graphql\n  ');
  });
}

if (!module.parent) {
  cli();
}