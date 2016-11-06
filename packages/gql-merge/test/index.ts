import test from 'ava'
import {formatString} from 'gql-format'
import {
  mergeGlob,
  mergeString,
  mergeStrings
} from '../'

// test('mergeGlob', async t => {
//   try {
//     await mergeGlob('test/**/*.graphql')
//   } catch(e) {
//     t.fail('failed')
//   }
// })

test('mergeString', async t => {
  const input = `type Foo {
  bar: String
}

type Foo {
  baz: String
}`
  const result = await mergeString(input)
  const expected = formatString(`type Foo {
  bar: String
  baz: String
}`)
  t.is(result, formatString(expected))
})


test('mergeStrings', async t => {
  const schema1 = `type Foo {
  bar: String
}`

  const schema2 = `type Foo {
  baz: String
}`

  const schema3 = `type Query {
  hello(input: String): String
}`
  const result = await mergeStrings([schema1, schema2, schema3])
  const expected = formatString(`type Foo {
  bar: String
  baz: String
}

type Query {
  hello(input: String): String
}`)
  t.is(result, expected)
})
