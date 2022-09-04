

class Timer {
    constructor(value) {
        this.timer = value
        this.started = false

    }
    update() {
        var ss = this.timer.split(":");
        var dt = new Date();
        dt.setHours(ss[0]);
        dt.setMinutes(ss[1]);
        dt.setSeconds(ss[2]);

        var dt2 = new Date(dt.valueOf() - 1000);
        if (!dt2.getHours == 0 || !dt2.getMinutes == 0 || !dt2.getSeconds == 0) {
            var ts = dt2.toTimeString().split(" ")[0];
            this.timer = ts
        }
    }
}

module.exports = Timer