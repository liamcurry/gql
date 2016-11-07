/* @flow */
import {promisify} from 'bluebird'
import {readFile, writeFile} from 'fs'
import glob from 'glob'

const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)
const globAsync = promisify(glob)

export default {
  readFileGlob,
  readFilePaths,
  readFilePath,
  writeFileObjects,
  writeFileObject,
}

export async function readFileGlob(fileGlob: string): Promise<any> {
  const filePaths: string[] = await globAsync(fileGlob)
  return readFilePaths(filePaths)
}

export async function readFilePaths(filePaths: string[]): Promise<any>  {
  const fileReads = filePaths.map(readFilePath)
  return await Promise.all(fileReads)
}

export async function readFilePath(filePath: string): Promise<any> {
  const fileContents = await readFileAsync(filePath)
  return {filePath, fileContents: fileContents.toString()}
}

export async function writeFileObjects(fileDetails): Promise<any> {
  const fileWrites = fileDetails.map(writeFileObject)
  return await Promise.all(fileWrites)
}

export async function writeFileObject({filePath, fileContents}): Promise<any> {
  return await writeFileAsync(filePath, fileContents)
}
