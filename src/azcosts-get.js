const path = require('path');
const program = require('commander');
const nconf = require('nconf');
const errorHandler = require('./handlers/errorHandler');
const outputHandler = require('./handlers/outputHandler');
const getClient = require('./client');
const getRates = require('./rates');
const getUsage = require('./usage');
const mapper = require('./mapper');

// Parse args
program
    .version('0.0.1')
    .option('-c, --config <path>', 'Set config path. Defaults to ./azcosts.json')
    .option('-s, --startDate <date>', 'Sets the report start date. Format YYYY-MM-DD')
    .option('-e, --endDate <date>', 'Sets the report end date. Format YYYY-MM-DD')
    .option('-o, --output <date>', 'Comma separated list of output formats. Default: csv')
    .parse(process.argv);

if (!program.startDate || !program.endDate) {
    errorHandler.raise('You need to provide a date range.');
}

let validOutputs = ['csv'];
let outputs = program.output ? program.output.split(',') : [];
outputs.forEach((output) => {
    if (validOutputs.indexOf(output) === -1) {
        errorHandler.raise('You need to provide a valid output format: ' + validOutputs.join(', '));
    }
});
if (outputs.length === 0) {
    outputs.push('csv');
}

// Config file path
let configFile = program.config || path.resolve(process.cwd(), 'azcosts.json');

// Read environment variables and config file
nconf.env([
        'AZCOSTS_SUBSCRIPTION_ID',
        'AZCOSTS_CLIENT_ID',
        'AZCOSTS_CLIENT_SECRET',
        'AZCOSTS_TENANT_ID',
        'AZCOSTS_OFFER_ID',
        'AZCOSTS_REGION',
        'AZCOSTS_LOCALE',
        'AZCOSTS_CURRENCY'
    ]).file({
       file: configFile
    });

const rateConfig = {
    offer: nconf.get('AZCOSTS_OFFER_ID'),
    region: nconf.get('AZCOSTS_REGION'),
    locale: nconf.get('AZCOSTS_LOCALE'),
    currency: nconf.get('AZCOSTS_CURRENCY')
};

const authConfig = {
    subscription: nconf.get('AZCOSTS_SUBSCRIPTION_ID'),
    tenant: nconf.get('AZCOSTS_TENANT_ID'),
    client: nconf.get('AZCOSTS_CLIENT_ID'),
    secret: nconf.get('AZCOSTS_CLIENT_SECRET')
};

for(let propertyName in rateConfig) {
   if (typeof rateConfig[propertyName] !== 'string') {
       errorHandler.raise('You need to provide your Rating information.', [
           'Ensure that you have set them as environment variables or in your azcosts.json file.'
       ]);
   }
}

for(let propertyName in authConfig) {
   if (typeof authConfig[propertyName] !== 'string') {
       errorHandler.raise('You need to provide your Service Principal Authentication Credentials.', [
           'Follow this link to know how to create your credentials: https://github.com/Azure/azure-sdk-for-node/blob/master/Documentation/Authentication.md#service-principal-authentication'
       ]);
   }
}

getClient(authConfig).then((client) => {
    let usage = getUsage(client, program.startDate, program.endDate);
    let rates = getRates(client, rateConfig);

    return Promise.all([usage, rates]);
}).then(values => {
    let metrics = mapper(values[0], values[1]);

    outputHandler.handle(metrics, outputs);
}).catch((err) => {
    console.log(err);
    errorHandler.raise(err);
});
