import {
  parse,
  print
} from 'graphql/language'

export function formatString(schemaStr: string): string {
  const schemaAst: Document = parse(schemaStr)
  return print(schemaAst)
}
