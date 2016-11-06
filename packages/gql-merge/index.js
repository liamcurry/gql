"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const Bluebird = require("bluebird");
const _ = require("lodash");
const fs = require("fs");
const glob = require("glob");
const language_1 = require("graphql/language");
const gql_format_1 = require("gql-format");
const readFileAsync = Bluebird.promisify(fs.readFile);
const globAsync = Bluebird.promisify(glob);
function mergeGlob(inputGlob) {
    return __awaiter(this, void 0, void 0, function* () {
        const filePaths = yield globAsync(inputGlob);
        return mergeFilePaths(filePaths);
    });
}
exports.mergeGlob = mergeGlob;
function mergeFilePaths(filePaths) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileReads = filePaths.map(file => readFileAsync(file));
        const schemaBufs = yield Promise.all(fileReads);
        const schemaStrs = schemaBufs.map(s => s.toString());
        return mergeStrings(schemaStrs);
    });
}
exports.mergeFilePaths = mergeFilePaths;
function mergeStrings(schemaStrs) {
    const schemaStr = schemaStrs.join('\n\n');
    return mergeString(schemaStr);
}
exports.mergeStrings = mergeStrings;
function mergeString(schemaStr) {
    const schemaAst = language_1.parse(schemaStr);
    return mergeAst(schemaAst);
}
exports.mergeString = mergeString;
function mergeAst(schemaAst) {
    const typeDefs = {};
    const editedAst = language_1.visit(schemaAst, {
        enter(node) {
            const nodeName = _.get(node, 'name.value');
            if (!nodeName || !node.kind.endsWith('TypeDefinition')) {
                return;
            }
            const oldNode = typeDefs[nodeName];
            if (!oldNode) {
                typeDefs[nodeName] = node;
                return null;
            }
            const concatProps = ['fields', 'values'];
            concatProps.forEach(propName => {
                if (node[propName]) {
                    node[propName] = oldNode[propName].concat(node[propName]);
                }
            });
            typeDefs[nodeName] = node;
            return null;
        }
    });
    const fullSchemaStr = gql_format_1.formatString(`${language_1.print(editedAst)}

${_.values(typeDefs).map(language_1.print).join('\n')}`);
    return fullSchemaStr;
}
exports.mergeAst = mergeAst;
