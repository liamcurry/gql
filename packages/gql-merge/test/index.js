"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const ava_1 = require("ava");
const gql_format_1 = require("gql-format");
const _1 = require("../");
ava_1.default('mergeString', (t) => __awaiter(this, void 0, void 0, function* () {
    const input = `type Foo {
  bar: String
}

type Foo {
  baz: String
}`;
    const result = yield _1.mergeString(input);
    const expected = gql_format_1.formatString(`type Foo {
  bar: String
  baz: String
}`);
    t.is(result, gql_format_1.formatString(expected));
}));
ava_1.default('mergeStrings', (t) => __awaiter(this, void 0, void 0, function* () {
    const schema1 = `type Foo {
  bar: String
}`;
    const schema2 = `type Foo {
  baz: String
}`;
    const schema3 = `type Query {
  hello(input: String): String
}`;
    const result = yield _1.mergeStrings([schema1, schema2, schema3]);
    const expected = gql_format_1.formatString(`type Foo {
  bar: String
  baz: String
}

type Query {
  hello(input: String): String
}`);
    t.is(result, expected);
}));
