document.addEventListener("DOMContentLoaded", () => {
    const nameInput = document.querySelector("#nameInput");
    const setNameButton = document.querySelector("#setNameButton");
    nameInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            setNameButton.click();
        }
    });
})
document.addEventListener("DOMContentLoaded", () => {
    const messageInput = document.querySelector("#messageInput");
    const sendMessageButton = document.querySelector("#sendMessageButton");
    messageInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            sendMessageButton.click();
        }
    });
});
const socket = io();
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
