import browser from "webextension-polyfill";

browser.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed:", details);
});

// Listen for tab updates and check if it's leetcode.com
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the URL is from leetcode.com
  if (changeInfo.url && changeInfo.url.includes("leetcode.com")) {
    // Open your extension - this will open the popup if you have one
    browser.action.openPopup();

    // You can also send a message to your content script if needed
    browser.tabs.sendMessage(tabId, {
      message: "on_leetcode",
    });
  }
});
