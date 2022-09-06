
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { clearInterval } = require('timers');
const Timer = require('./timer');
const {Room} = require('./room');

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});
const cors = require("cors")
const bodyParser = require("body-parser")
const randomstring = require("randomstring");


app.use(cors())

// Parse data as json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())



let rooms = {}

io.on("connection", (socket) => {

    socket.on("join", (roomId, userId) => {
        // Add socket to the room
        let room = rooms[roomId]
        if (room){
            console.log(room)
            room.addUser(userId)
            socket.join(roomId)
        }

    })

    socket.on("start", (roomId) => {
        let room = rooms[roomId]
        if (room){
            if (!room.isTimerStarted()) {

                room.interval = setInterval(() => {
                    room.startTimer()
                    io.to(roomId).emit("timer", {
                        success: true,
                        data: room.getTime(),
                        error: null
                    })
                    console.log("[" + roomId + "]" + " " + room.getTime())
                }, 1000)
            } else {
                io.to(roomId).emit("timer", {
                    success: false,
                    data: null,
                    error: "Timer already started"
                })
            }

        }else{
            socket.emit("error", "room does not exist")
        }
    })
    socket.on("stop", (roomId) => {
        let room = rooms[roomId]
        if (room){
            if (room.isTimerStarted()) {
                room.stopTimer()
                io.to(roomId).emit("timer", {
                    success: true,
                    data: room.getTime(),
                    error: null
                })

            } else {
                io.to(roomId).emit("timer", {
                    success: false,
                    data: null,
                    error: "Timer already stopped"
                })
            }
        }else {
            socket.emit("error", "room does not exist")
        }

    })
})

app.get("/", (req, res) => {
    res.send("API is running")
})


app.get("/create", (req ,res) => {
    let data = req.body

    let newRoom = new Room(
        randomstring.generate(),
        data.room_name,
        new Timer(data.timer),
        []
    )



    rooms[newRoom.roomId] = newRoom

    return res.json({
        success: true,
        data: {
            room_id: newRoom.roomId
        },
        error: null
    })

})


app.get("/rooms", (req, res) => {
    return res.json({
        success: true,
        data: Object.values(rooms),
        error: null
    })
})

app.get("/srooms", (req, res) => {
    return res.json(io.sockets.adapter.rooms)
})

server.listen(3000, () => {
    console.log("Server is running")
})
