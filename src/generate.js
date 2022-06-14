import JSONisIncorrect from './errors/JSONisIncorrect.js'
import path from 'path'

export default async function checkValidJSON(json) {
  const importedFile = path.resolve(json);
  try {
    return await import(importedFile)
  } catch (e) {
    throw new JSONisIncorrect(`${importedFile} is incorrect: ` + e.message);
  }
}