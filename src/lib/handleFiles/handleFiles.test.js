import { describe, vi, it, expect } from "vitest";
import {
  handleFileOpen,
  handlePlainTextFile,
  handleCSV,
  scrubOriginalFileName,
} from "./handleFiles";
import { readFileSync } from "node:fs";

vi.mock("node:fs", () => ({
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

describe("handleFiles.js", () => {
  describe("handleFileOpen()", () => {
    it("should return file txt if it exits", () => {
      vi.mocked(readFileSync).mockImplementation(() => {
        return "ok";
      });

      const text = handleFileOpen("/path/");
      expect(text).toBe("ok");
    });
    it("should return undefined and not throw if an issue arises", () => {
      vi.mocked(readFileSync).mockImplementation(() => {
        throw new Error("whoops!");
      });

      const text = handleFileOpen("/path/");
      expect(text).toBe(undefined);
    });
  });
  describe("handlePlainTextFile()", () => {
    it("should return an array where each value is each line of a txt file", () => {
      const mockTextFile = `One\nTwo\nThree`;
      vi.mocked(readFileSync).mockImplementation(() => {
        return mockTextFile;
      });

      const text = handlePlainTextFile("/path/to/textFile.txt");
      expect(text[0]).toEqual("One");
      expect(text[1]).toEqual("Two");
      expect(text[2]).toEqual("Three");
    });
  });
  describe("handleCSV()", () => {
    it("should return the first column of the csv only as an array", () => {
      const mockTextFile = `One,A\nTwo,B\nThree,C,D,E`;
      vi.mocked(readFileSync).mockImplementation(() => {
        return mockTextFile;
      });

      const text = handleCSV("/path/to/csv.csv");
      expect(text[0]).toEqual("One");
      expect(text[1]).toEqual("Two");
      expect(text[2]).toEqual("Three");

      text.forEach((element) => {
        expect(Array.isArray(element)).toBe(false);
      });
    });
  });
  describe('scrubOriginalFileName', () => {
    it('should remove unsafe characters /, *,\\ and others', () => {
      const badString = "hel****lo//\\/.txt**"
      const safe = scrubOriginalFileName(badString)
      expect(safe).toEqual('hello.txt')
    })
  })
});
