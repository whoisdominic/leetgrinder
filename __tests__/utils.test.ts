import { parseLeetCodeUrl } from "../src/utils/parsers";

describe("parseLeetCodeUrl", () => {
  it("should extract problem name from a valid LeetCode problem URL", () => {
    expect(
      parseLeetCodeUrl(
        "https://leetcode.com/problems/daily-temperatures/description/"
      )
    ).toBe("daily-temperatures");
    expect(
      parseLeetCodeUrl("https://leetcode.com/problems/two-sum/editorial/")
    ).toBe("two-sum");
    expect(
      parseLeetCodeUrl("https://leetcode.com/problems/merge-intervals/")
    ).toBe("merge-intervals");
    expect(parseLeetCodeUrl("https://leetcode.com/problems/subsets-ii/")).toBe(
      "subsets-II"
    );
  });

  it("should return null for non-LeetCode URLs", () => {
    expect(parseLeetCodeUrl("https://google.com")).toBeNull();
    expect(parseLeetCodeUrl("https://github.com/problems/test")).toBeNull();
  });

  it("should return null for LeetCode URLs that are not problem pages", () => {
    expect(parseLeetCodeUrl("https://leetcode.com/explore/")).toBeNull();
    expect(parseLeetCodeUrl("https://leetcode.com/contest/")).toBeNull();
    expect(parseLeetCodeUrl("https://leetcode.com/")).toBeNull();
  });

  it("should handle invalid URLs gracefully", () => {
    expect(parseLeetCodeUrl("not-a-url")).toBeNull();
    expect(parseLeetCodeUrl("")).toBeNull();
  });
});
