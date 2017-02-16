#!/usr/bin/env node

const program = require('commander');

// Parse args
program
    .version('1.0.0')
    .command('init', 'Initialize Azcosts project. Creates an azcosts.json config file.')
    .command('get', 'Get Azure costs.')
    .parse(process.argv);
