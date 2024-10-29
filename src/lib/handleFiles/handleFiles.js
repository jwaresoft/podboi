import { readFileSync, createWriteStream } from "node:fs";
import Papa from "papaparse";
import { callFetch } from "../callFetch/callFetch.js";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

export function handleCSV(filePath) {
  let feedFile = handleFileOpen(filePath);

  if (feedFile) {
    feedFile = Papa.parse(feedFile);
    feedFile = feedFile.data.map((feedData) => {
      return feedData[0];
    });
  }

  return feedFile;
}

export function handlePlainTextFile(filePath) {
  let feedFile = handleFileOpen(filePath);

  if (feedFile) {
    feedFile = feedFile.split("\n");
  }

  return feedFile;
}

/**
 * opens a file, returns undefined if it could not read the file
 *
 * @param {string} filePath
 * @returns
 */
export function handleFileOpen(filePath) {
  let content;
  try {
    content = readFileSync(filePath, "utf8");
  } catch (e) {
    console.error(e.message);
    return;
  }
  return content;
}

/**
 * downloads a file to a destination
 *
 * @param {string} url
 * @param {string} destination
 * @returns {boolean}
 */
export async function downloadFile(url, destination) {
  const response = await callFetch(url)
  const reader = response.body.getReader()
  const writer = createWriteStream(destination)

  while(true) {
    // done is true for the last chunk
    // value is Uint8Array of the chunk bytes
    const {done, value} = await reader.read();
  
    if (done) {
      
      break;
    }
  
    writer.write(value)
  }
}

export function scrubOriginalFileName(ogFileName) {
  return ogFileName.replace(/([^a-z0-9. ]+)/gi, '');
}