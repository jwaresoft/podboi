import {
  readFileSync,
  createWriteStream,
  existsSync,
  mkdirSync,
} from "node:fs";
import Papa from "papaparse";
import { callFetch } from "../callFetch/callFetch.js";

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
  const response = await callFetch(url);
  const reader = response.body.getReader();
  const writer = createWriteStream(destination);

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    writer.write(value);
  }
}

/**
 * Remove characters which are not alphanumeric, or spaces to avoid filesystem issues
 *
 * @param {*} ogFileName
 * @returns
 */
export function scrubOriginalFileName(ogFileName) {
  return ogFileName.replace(/([^a-z0-9. ]+)/gi, "");
}

/**
 * Check for feed directory, and create it if it doesnt exist
 *
 * @param {*} feedDirectory
 * @returns
 */
export function handleFeedDirectory(feedDirectory) {
  if (!existsSync(feedDirectory)) {
    try {
      mkdirSync(feedDirectory, (e) => {
        if (e) {
          console.error(e.message);
          return false;
        }
      });
      console.log(`successfully created ${feedDirectory}`);
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  } else {
    return true;
  }
}

/**
 * Downloads a file to memory and returns an array buffer.  This is used to download images for tags.
 * 
 * @param {string} url
 * @returns
 */
export async function downloadFileToMemory(url) {
  try {
    const response = await callFetch(url);
    if (!response.ok) {
      throw new Error("Failed to download image");
    }

    const imageBuffer = await response.arrayBuffer()
    return imageBuffer;
  } catch (error) {
    console.error("Error downloading image:", error);
    return;
  }
}