// External imports
const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const cors = require("cors");
const path = require("path");
const app = express();
const connectDB = require("./config/db");
const http = require("http");

const { Server } = require("socket.io");
const { readFileSync, writeFileSync } = require("fs");

// raw server with express
const server = http.createServer(app);




app.use(express.static(path.join(__dirname, '')))

// connect raw server with socket io server-- server init
const io = new Server(server);









io.on("connection", (socket) => {
    console.log("a user connected");

    // receive data from client
    socket.on("chat", (data) => {
        let oldChat = JSON.parse(
            readFileSync(path.join(__dirname, "chat.json")).toString()
        );
        oldChat.push(data);
        writeFileSync(
            path.join(__dirname, "chat.json"),
            JSON.stringify(oldChat)
        );
    });

    let latestChat = JSON.parse(
        readFileSync(path.join(__dirname, "chat.json")).toString()
    );
    // send data all client
    io.sockets.emit("chat-msg", latestChat);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Mongodb connection
connectDB();

// Server listening
const port = process.env.PORT;
server.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`.bgGreen.black);
});
