import { describe, vi, it, expect } from "vitest";
import { callFetch } from "../../callFetch/callFetch.js";
import { fetchFeed } from "../handleFeed.js";

vi.mock("../../callFetch/callFetch.js", () => {
  return {
    callFetch: vi.fn(),
  };
});

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
