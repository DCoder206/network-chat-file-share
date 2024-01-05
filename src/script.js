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
    const nameInput = document.getElementById("nameInput").value;
    socket.emit("set username",nameInput);
}
function sendMessage() {
    const messageInput = document.getElementById("messageInput").value;
    socket.emit("chat message",messageInput);
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
