const ASYNC_SEND_RESPONSE_RETURN_VALUE = true;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ enabled: true });
    chrome.storage.sync.set({ sites: [] });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.message) {
        case 'enable':
        case 'disable':
            chrome.storage.local.set({ enabled: request.message === 'enable' }, () => {
                sendResponse(true);
            });
            return ASYNC_SEND_RESPONSE_RETURN_VALUE;
    }
});