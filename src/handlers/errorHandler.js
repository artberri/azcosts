/* eslint-disable no-console */

'use strict';

class ErrorHandler {
    raise(title, messages) {
        messages = messages || [];

        console.log('');
        console.log('  ' + title);
        console.log('');
        messages.forEach((item) => {
            console.log('  - ' + item);
        });
        console.log('  - Run `azcosts help get` for more help.');
        console.log('');
        process.exit(1);
    }
}


module.exports = new ErrorHandler();
