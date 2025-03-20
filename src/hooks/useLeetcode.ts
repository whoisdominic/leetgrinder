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
