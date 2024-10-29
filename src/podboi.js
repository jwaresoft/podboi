import { existsSync } from "node:fs";
import fs from "fs";
import path from "path";
import { isUrl } from "./lib/isUrl/isUrl.js";
import {
  fetchFeed,
  convertXMLFeedToObject,
  parseFeedData,
} from "./lib/handleFeed/handleFeed.js";
import {
  handleCSV,
  handlePlainTextFile,
  downloadFile,
  scrubOriginalFileName
} from "./lib/handleFiles/handleFiles.js";

/**
 *
 * @param {*} feedParam
 * @param {*} destinationParam
 */
export async function handlePassedParamsAndRun(feedParam, destinationParam) {
  // check our values
  if (!existsSync(destinationParam)) {
    console.log(
      `{destinationParam} does not exist.  Pass a Directory which exists.`
    );
  }

  if (isUrl(feedParam)) {
    await downloadPodcastFeed(feedParam, destinationParam);
  } else {
    const fileExtension = feedParam.split(".").pop().toLowerCase();
    const feeds =
      fileExtension === "csv"
        ? handleCSV(feedParam)
        : handlePlainTextFile(feedParam);
    feeds.forEach(async (element) => {
      await downloadPodcastFeed(element, destinationParam);
    });
  }
}

/**
 *
 * @param {*} feed
 * @param {*} destination
 */
export async function downloadPodcastFeed(feed, destination) {
  let feedData = await fetchFeed(feed);
  feedData = convertXMLFeedToObject(feedData);
  feedData = parseFeedData(feedData);

  const safeFeedName = scrubOriginalFileName(feedData.title)
  const feedDirectory = path.join(destination, safeFeedName);

  // TODO: REFACTOR -- check for and create directory
  if (!existsSync(feedDirectory)) {
    try {
      fs.mkdir(feedDirectory, (e) => {
        if (e) {
          console.error(e.message);
          return;
        }
        console.log(`successfully created ${feedDirectory}`);
      });
    } catch (error) {
      console.error(error.message);
      return;
    }
  } else {
    console.log(`downloading ${safeFeedName} into ${feedDirectory}`);
  }

  for (let i = 0; i < feedData.episodes.length; i++) {
    const episode = feedData.episodes[i]
    const safeTitle = `${scrubOriginalFileName(episode.title)}.mp3`
    const destinationFile = path.join(feedDirectory, safeTitle)
    if(existsSync(destinationFile)) {
      console.log("SKIPPING: " + safeTitle + " already exists")
    } else {
      console.log("DOWNLOADING: " + safeTitle)
      await downloadFile(episode.mp3Url, destinationFile)
    }

  }
}