import { describe, vi, it, expect } from "vitest";
import {
  handleFileOpen,
  handlePlainTextFile,
  handleCSV,
  scrubOriginalFileName,
} from "./handleFiles";
import { readFileSync } from "node:fs";
import path from "node:path";
import { tmpdir } from "os";

const tempDestination = path.join(tmpdir(), "podboi-test-files");

describe("handleFiles.js", () => {
  describe("handleFileOpen()", () => {
    it.only("should return file txt if it exits", () => {
      const testFile = path.join(tempDestination, 'feedFile.txt')
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
      const testFile = path.join(tempDestination, 'feedFile.txt')
      const text = handlePlainTextFile(testFile);

      expect(text[0]).toEqual("One");
      expect(text[1]).toEqual("Two");
      expect(text[2]).toEqual("Three");
    });
  });
  describe("handleCSV()", () => {
    it("should return the first column of the csv only as an array", () => {
      const testFile = path.join(tempDestination, 'feedFile.csv')
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
});
