import { existsSync } from "node:fs";
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
  scrubOriginalFileName,
  handleFeedDirectory
} from "./lib/handleFiles/handleFiles.js";

/**
 *
 * @param {*} feedParam
 * @param {*} destinationParam
 */
export async function handlePassedParamsAndRun(feedParam, destinationParam) {
  // check our values
  if (!existsSync(destinationParam)) {
    console.warning(
      `WARNING: {destinationParam} does not exist.  Pass a Directory which exists.`
    );
    process.exit(0)
  }

  if (isUrl(feedParam)) {
    await downloadPodcastFeed(feedParam, destinationParam);
  } else {
    // get file extension and see if it is a csv or plaintext file
    const fileExtension = feedParam.split(".").pop().toLowerCase();
    const feeds =
      fileExtension === "csv"
        ? handleCSV(feedParam)
        : handlePlainTextFile(feedParam);
    for(let i = 0 ; i < feeds.length; i++) {
      const currentFeed = feeds[i]
      if(currentFeed) {
        await downloadPodcastFeed(currentFeed, destinationParam);
      } else {
        console.warn("SKIPPING: blank line in feed file")
      }
    }
  }
}

/**
 * Download all episodes of a podcast feed to the target destination. 
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

  // check for directory and attempt to create if possible
  if(handleFeedDirectory(feedDirectory)) {
    console.log(`downloading ${safeFeedName} into ${feedDirectory}`);
  } else {
    console.error('could not find or create directory')
    return false
  }
  
  // 
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