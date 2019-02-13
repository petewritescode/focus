const ASYNC_SEND_RESPONSE_RETURN_VALUE = true;

const ICONS_ENABLED = {
    '16': 'images/logo-16.png',
    '24': 'images/logo-24.png',
    '32': 'images/logo-32.png',
    '48': 'images/logo-48.png',
    '128': 'images/logo-128.png',
};

const ICONS_DISABLED = {
    '16': 'images/logo-inactive-16.png',
    '24': 'images/logo-inactive-24.png',
    '32': 'images/logo-inactive-32.png',
    '48': 'images/logo-inactive-48.png',
    '128': 'images/logo-inactive-128.png',
};

const updateBrowserActionIcon = () => {
    chrome.storage.local.get('enabled', ({ enabled }) => {
        chrome.browserAction.setIcon({ path: enabled ? ICONS_ENABLED : ICONS_DISABLED });
    });
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ enabled: true });
    chrome.storage.sync.set({ sites: [] });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.message) {
        case 'getUrlDetails':
            chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
                const { protocol, hostname } = new URL(tabs[0].url);

                sendResponse({
                    protocol,
                    hostname,
                });
            });
            return ASYNC_SEND_RESPONSE_RETURN_VALUE;

        case 'enable':
        case 'disable':
            chrome.storage.local.set({ enabled: request.message === 'enable' }, () => {
                updateBrowserActionIcon();
                sendResponse(true);
            });
            return ASYNC_SEND_RESPONSE_RETURN_VALUE;

        case 'toggleBlock':
            const { hostname } = request;

            chrome.storage.sync.get('sites', ({ sites }) => {
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

updateBrowserActionIcon();