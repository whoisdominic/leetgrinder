import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import browser from "webextension-polyfill";
import { parseLeetCodeUrl } from "../utils";
import { useAppStore } from "../state";

export function useLeetcode({
  autoNavigate = false,
}: { autoNavigate?: boolean } = {}) {
  const {
    setIsLeetCode,
    isLeetCodeProblem,
    setIsLeetCodeProblem,
    setActiveProblem,
    setActiveProblemDifficulty,
    setActiveProblemType,
  } = useAppStore();

  const navigate = useNavigate();

  const getCurrentTab = async () => {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const currentTab = tabs[0];

    if (currentTab?.url) {
      const url = new URL(currentTab.url);
      const isLeetCode = url.hostname === "leetcode.com";
      setIsLeetCode(isLeetCode);
      setIsLeetCodeProblem(isLeetCode && url.pathname.includes("/problems/"));
      setActiveProblem(parseLeetCodeUrl(currentTab.url));

      if (isLeetCode && currentTab.id) {
        try {
          // Execute script in the active tab to get both difficulty and problem types
          const [{ result: pageInfo }] = await browser.scripting.executeScript({
            target: { tabId: currentTab.id },
            func: () => {
              const difficultyDiv = document.querySelector(
                'div[class*="text-difficulty-"]'
              );
              const difficulty = difficultyDiv?.textContent?.trim() || null;

              // Get all problem type tags
              const typeTags = Array.from(
                document.querySelectorAll("div.mt-2.flex.flex-wrap.gap-1 a")
              );
              const types = typeTags.map((tag) => {
                const text = (tag as HTMLElement).textContent?.trim() || "";
                // Convert to match your type format (e.g., "Dynamic Programming" -> "Dynamic")
                if (text === "Dynamic Programming") return "Dynamic";
                return text;
              });

              return { difficulty, types };
            },
          });

          if (
            pageInfo.difficulty &&
            ["Easy", "Medium", "Hard"].includes(pageInfo.difficulty)
          ) {
            setActiveProblemDifficulty(pageInfo.difficulty as any);
          } else {
            console.error("No valid difficulty found");
            setActiveProblemDifficulty(null);
          }

          if (pageInfo.types && pageInfo.types.length > 0) {
            setActiveProblemType(pageInfo.types);
          } else {
            console.error("No problem types found");
            setActiveProblemType([]);
          }
        } catch (error) {
          console.error("Error parsing page info:", error);
          if (error instanceof Error) {
            console.error("Error details:", {
              name: error.name,
              message: error.message,
              stack: error.stack,
            });
          }
          setActiveProblemDifficulty(null);
          setActiveProblemType([]);
        }
      } else {
        setActiveProblemDifficulty(null);
        setActiveProblemType([]);
      }
    }
  };

  const onTabChanged = async (
    _tabId: number,
    changeInfo: browser.Tabs.OnUpdatedChangeInfoType,
    tab: browser.Tabs.Tab
  ) => {
    // Only process complete page loads and active tabs
    if (changeInfo.status === "complete" && tab.active) {
      await getCurrentTab();
    }
  };

  const onTabActivated = async () => {
    await getCurrentTab();
  };

  useEffect(() => {
    getCurrentTab();

    // Set up a listener for tab changes
    browser.tabs.onUpdated.addListener(onTabChanged);
    // Also listen for tab activation changes
    browser.tabs.onActivated.addListener(onTabActivated);

    // Clean up listeners when component unmounts
    return () => {
      browser.tabs.onUpdated.removeListener(onTabChanged);
      browser.tabs.onActivated.removeListener(onTabActivated);
    };
  }, []);

  useEffect(() => {
    if (autoNavigate && isLeetCodeProblem) {
      navigate("/problem");
    }
  }, [isLeetCodeProblem, autoNavigate]);
}

export default useLeetcode;
