import { callFetch } from "../callFetch/callFetch.js";
import { XMLParser } from "fast-xml-parser";

/**
 * Fetches the feed at the url passed and returns the response body.
 *
 * @param {string} url
 * @returns {string} 
 */
export async function fetchFeed(url) {
  try {
    const response = await callFetch(url);
    if (!response.ok) {
      return Promise.reject(new Error(`Response status: ${response.status}`));
    }

    return response.text();
  } catch (error) {
    console.error(error.message);
    return Promise.reject(error);
  }
}

/**
 * Convert xml rss / atom feed to a mess of json
 *
 * @param {string} xmlFeed
 * @returns {string} 
 */
export function convertXMLFeedToObject(xmlFeed) {
  if (!xmlFeed) {
    return {};
  }
  const options = {
    ignoreAttributes: false,
  };

  const parser = new XMLParser(options);
  const jsonObj = parser.parse(xmlFeed);

  return jsonObj.rss && jsonObj.rss.channel ? jsonObj.rss.channel : {};
}

/**
 * extracts feed title if present
 *
 * @param {string} xmlFeed
 * @returns {string} 
 */
export function extractTitleFromObj(feedObj) {
  return feedObj && feedObj.title ? feedObj.title : "";
}

/**
 * extracts feed image if present
 *
 * @param {Object} feedObj
 * @returns {string}
 */
export function extractImageUrlFromObj(feedObj) {
  let imageUrl = "";

  if (feedObj && feedObj.image && feedObj.image.url) {
    imageUrl = feedObj.image.url;
  } else if (
    feedObj &&
    feedObj["itunes:image"] &&
    feedObj["itunes:image"]["@_href"]
  ) {
    imageUrl = feedObj["itunes:image"]["@_href"];
  } else if (
    feedObj &&
    feedObj["podaccess:image"] &&
    feedObj["podaccess:image"]["#text"]
  ) {
    imageUrl = feedObj["podaccess:image"]["#text"];
  }

  return imageUrl;
}

/**
 * extracts mp3 url from episode object
 *
 * @param {Object} feedObj
 * @returns {string}
 */
export function parseMp3UrlFromObj(feedObj) {
  return feedObj && feedObj.enclosure && feedObj.enclosure["@_url"]
    ? feedObj.enclosure["@_url"]
    : "";
}

/**
 * parses the episode description as is, leaving embedded html
 * 
 * @param {Object} feedObj
 * @return {string}
 */
export function parseEpisodeDescription(feedObj) {
  return feedObj && feedObj.description
    ? feedObj.description
    : "";
}

/**
 * Removes html tags from description (or any other string if need be)
 * 
 * @param {string} desc 
 * @returns {string}
 */
export function sanitizeEpisodeDescription(desc) {
  if(!desc || typeof desc !== 'string') {
    return ""
  }

  return desc.replace(/<[^>]*>/g, '');
}

/**
 * parses date string and returns date object for published date
 * 
 * @param {Object} feedObj
 * @returns {Date}
 */
export function parseDateFromEpisode(feedObj) {
  const publishedDate = feedObj && feedObj.pubDate
    ? feedObj.pubDate
    : "";

    if(publishedDate) {
      return new Date(publishedDate)
    } 

    return undefined
}

/**
 * Parses episode image if it exists, returns passed default image if not.  Should pass feed image
 * in to handle defaults
 * 
 * @param {Object} episode 
 * @param {string} defaultImage 
 * @returns {string}
 */
export function parseEpisodeData(episode, defaultImage, safeFeedName) {
  const descriptionHtml = parseEpisodeDescription(episode) 
  // return values
  const dateObj = parseDateFromEpisode(episode)
  const description = sanitizeEpisodeDescription(descriptionHtml)
  const episodeImage = extractImageUrlFromObj(episode)
  const mp3Url = parseMp3UrlFromObj(episode)
  const title = extractTitleFromObj(episode)

  return {
    date: dateObj,
    description: description,
    image: episodeImage ? episodeImage : defaultImage,
    mp3Url: mp3Url,
    title: title,
    fallBackImage: defaultImage,
    feedName: safeFeedName
  }
}

/**
 * Calls all data extractors and returns feed info needed to download feed.  Should pass default
 * image if present.
 * 
 * @param {Object} feedJSON - feed as json
 * @returns {Object}
 *
 */
export function parseFeedData(feedJSON) {
  const title = extractTitleFromObj(feedJSON)
  const feedImage =  extractImageUrlFromObj(feedJSON)

  const episodes = feedJSON.item.map((episode) => {
    return parseEpisodeData(episode, feedImage, title)
  });

  return {
    title: title,
    feedImage: feedImage,
    episodes: episodes
  }
}

