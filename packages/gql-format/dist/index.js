#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cliAction = exports.cli = exports.formatFileObjects = exports.formatFilePaths = exports.formatFileGlob = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

var cli = exports.cli = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
    var program = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _commander2.default;
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
            return cliAction(program, program.args);

          case 6:
            _context4.next = 9;
            break;

          case 8:
            (function () {
              var command = program.command('format <glob ...>');
              cliAddHelp(cliAddBasics(command));
              command.action(function (inputGlob, options) {
                cliAction(command, inputGlob.split(' '));
              });
            })();

          case 9:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function cli(_x4) {
    return _ref5.apply(this, arguments);
  };
}();

var cliAction = exports.cliAction = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(program) {
    var fileGlobs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var formatFilePromises;
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
            console.log;
            formatFilePromises = fileGlobs.map(formatFileGlob);
            _context5.next = 6;
            return _promise2.default.all(formatFilePromises);

          case 6:
            return _context5.abrupt('return', _context5.sent);

          case 7:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function cliAction(_x6, _x7) {
    return _ref6.apply(this, arguments);
  };
}();

exports.formatString = formatString;

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _language = require('graphql/language');

var _gqlUtils = require('gql-utils');

var _package = require('../package.json');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function formatString(schemaStr) {
  var schemaAst = (0, _language.parse)(schemaStr);
  return (0, _language.print)(schemaAst);
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