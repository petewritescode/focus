const BLOCKABLE_PROTOCOLS = [ 'http:', 'https:' ];
const STATUS_BUTTON_ACTIVE_CLASS = 'status__button--active';

const enableButton = document.getElementById('enableButton');
const disableButton = document.getElementById('disableButton');
const blockButton = document.getElementById('blockButton');

const updateStatusButtons = () => {
    chrome.storage.local.get('enabled', ({ enabled }) => {
        enableButton.classList.remove(STATUS_BUTTON_ACTIVE_CLASS);
        disableButton.classList.remove(STATUS_BUTTON_ACTIVE_CLASS);

        if (enabled) {
            enableButton.classList.add(STATUS_BUTTON_ACTIVE_CLASS);
        } else {
            disableButton.classList.add(STATUS_BUTTON_ACTIVE_CLASS);
        }
    });
}

const updateBlockButton = () => {
    chrome.runtime.sendMessage({ message: 'getUrlDetails'}, ({ protocol, hostname }) => {
        if (BLOCKABLE_PROTOCOLS.includes(protocol)) {
            chrome.storage.sync.get('sites', ({ sites }) => {
                const blocked = sites.includes(hostname);

                blockButton.innerHTML = `${blocked ? 'Unblock' : 'Block'} ${hostname}`;
                blockButton.value = hostname;
                blockButton.removeAttribute('disabled');
            });
        }
    });
}

enableButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ message: 'enable' }, () => {
        updateStatusButtons();
    });
});

disableButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ message: 'disable' }, () => {
        updateStatusButtons();
    });
});

blockButton.addEventListener('click', () => {
    console.log('toggle block');
});

updateStatusButtons();
updateBlockButton();