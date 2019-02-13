const onButton = document.getElementById('onButton');
const offButton = document.getElementById('offButton');
const blockButton = document.getElementById('blockButton');

onButton.addEventListener('click', () => {
    console.log('enable');
});

offButton.addEventListener('click', () => {
    console.log('disable');
});

blockButton.addEventListener('click', () => {
    console.log('toggle block');
});