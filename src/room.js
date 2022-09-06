const {clearInterval} = require("timers");


class Room{
    constructor(roomId, roomName, timer, users, interval) {
        this.roomId = roomId;
        this.timer = timer;
        this.roomName = roomName;
        this.users = users;
        this.interval = interval
    }

    addUser(newUser) {
        this.users.push(newUser)
    }

    startTimer(){
        this.timer.started = true
        this.timer.update()
    }

    stopTimer(){
        this.timer.started = false
        clearInterval(this.interval)
    }

    getTime(){
        return this.timer.timer
    }

    isTimerStarted(){
        return this.timer.started
    }

}

module.exports = {
    Room
}