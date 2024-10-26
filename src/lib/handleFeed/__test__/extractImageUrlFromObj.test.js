import {
  convertXMLFeedToObject,
  extractImageUrlFromObj,
} from "../handleFeed.js";
import { testHelperGetFullFilePath } from "../../__helpers__/testHelperGetFullFilePath.js";
import { describe, it, expect } from "vitest";
import fs from "node:fs";

describe("extractImageUrlFromObj", () => {
  it('should extract the image url safely if present, return " if not', () => {
    let fullFilePath = testHelperGetFullFilePath(
      "test_feed_destination_linux.xml"
    );
    let xmlContent = fs.readFileSync(fullFilePath, "utf8");
    let xmlAsObj = convertXMLFeedToObject(xmlContent);

    let imageURL = extractImageUrlFromObj(xmlAsObj);
    let knownImageUrl =
      "https://assets.fireside.fm/file/fireside-images-2024/podcasts/images/3/32f28071-0b08-4ea1-afcc-37af75bd83d6/cover.jpg";
    expect(imageURL).toEqual(knownImageUrl);

    // safe when no image present
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
        "@_href": "https://itunes.url/image.jpeg",
      },
    };

    imageURL = extractImageUrlFromObj(itunesObj);
    expect(imageURL).toEqual("https://itunes.url/image.jpeg");
  });
});
