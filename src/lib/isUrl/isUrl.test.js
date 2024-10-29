import { describe, vi, it, expect } from "vitest";
import { isUrl } from "./isUrl";

describe('isUrl.js', () => {
    it('should return true for valid urls', () => {
        expect(isUrl("http://www.poop.com")).toBe(true)
        expect(isUrl("https://www.poop.com")).toBe(true)
    })
    it('should return false for invalid url', () => {
        expect(isUrl("helloooo")).toBe(false)
        expect(isUrl("/home/user/file.txt")).toBe(false)
    })
})