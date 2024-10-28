import { callFetch } from "../callFetch/callFetch.js";
import { XMLParser } from "fast-xml-parser";

/**
 * Fetches the feed at the url passed and returns the response body.
 *
 * @param {string} url
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
 * @param {*} xmlFeed
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
 * @param {*} feedObj
 * @returns
 */
export function extractTitleFromObj(feedObj) {
  return feedObj && feedObj.title ? feedObj.title : "";
}

/**
 * extracts feed image if present
 *
 * @param {*} feedObj
 * @returns
 */
export function extractImageUrlFromObj(feedObj) {
  // return feedObj && feedObj.image && feedObj.image.url ? feedObj.image.url : ""
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
 * @param {*} feedObj
 */
export function parseMp3UrlFromObj(feedObj) {
  return feedObj && feedObj.enclosure && feedObj.enclosure["@_url"]
    ? feedObj.enclosure["@_url"]
    : "";
}

/**
 * 
 */
export function parseEpisodeDescription(feedObj) {
  return feedObj && feedObj.description
    ? feedObj.description
    : "";
}

/**
 * Removes html tags from description
 * 
 * @param {*} desc 
 * @returns 
 */
export function sanitizeEpisodeDescription(desc) {
  if(!desc || typeof desc !== 'string') {
    return ""
  }

  return desc.replace(/<[^>]*>/g, '');
}

/**
 * 
 * @param {*} feedObj 
 * @returns 
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
 * 
 * @param {*} episode 
 * @param {*} defaultImage 
 * @returns 
 */
export function parseEpisodeData(episode, defaultImage) {
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
    title: title
  }
}

/**
 * 
 */
export function parseFeedData(feedJSON) {
  const title = extractTitleFromObj(feedJSON)
  const feedImage =  extractImageUrlFromObj(feedJSON)

  const episodes = feedJSON.item.map((episode) => {
    return parseEpisodeData(episode, feedImage)
  });

  return {
    title: title,
    feedImage: feedImage,
    episodes: episodes
  }
}
