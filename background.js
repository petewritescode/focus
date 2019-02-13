chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ enabled: true });
    chrome.storage.sync.set({ sites: [] });
});