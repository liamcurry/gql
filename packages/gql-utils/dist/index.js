'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeFileObject = exports.writeFileObjects = exports.readFilePath = exports.readFilePaths = exports.readFileGlob = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var readFileGlob = exports.readFileGlob = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(fileGlob) {
    var filePaths;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return globAsync(fileGlob);

          case 2:
            filePaths = _context.sent;
            return _context.abrupt('return', readFilePaths(filePaths));

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function readFileGlob(_x) {
    return _ref.apply(this, arguments);
  };
}();

var readFilePaths = exports.readFilePaths = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(filePaths) {
    var fileReads;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            fileReads = filePaths.map(readFilePath);
            _context2.next = 3;
            return _promise2.default.all(fileReads);

          case 3:
            return _context2.abrupt('return', _context2.sent);

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function readFilePaths(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var readFilePath = exports.readFilePath = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(filePath) {
    var fileContents;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return readFileAsync(filePath);

          case 2:
            fileContents = _context3.sent;
            return _context3.abrupt('return', { filePath: filePath, fileContents: fileContents.toString() });

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function readFilePath(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var writeFileObjects = exports.writeFileObjects = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(fileDetails) {
    var fileWrites;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            fileWrites = fileDetails.map(writeFileObject);
            _context4.next = 3;
            return _promise2.default.all(fileWrites);

          case 3:
            return _context4.abrupt('return', _context4.sent);

          case 4:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function writeFileObjects(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

var writeFileObject = exports.writeFileObject = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(_ref6) {
    var filePath = _ref6.filePath,
        fileContents = _ref6.fileContents;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return writeFileAsync(filePath, fileContents);

          case 2:
            return _context5.abrupt('return', _context5.sent);

          case 3:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function writeFileObject(_x5) {
    return _ref5.apply(this, arguments);
  };
}();

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _bluebird = require('bluebird');

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var readFileAsync = (0, _bluebird.promisify)(_fs.readFile);

var writeFileAsync = (0, _bluebird.promisify)(_fs.writeFile);
var globAsync = (0, _bluebird.promisify)(_glob2.default);

exports.default = {
  readFileGlob: readFileGlob,
  readFilePaths: readFilePaths,
  readFilePath: readFilePath,
  writeFileObjects: writeFileObjects,
  writeFileObject: writeFileObject
};