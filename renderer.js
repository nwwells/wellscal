const messageElement = document.getElementById('messages');

window.electronAPI.onUpdateMessage((message) => {
    messageElement.innerText = message;
});

const versionElement = document.getElementById('version');
window.electronAPI.getAppVersion().then((arg) => {
    versionElement.innerText = 'v' + arg.version;
});
