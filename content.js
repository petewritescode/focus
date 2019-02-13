const showBlockMessage = () => {
    const iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('content.html');
    iframe.style.position = 'fixed';
    iframe.style.top = 0;
    iframe.style.left = 0;
    iframe.style.zIndex = 999999999;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 0;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.appendChild(iframe);
}

const checkUrl = () => {
    chrome.runtime.sendMessage({ message: 'getUrlDetails' }, ({ hostname }) => {
        chrome.storage.local.get('enabled', ({ enabled }) => {
            if (enabled) {
                chrome.storage.sync.get('sites', ({ sites }) => {
                    if (sites.includes(hostname)) {
                        showBlockMessage();
                    }
                });
            }
        });
    });
}

checkUrl();