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