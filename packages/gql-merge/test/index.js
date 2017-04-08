import test from 'ava'
import {formatString} from 'gql-format'
import {
  mergeString,
  mergeStrings,
} from '../dist'

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


test('commentDescriptions', async t => {
  const schema1 = `
# This should have a comment description
type ThingWithDesc {
  # Bar is a string
  bar: String
}`

  const schema2 = `
# This should have a comment description
type ThingWithDesc {
  # Foo is an int
  foo: Int
}`

  const result = await mergeStrings([schema1, schema2])
  const expected = formatString(`
# This should have a comment description
type ThingWithDesc {
  # Bar is a string
  bar: String
  # Foo is an int
  foo: Int
}`)
  t.is(result, expected)
})


test('enums', async t => {
  const schema1 = `
# This should have a comment description
enum Thing {
  # Thing1 is a thing
  Thing1
}`

  const schema2 = `
# This should have a comment description
enum Thing {
  # Thing2 is a thing
  Thing2
}`

  const result = await mergeStrings([schema1, schema2])
  const expected = formatString(`
# This should have a comment description
enum Thing {
  # Thing1 is a thing
  Thing1
  # Thing2 is a thing
  Thing2
}`)
  t.is(result, expected)
})


test('unions', async t => {
  const schema1 = `
# This should have a comment description
union Thing
    = Thing1`

  const schema2 = `
# This should have a comment description
union Thing
    = Thing2`

  const result = await mergeStrings([schema1, schema2])
  const expected = formatString(`
# This should have a comment description
union Thing = Thing1 | Thing2`)
  t.is(result, expected)
})
