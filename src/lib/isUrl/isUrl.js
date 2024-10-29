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
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    return false;
  }
}
