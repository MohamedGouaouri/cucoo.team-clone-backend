

class Timer {
    constructor(value) {
        this.timer = value
        this.started = false

    }
    update() {
        const ss = this.timer.split(":");
        const dt = new Date();
        dt.setHours(ss[0]);
        dt.setMinutes(ss[1]);
        dt.setSeconds(ss[2]);

        const dt2 = new Date(dt.valueOf() - 1000);
        if (!dt2.getHours == 0 || !dt2.getMinutes == 0 || !dt2.getSeconds == 0) {
            const ts = dt2.toTimeString().split(" ")[0];
            this.timer = ts
        }
    }
}

module.exports = Timer