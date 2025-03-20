/**
 * Parses a LeetCode URL to extract the problem name.
 *
 * @param url - The LeetCode URL to parse
 * @returns The extracted problem name or null if the URL is not a valid LeetCode problem URL
 *
 * @example
 * // Returns "daily-temperatures"
 * parseLeetCodeUrl("https://leetcode.com/problems/daily-temperatures/description/")
 *
 * @example
 * // Returns "daily-temperatures"
 * parseLeetCodeUrl("https://leetcode.com/problems/daily-temperatures/editorial/")
 */
export function parseLeetCodeUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);

    // Check if it's a LeetCode URL
    if (urlObj.hostname !== "leetcode.com") {
      return null;
    }

    // Check if it's a problem URL
    if (!urlObj.pathname.startsWith("/problems/")) {
      return null;
    }

    // Extract the problem name from the path
    const pathParts = urlObj.pathname.split("/").filter(Boolean);

    // The URL format should be /problems/problem-name/... (could include editorial, solution, description, etc.)
    if (pathParts.length >= 2 && pathParts[0] === "problems") {
      return pathParts[1];
    }

    return null;
  } catch (error) {
    // Return null if the URL is invalid
    return null;
  }
}

export function transformProblemName(problemName: string): string {
  return problemName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
