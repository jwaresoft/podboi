import path from 'path'
import { fileURLToPath } from 'url';

export function testHelperGetFullFilePath(fileName) {
    const fileFullPath = fileURLToPath(import.meta.url);
    const pathToHere = path.dirname(fileFullPath)
    const feedLocation  = path.join(pathToHere, "..", '__fixtures__/rssXML', fileName  )
    return feedLocation
  }