import { describe, it, vi, expect } from "vitest";
import path from "node:path";
import { tmpdir } from "os";
import { tagPodcastEpisode } from "./tagFile";
import { parseFile } from 'music-metadata';

vi.mock("../handleFiles/handleFiles.js", () => {
  return {
    downloadFileToMemory: vi.fn(),
  };
});

describe("tagFile()", () => {
  it("should add tags to an mp3 file", async () => {
    const tempTagFile = path.join(
        tmpdir(),
        "podboi-test-files",
        "groovy-ambient-funk-2tag.mp3"
      );
    
      const episode = {
        title: "TITLE",
        feedName: "FEEDNAME",
        description: "DESCRIPTION",
        date: new Date()
    };

    const year = episode.date.getFullYear();

    let fileTags = await parseFile(tempTagFile);

    expect(fileTags.common.title).toBe(undefined)
    expect(fileTags.common.artist).toBe(undefined)
    expect(fileTags.common.comment).toBe(undefined)
    expect(fileTags.common.year).toBe(undefined)

    tagPodcastEpisode(tempTagFile, episode);

    fileTags = await parseFile(tempTagFile);
    expect(fileTags.common.title).toEqual(episode.title)
    expect(fileTags.common.artist).toEqual(episode.feedName)
    expect(fileTags.common.comment[0].text).toEqual(episode.description)
    expect(fileTags.common.year).toEqual(year)
  });
});
