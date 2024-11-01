import { describe, it, vi, expect } from "vitest";
import {
  handleFileOpen,
  handlePlainTextFile,
  handleCSV,
  scrubOriginalFileName,
  handleFeedDirectory,
  downloadFile,
} from "./handleFiles";
import path from "node:path";
import { tmpdir } from "os";
import { existsSync, statSync, createReadStream } from "node:fs";
import { callFetch } from "../callFetch/callFetch.js";
import { Readable } from "node:stream";

// mocked for download tests
vi.mock("../callFetch/callFetch.js", () => {
  return {
    callFetch: vi.fn(),
  };
});

// base directory for our test files
const tempDestination = path.join(tmpdir(), "podboi-test-files");

describe("handleFiles.js", () => {
  describe("handleFileOpen()", () => {
    it("should return file txt if it exits", () => {
      const testFile = path.join(tempDestination, "feedFile.txt");
      const text = handleFileOpen(testFile);
      expect(text).toBe(`One\nTwo\nThree`);
    });
    it("should return undefined and not throw if an issue arises", () => {
      const text = handleFileOpen("/path/nonFile.txt");
      expect(text).toBe(undefined);
    });
  });
  describe("handlePlainTextFile()", () => {
    it("should return an array where each value is each line of a txt file", () => {
      const testFile = path.join(tempDestination, "feedFile.txt");
      const text = handlePlainTextFile(testFile);

      expect(text[0]).toEqual("One");
      expect(text[1]).toEqual("Two");
      expect(text[2]).toEqual("Three");
    });
  });
  describe("handleCSV()", () => {
    it("should return the first column of the csv only as an array", () => {
      const testFile = path.join(tempDestination, "feedFile.csv");
      const text = handleCSV(testFile);

      expect(text[0]).toEqual("One");
      expect(text[1]).toEqual("Two");
      expect(text[2]).toEqual("Three");

      text.forEach((element) => {
        expect(Array.isArray(element)).toBe(false);
      });
    });
  });
  describe("scrubOriginalFileName()", () => {
    it("should remove unsafe characters /, *,\\ and others", () => {
      const badString = "hel****lo//\\/.txt**";
      const safe = scrubOriginalFileName(badString);
      expect(safe).toEqual("hello.txt");
    });
  });
  describe("handleFeedDirectory()", () => {
    it("should create a directory if it does not exist, return true if it already exists", () => {
      const candidateTestDir = path.join(tempDestination, "TESTCAST2020AD");
      expect(existsSync(candidateTestDir)).toBe(false);

      let returnValue = handleFeedDirectory(candidateTestDir);
      expect(existsSync(candidateTestDir)).toBe(true);
      expect(returnValue).toBe(true);

      // run again to verify it doesnt throw or complain
      returnValue = handleFeedDirectory(candidateTestDir);
      expect(returnValue).toBe(true);
    });
  });
  describe("downloadFile()", () => {
    it("should download a file from a buffer", async () => {
      const testFile = path.join(tempDestination, "groovy-ambient-funk.mp3");
      const testDownloadFile = path.join(
        tempDestination,
        "groovy-ambient-funk-DOWNLOAD.mp3"
      );

      let testStream = createReadStream(testFile, { encoding: "binary" });
      testStream = Readable.toWeb(testStream)

      vi.mocked(callFetch).mockImplementation(() => {
        return {
          ok: true,
          body: testStream
        };
      });

      expect(existsSync(testDownloadFile)).toBe(false)

      await downloadFile('', testDownloadFile)

      expect(existsSync(testDownloadFile)).toBe(true)
      const testFileStats = statSync(testFile)
      const testDownloadFileStats = statSync(testDownloadFile)

      expect(testFileStats.size).not.toEqual(testDownloadFileStats.size)
    });
  });
});
