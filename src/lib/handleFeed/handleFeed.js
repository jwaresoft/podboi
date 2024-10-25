import { callFetch } from "../callFetch/callFetch.js";
import { XMLParser } from 'fast-xml-parser';

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
 * 
 */
// export function parseFeed() {

// }


/**
 * Convert xml rss / atom feed to a mess of json 
 * 
 * @param {*} xmlFeed 
 */
export function convertXMLFeedToObject(xmlFeed) {
  if(!xmlFeed) {
    return {}
  }
  const options = {
    ignoreAttributes : false
  };

  const parser = new XMLParser(options);
  const jsonObj = parser.parse(xmlFeed);

  return jsonObj.rss && jsonObj.rss.channel ? jsonObj.rss.channel : {}
}

/**
 * extracts feed title if present
 * 
 * @param {*} feedObj 
 * @returns 
 */
export function extractTitleFromObj(feedObj) {
  return feedObj && feedObj.title ? feedObj.title : ""
}

/**
 * extracts feed image if present
 * 
 * @param {*} feedObj 
 * @returns 
 */
export function extractImageUrlFromObj(feedObj) {
  // return feedObj && feedObj.image && feedObj.image.url ? feedObj.image.url : ""
  let imageUrl = ""
  
  if(feedObj && feedObj.image && feedObj.image.url) {
    imageUrl = feedObj.image.url
  } else if (feedObj && feedObj['itunes:image'] && feedObj['itunes:image']['@_href']) {
    imageUrl = feedObj['itunes:image']['@_href']
  } else if (feedObj && feedObj['podaccess:image'] && feedObj['podaccess:image']['#text']) {
    imageUrl = feedObj['podaccess:image']['#text']
  }

  return imageUrl
}
