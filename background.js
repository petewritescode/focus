const ASYNC_SEND_RESPONSE_RETURN_VALUE = true;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ enabled: true });
    chrome.storage.sync.set({ sites: [] });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.message) {
        case 'getUrlDetails':
            chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
                const url = new URL(tabs[0].url);

                sendResponse({
                    protocol: url.protocol,
                    hostname: url.hostname,
                });
            });
            return ASYNC_SEND_RESPONSE_RETURN_VALUE;

        case 'enable':
        case 'disable':
            chrome.storage.local.set({ enabled: request.message === 'enable' }, () => {
                sendResponse(true);
            });
            return ASYNC_SEND_RESPONSE_RETURN_VALUE;

        case 'toggleBlock':
            chrome.storage.sync.get('sites', ({ sites }) => {
                const { hostname } = request;

                const newSites = sites.includes(hostname)
                    ? sites.filter((site) => site !== hostname)
                    : [ ...sites, hostname ];

                chrome.storage.sync.set({ sites: newSites }, () => {
                    sendResponse(true);
                })
            });
            return ASYNC_SEND_RESPONSE_RETURN_VALUE;
    }
});