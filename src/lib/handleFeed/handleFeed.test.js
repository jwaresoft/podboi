import { fetchFeed } from "./handleFeed";
import { callFetch } from "../callFetch";
import { describe, vi, it, expect } from "vitest";

vi.mock("../callFetch.js", () => {
  return {
    callFetch: vi.fn()
  };
});


describe("handleFeed.js", () => {
  describe("fetchFeed()", () => {
    it("handles a successful request, returning response body via text()", async () => {
      const mockXML = "some xml"
      vi.mocked(callFetch).mockImplementation(() => {return {ok: true, text: () => {return mockXML}}})

      const data = await fetchFeed("");
      expect(data).toEqual(mockXML)
    });
    it('handles an unsuccessful request (500) by throwing', async () => {
      vi.mocked(callFetch).mockImplementation(() => {return {ok: false, status: 500}})

      // const value = await fetchFeed()
      // console.log(value)
      await expect(fetchFeed("")).rejects.toThrowError()
    })
  });
});
