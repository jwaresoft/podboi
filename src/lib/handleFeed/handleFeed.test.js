import { describe, vi, it, expect } from "vitest";
import { callFetch } from "../callFetch/callFetch.js";
import {
  fetchFeed,
  convertXMLFeedToObject,
  extractTitleFromObj,
  extractImageUrlFromObj,
  parseEpisodeDescription,
  sanitizeEpisodeDescription,
  parseDateFromEpisode,
  parseEpisodeData,
  parseFeedData,
} from "./handleFeed.js";
import {
  testCases,
  testCaseLoadFixtureFile,
  testCaseLoadJSONasObject,
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
        const sanitized = sanitizeEpisodeDescription(rawDescription);
        expect(sanitized).toEqual(testEpisode.description);

        // episode published date
        const pubDate = parseDateFromEpisode(episode);
        const testDataDate = new Date(testEpisode.date);
        expect(pubDate).toEqual(testDataDate);
      });
    });
  });
  describe("parseEpisodeData()", () => {
    it("should parse data when present from episode", () => {
      testCases.forEach((testCaseObj) => {
        const feedJSON = testCaseLoadJSONasObject(
          testCaseObj.jsonFixtureLocation
        );

        const parsedEpisode = parseEpisodeData(feedJSON.item[0], "", feedJSON.title);
        const latestEpisode = testCaseObj.testData.latestEpisode;

        expect(parsedEpisode.title).toEqual(latestEpisode.title);
        expect(parsedEpisode.date).toEqual(new Date(latestEpisode.date));
        expect(parsedEpisode.description).toEqual(latestEpisode.description);

        expect(parsedEpisode.mp3Url).toEqual(latestEpisode.mp3Url);
        expect(parsedEpisode.feedName).toEqual(feedJSON.title)
      });
    });
    it('should return the episode image when present, and the default if not', () => {
      const feedImage = "the feed image"
      const parsedEpisode = parseEpisodeData({}, feedImage);

      expect(parsedEpisode.image).toEqual(feedImage)
    })
    describe("parseFeedData()", () => {
      it("should parse feed data", () => {
        testCases.forEach((testCaseObj) => {
          const feedJSON = testCaseLoadJSONasObject(
            testCaseObj.jsonFixtureLocation
          );

          const parsedFeed = parseFeedData(feedJSON);
          const parsedFeedLatest = parsedFeed.episodes[0];
          const latestEpisode = testCaseObj.testData.latestEpisode;
          const latestEpisodeImage = testCaseObj.testData.latestEpisode.image
            ? testCaseObj.testData.latestEpisode.image
            : testCaseObj.testData.feedImage;

          // feed data
          expect(parsedFeed.title).toEqual(testCaseObj.testData.title)
          expect(parsedFeed.feedImage).toEqual(testCaseObj.testData.feedImage)


          expect(parsedFeedLatest.title).toEqual(latestEpisode.title);
          expect(parsedFeedLatest.date).toEqual(new Date(latestEpisode.date));
          expect(parsedFeedLatest.description).toEqual(
            latestEpisode.description
          );
          expect(parsedFeedLatest.image).toEqual(latestEpisodeImage);
          expect(parsedFeedLatest.mp3Url).toEqual(latestEpisode.mp3Url);
          expect(parsedFeedLatest.feedName).toEqual(parsedFeed.title);

        });
      });
    });
  });
});
