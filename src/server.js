import { networkInterfaces } from "os";
import express from "express";
import { createServer } from "http";
import { Server as socketIO } from "socket.io";
import { fileURLToPath } from "url";
import path from "path";
function IP() {
    const interfaces = networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const net of interfaces[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
}
const app = express();
const server = createServer(app);
const io = new socketIO(server);
const port = 9000;
app.use(express.static(path.dirname(fileURLToPath(import.meta.url))));
io.on("connection",(socket) => {
    console.log("User connected");
    socket.on("set username",(username) => {
        socket.username = username;
        console.log(`${username} joined`);
        io.emit("chat message",`<strong>• ${username}</strong> joined`);
    })
    socket.on("chat message",(msg) => {
        io.emit("chat message",`<strong>${socket.username}:</strong> ${msg}`);
    })
    socket.on("disconnect",() => {
        io.emit("chat message",`${socket.username} left`);
        console.log(`${socket.username} disconnected`);
    })
})
server.listen(port,() => {
    console.log(`Server running on http://${IP()}:${port}`);
})
