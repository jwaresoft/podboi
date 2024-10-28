import { describe, vi, it, expect } from "vitest";
import { callFetch } from "../callFetch/callFetch.js";
import {
  fetchFeed,
  convertXMLFeedToObject,
  extractTitleFromObj,
  extractImageUrlFromObj,
  parseEpisodeDescription,
  sanatizeEpisodeDescription,
  parseDateFromEpisode,
} from "./handleFeed.js";
import {
  testCases,
  testCaseLoadFixtureFile,
} from "../__fixtures__/testCases.js";

vi.mock("../callFetch/callFetch.js", () => {
  return {
    callFetch: vi.fn(),
  };
});

describe("handleFeed.js", () => {
  describe("fetchFeed()", () => {
    it("handles a successful request, returning response body via text()", async () => {
      const mockXML = "some xml";
      vi.mocked(callFetch).mockImplementation(() => {
        return {
          ok: true,
          text: () => {
            return mockXML;
          },
        };
      });

      const data = await fetchFeed("");
      expect(data).toEqual(mockXML);
    });
    it("handles an unsuccessful request (500) by throwing", async () => {
      vi.mocked(callFetch).mockImplementation(() => {
        return { ok: false, status: 500 };
      });

      await expect(fetchFeed("")).rejects.toThrowError();
    });
  });
  describe("convertXMLFeedToObject()", () => {
    it("should convert an xml feed to a javascript object", () => {
      testCases.forEach((testCaseObj) => {
        const testCaseXML = testCaseLoadFixtureFile(
          testCaseObj.xmlFixtureLocation
        );
        const feedObject = convertXMLFeedToObject(testCaseXML);
        expect(feedObject.title).toEqual(testCaseObj.testData.title);
      });
    });
    it("should return an empty object if passed nully values", () => {
      expect(convertXMLFeedToObject("")).toEqual({});
      expect(convertXMLFeedToObject(undefined)).toEqual({});
      expect(convertXMLFeedToObject(NaN)).toEqual({});
    });
  });
  describe("extractor functions", () => {
    it("should return the correct value for each extractor", () => {
      testCases.forEach((testCaseObj) => {
        const testCaseXML = testCaseLoadFixtureFile(
          testCaseObj.xmlFixtureLocation
        );
        const feedObject = convertXMLFeedToObject(testCaseXML);

        // feed title
        const feedTitle = extractTitleFromObj(feedObject);
        expect(feedTitle).toEqual(testCaseObj.testData.title);

        // feed image, we will use this as a fallback for episodes without images
        const feedImageUrl = extractImageUrlFromObj(feedObject);
        expect(feedImageUrl).toEqual(testCaseObj.testData.feedImage);

        // episode specific extractors
        const testEpisode = testCaseObj.testData.latestEpisode;
        const episode = feedObject.item[0];

        // episode image url
        const episodeImage = extractImageUrlFromObj(episode);
        expect(episodeImage).toEqual(testEpisode.image || "");

        // this testing is weird as the unsanitized descriptions came out poorly for the test cases.
        const rawDescription = parseEpisodeDescription(episode);
        expect(rawDescription.length).toBeGreaterThan(0);
        const sanitized = sanatizeEpisodeDescription(rawDescription);
        expect(sanitized).toEqual(testEpisode.description);

        // episode published date
        const pubDate = parseDateFromEpisode(episode);
        const testDataDate = new Date(testEpisode.date);
        expect(pubDate).toEqual(testDataDate);
      });
    });
  });
});
