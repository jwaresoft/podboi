import fs from "node:fs";
import { testHelperGetFullFilePath } from "../../__helpers__/testHelperGetFullFilePath.js";
import { convertXMLFeedToObject, extractTitleFromObj } from "../handleFeed.js";

import { describe, it, expect } from "vitest";

describe("extractTitleFromObj()", () => {
  it("should extract title if present", () => {
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
      expect(extractTitleFromObj(xmlAsObj)).toBeDefined()
      expect(typeof extractTitleFromObj(xmlAsObj)).toBe('string')
      expect(extractTitleFromObj(xmlAsObj).length).toBeGreaterThan(0)
    });
  });
});
