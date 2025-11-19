const messageElement = document.getElementById('messages');

window.electronAPI.onUpdateMessage((message) => {
    messageElement.innerText = message;
});
