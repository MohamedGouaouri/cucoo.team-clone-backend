
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { clearInterval } = require('timers');
const Timer = require('./timer');
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});



let timer = new Timer("00:25:00");
let interval

io.on("connection", (socket) => {
    console.log('a new coco connected');
    socket.on("start", () => {
        if (!timer.started) {
            interval = setInterval(() => {
                timer.started = true
                // Call the update function and send the time value
                timer.update()
                // TODO: Change this to room sockets
                io.sockets.emit("timer", {
                    success: true,
                    data: timer.timer,
                    error: null
                })
                console.log(timer.timer)

            }, 1000)
        } else {
            io.sockets.emit("timer", {
                success: false,
                data: null,
                error: "Timer already started"
            })
        }
    })
    socket.on("stop", () => {
        if (timer.started) {
            timer.started = false

            clearInterval(interval)
            // TODO: Change this to room sockets
            io.sockets.emit("timer", {
                success: true,
                data: timer.timer,
                error: null
            })
        } else {
            io.sockets.emit("timer", {
                success: false,
                data: null,
                error: "Timer already stopped"
            })
        }
    })
})

app.get("/", (req, res) => {
    res.send("API is running")
})

server.listen(3000, () => {
    console.log("Server is running")
})
