import { extractMp3UrlFromObj } from "../handleFeed.js";
import { describe, it, expect } from "vitest";

describe("extractMp3UrlFromObj", () => {
  it('should extract mp3 url if it exists, return "" if not', () => {
    const sampleEpisode = {
      enclosure: {
        "@_url": "https://episode.com/mp3",
        "@_length": "62354128",
        "@_type": "audio/mpeg",
      },
    };

    const mp3Url = extractMp3UrlFromObj(sampleEpisode);
    expect(mp3Url).toEqual("https://episode.com/mp3");

    const noMp3Url = extractMp3UrlFromObj({});
    expect(noMp3Url).toEqual("");
  });
});
