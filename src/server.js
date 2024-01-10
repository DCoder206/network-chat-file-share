import { networkInterfaces } from "os";
import express from "express";
import { createServer } from "http";
import { Server as socketIO } from "socket.io";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
function IP() {
    const interfaces = networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const net of interfaces[name]) {
            if (net.family === "IPv4" && !net.internal) {
                return net.address;
            }
        }
    }
}
const bold = (str) => {
    return `<b>${str}</b>`;
}
const app = express();
const server = createServer(app);
const io = new socketIO(server);
const port = 9000;
app.use(express.static(path.dirname(fileURLToPath(import.meta.url))));
app.use("/files",express.static("files"));
let userCount = 0,fileSaved = false;
io.on("connection",(socket) => {
    console.log("User connected");
    userCount++;
    socket.on("set username",(username) => {
        socket.username = username;
        console.log(`${username} joined`);
        io.emit("chat message",`${bold("• " + username)} joined`);
    })
    socket.on("chat message",(msg) => {
        io.emit("chat message",`${bold(socket.username)}: ${msg}`);
    })
    socket.on("disconnect",() => {
        io.emit("chat message",`${bold("• " + socket.username)} left`);
        console.log(`${socket.username} disconnected`);
        userCount--;
        if (userCount === 0 && fileSaved) {
            const filePath = `./files`;
            fs.readdir(filePath, (err,files) => {
                if (err) { throw err };
                for (const file of files) {
                    fs.unlink(path.join(filePath,file), err => {
                        if (err) { throw err };
                    });
                }
            });
        }
    })
    socket.on("file shared",(file) => {
        const filePath = `./files/${file.name}`;
        fs.writeFile(filePath,file.content,"base64",(err) => {
            if (err) {
                console.error("Error saving file");
                return
            }
            console.log(`File saved as ${file.name}`);
            const fileUrl = `http://${IP()}:${port}/files/${file.name}`;
            io.emit("file received", {name: file.name, url: fileUrl});
        })
        fileSaved = true;
    })
})
server.listen(port,() => {
    console.log(`Server running on http://${IP()}:${port}`);
})
