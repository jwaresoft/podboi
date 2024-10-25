import {
  fetchFeed,
  convertXMLFeedToObject,
  extractFeedTitleFromObj,
  extractImageUrlFromObj,
} from "./handleFeed.js";
import { callFetch } from "../callFetch/callFetch.js";
import { describe, vi, it, expect } from "vitest";
import fs from "node:fs";
import { testHelperGetFullFilePath } from "./__helpers__/testHelperGetFullFilePath.js";

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
    it("should convert xml into a valid object, returning nested channel if present", () => {
      const sampleFiles = [
        "test_feed_destination_linux.xml",
        "test_feed_linux_for_everyone.xml",
        "test_feed_self_hosted.xml",
        "test_feed_this_week_in_linux.xml",
      ];

      // load a variety of xml files and make sure they turn into objects
      sampleFiles.forEach((fileName) => {
        const fullFilePath = testHelperGetFullFilePath(fileName);
        const xmlContent = fs.readFileSync(fullFilePath, "utf8");

        const xmlAsObj = convertXMLFeedToObject(xmlContent);
        expect(Object.keys(xmlAsObj).length).toBeGreaterThan(0);
      });
    });
    it("should return an empty object for undefined or an empty string", () => {
      const objFromEmptyString = convertXMLFeedToObject("");
      expect(objFromEmptyString).toEqual({});

      const objFromUndefined = convertXMLFeedToObject(undefined);
      expect(objFromUndefined).toEqual({});
    });
  });
  describe("extractFeedTitleFromObj", () => {
    it('should extract the title safely if present, return " if not', () => {
      let fullFilePath = testHelperGetFullFilePath(
        "test_feed_destination_linux.xml"
      );
      let xmlContent = fs.readFileSync(fullFilePath, "utf8");
      let xmlAsObj = convertXMLFeedToObject(xmlContent);

      let title = extractFeedTitleFromObj(xmlAsObj);
      expect(title).toEqual("Destination Linux");

      fullFilePath = testHelperGetFullFilePath("test_feed_self_hosted.xml");
      xmlContent = fs.readFileSync(fullFilePath, "utf8");
      xmlAsObj = convertXMLFeedToObject(xmlContent);

      title = extractFeedTitleFromObj(xmlAsObj);
      expect(title).toEqual("Self-Hosted");

      // safe when no title present
      xmlAsObj = convertXMLFeedToObject("");

      title = extractFeedTitleFromObj(xmlAsObj);
      expect(title).toEqual("");
    });
  });
  describe("extractFeedImageUrlFromObj", () => {
    it('should extract the image url safely if present, return " if not', () => {
      let fullFilePath = testHelperGetFullFilePath(
        "test_feed_destination_linux.xml"
      );
      let xmlContent = fs.readFileSync(fullFilePath, "utf8");
      let xmlAsObj = convertXMLFeedToObject(xmlContent);

      console.log(xmlAsObj.image);

      let imageURL = extractImageUrlFromObj(xmlAsObj);
      let knownImageUrl =
        "https://assets.fireside.fm/file/fireside-images-2024/podcasts/images/3/32f28071-0b08-4ea1-afcc-37af75bd83d6/cover.jpg";
      expect(imageURL).toEqual(knownImageUrl);

      // safe when no title present
      xmlAsObj = convertXMLFeedToObject("");
      imageURL = extractImageUrlFromObj(xmlAsObj);
      expect(imageURL).toEqual("");

      // test podaccess methods
      const podaccessObj = {
        "podaccess:image": {
          "#text": "https://example.url/image.jpeg",
        },
      };

      imageURL = extractImageUrlFromObj(podaccessObj);
      expect(imageURL).toEqual("https://example.url/image.jpeg");

      // testItunes
      const itunesObj = {
        "itunes:image": {
          "@_href":
            "https://itunes.url/image.jpeg",
        },
      };

      imageURL = extractImageUrlFromObj(itunesObj);
      expect(imageURL).toEqual("https://itunes.url/image.jpeg");
    });
  });
});
