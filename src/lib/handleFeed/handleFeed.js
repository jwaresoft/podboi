import { callFetch } from "../callFetch.js";

/**
 * Fetches the feed at the url passed and returns the response body.
 *
 * @param {string} url
 */
export async function fetchFeed(url) {
  return new Promise(async (resolve, reject) => {
    try {
    const response = await callFetch(url);
    if (!response.ok) {
      reject(new Error(`Response status: ${response.status}`));
    }

    resolve(response.text());
  } catch (error) {
    reject(error.message);
  }
}) 
}

// const feed = await fetchFeed('http://feeds.libsyn.com/458346/rss')
// console.log(feed)

