/**
 * wrapper for calling fetch.  This is here to make mocking fetch less hellish.  It simply calls
 * fetch on the url provided, awaits, and returns the result.  Handle it with try/catch the same
 * way one would fetch.
 */
export async function callFetch(url) {
    const response = await fetch(url)
    return response
}