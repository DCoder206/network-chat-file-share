const socket = io();
const port = 9000;
const fileInput = document.getElementById("fileInput");
socket.on("file received",(fileInfo) => {
    const messagesDiv = document.getElementById("messages");
    const downloadLink = document.createElement("a");
    downloadLink.href = fileInfo.url;
    downloadLink.download = fileInfo.name;
    downloadLink.textContent = `Download File: ${fileInfo.name}`;
    messagesDiv.appendChild(downloadLink);
})
function sendFile() {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const fileInfo = { name: file.name, content: event.target.result };
            socket.emit("file shared", fileInfo);
        };
        reader.readAsDataURL(file);
    }
    else {
        console.error("No file selected");
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const nameInput = document.querySelector("#nameInput");
    const setNameButton = document.querySelector("#setNameButton");
    nameInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            setNameButton.click();
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const messageInput = document.querySelector("#messageInput");
    const sendMessageButton = document.querySelector("#sendMessageButton");
    messageInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            sendMessageButton.click();
        }
    });
});
const capitalize = (str) => { return str.substring(0,1).toUpperCase() + str.substring(1).toLowerCase() }
let userName = "";
function setUsername() {
    const nameInput = document.getElementById("nameInput");
    userName = capitalize(nameInput.value);
    nameInput.disabled = true;
    socket.emit("set username",userName);
}
function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    if (messageInput.value.length > 0 && userName.length > 0) {
        socket.emit("chat message",messageInput.value);
        messageInput.value = "";
    }
    else {
        let msg = "";
        if (userName.length === 0) {
            msg = "Username cannot be blank"
        }
        else if (message.length === 0) {
            msg = "Message cannot be empty"
        }
        console.warn(msg);
        alert(msg);
    }
}
function showMessage(message) {
    const messagesDiv = document.getElementById("messages");
    const p = document.createElement("p");
    p.textContent = message;
    messagesDiv.appendChild(p);
}
socket.on("chat message",(msg) => {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML += `<p>${msg}</p>`;
})
