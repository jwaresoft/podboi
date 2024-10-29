const url = require("url");

/**
 * checks if a url is in fact a url
 * 
 * @param {string} string 
 * @returns {boolean}
 */
export function isUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}
