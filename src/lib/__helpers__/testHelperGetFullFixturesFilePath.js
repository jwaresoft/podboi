import path from "path";
import { fileURLToPath } from "url";

export function testHelperGetFullFixturesFilePath(fileName, format) {
  const formats = {
    xml: "rssXML",
    json: "rssJSON"
  }

  const formatKeys = Object.keys(formats)
  if(formatKeys.indexOf(format) < 0) {
    throw new Error(`unrecognized format ${format}!  Param format must be one of ${formatKeys} as a string`)
  }

  const fileFullPath = fileURLToPath(import.meta.url);
  const pathToHere = path.dirname(fileFullPath);
  const feedLocation = path.join(
    pathToHere,
    "..",
    `__fixtures__/${formats[format]}`,
    fileName
  );
  return feedLocation;
}


