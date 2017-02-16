let csv = require('../outputs/csv');

class OutputHandler {
    constructor() {
        this.handlers = {
            csv
        }
    }

    handle(metrics, outputs) {
        outputs.forEach((output) => {
            let handler = this.handlers[outputs];

            handler(metrics);
        });
    }
}


module.exports = new OutputHandler();
