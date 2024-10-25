import { fetchFeed, convertXMLFeedToObject } from "./handleFeed";
import { callFetch } from "../callFetch/callFetch.js";
import { describe, vi, it, expect } from "vitest";
import fs  from 'node:fs'
import path from 'path'
import { fileURLToPath } from 'url';

vi.mock("../callFetch/callFetch.js", () => {
  return {
    callFetch: vi.fn()
  };
});


describe("handleFeed.js", () => {
  describe("fetchFeed()", () => {
    it("handles a successful request, returning response body via text()", async () => {
      const mockXML = "some xml"
      vi.mocked(callFetch).mockImplementation(() => {return {ok: true, text: () => {return mockXML}}})

      const data = await fetchFeed("");
      expect(data).toEqual(mockXML)
    });
    it('handles an unsuccessful request (500) by throwing', async () => {
      vi.mocked(callFetch).mockImplementation(() => {return {ok: false, status: 500}})

      await expect(fetchFeed("")).rejects.toThrowError()
    })
  });
  describe('convertXMLFeedToObject()', () => {
    it('should convert xml into a valid object, returning nested channel if present', () => {
      const sampleFiles = [
        'test_feed_destination_linux.xml',
        'test_feed_linux_for_everyone.xml',
        'test_feed_self_hosted.xml',
        'test_feed_this_week_in_linux.xml'
      ]

      // load a variety of xml files and make sure they turn into objects
      sampleFiles.forEach((fileName) => {
        const fileFullPath = fileURLToPath(import.meta.url);
        const pathToHere = path.dirname(fileFullPath)
        const feedLocation  = path.join(pathToHere, '__fixtures__/rssXML', fileName  )
        const xmlContent = fs.readFileSync(feedLocation, 'utf8')
        
        const xmlAsObj = convertXMLFeedToObject(xmlContent)
        expect(Object.keys(xmlAsObj).length).toBeGreaterThan(0)
      })
    })
    it('should return an empty object for undefined or an empty string', () => {
      const objFromEmptyString = convertXMLFeedToObject("")
      expect(objFromEmptyString).toEqual({})

      const objFromUndefined = convertXMLFeedToObject(undefined)
      expect(objFromUndefined).toEqual({})
    })
  })  
});
