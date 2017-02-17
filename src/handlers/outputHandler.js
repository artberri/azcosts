'use strict';

let csv = require('../outputs/csv');

class OutputHandler {
    constructor() {
        this.handlers = {
            csv
        }
    }

    handle(metrics, outputs) {
        outputs.forEach((output) => {
            let handler = this.handlers[output];

            handler(metrics);
        });
    }
}


module.exports = new OutputHandler();
