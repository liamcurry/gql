"use strict";
const language_1 = require("graphql/language");
function formatString(schemaStr) {
    const schemaAst = language_1.parse(schemaStr);
    return language_1.print(schemaAst);
}
exports.formatString = formatString;
