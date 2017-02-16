const path = require('path');
const fs = require('fs');
const program = require('commander');
const inquirer = require('inquirer');

let ui = new inquirer.ui.BottomBar();

// Parse args
program
    .parse(process.argv);

// Initial message
ui.log.write('');
ui.log.write('You need to provide your Azure Subscription data in order to allow Azcosts to get the usage.');
ui.log.write('');
ui.log.write('- Follow this link to know how to create your credentials:');
ui.log.write('  https://github.com/Azure/azure-sdk-for-node/blob/master/Documentation/Authentication.md#service-principal-authentication');
ui.log.write('- The Offer ID can be get from the subscription information in the Azure Portal.');
ui.log.write('  The format of the offer ID is MS-AZR-XXXXX, where XXXXX is your offer Number.');
ui.log.write('  A list of offer numbers can be found here:');
ui.log.write('  https://azure.microsoft.com/en-us/support/legal/offer-details/');
ui.log.write('- The Region needs to be a 2 letter code. More info:');
ui.log.write('  https://account.windowsazure.com/Profile');
ui.log.write('- The Locale option should follow the language-culture format. More info:');
ui.log.write('  https://msdn.microsoft.com/en-us/library/ee825488(v=cs.20).aspx');
ui.log.write('');

let validateEmptyString = (input) => {
    if (typeof input === 'string' && input.length > 0) {
        return true;
    }

    return 'This field is mandatory.';
};

inquirer.prompt([
    {
        type: 'input',
        name: 'AZCOSTS_SUBSCRIPTION_ID',
        message: 'What is your Azure Subscription ID?',
        validate: validateEmptyString
    },
    {
        type: 'input',
        name: 'AZCOSTS_CLIENT_ID',
        message: 'What is your Service Principal App ID?',
        validate: validateEmptyString
    },
    {
        type: 'password',
        name: 'AZCOSTS_CLIENT_SECRET',
        message: 'What is your Service Principal App Key?',
        validate: validateEmptyString
    },
    {
        type: 'input',
        name: 'AZCOSTS_TENANT_ID',
        message: 'What is your AD Directory ID (Tenant ID)?',
        validate: validateEmptyString
    },
    {
        type: 'input',
        name: 'AZCOSTS_OFFER_ID',
        message: 'What is your Offer Durable ID?',
        validate: (input) => {
            if (typeof input === 'string' && input.indexOf('MS-AZR-') === 0) {
                return true;
            }

            return 'The Offer ID format is MS-AZR-XXXXX';
        }       
    },
    {
        type: 'input',
        name: 'AZCOSTS_REGION',
        message: 'What is your Region?',
        default: 'GB',
        validate: (input) => {
            if (typeof input === 'string' && input.length === 2) {
                return true;
            }

            return 'The region code must be a 2 character string';
        }
    },
    {
        type: 'input',
        name: 'AZCOSTS_LOCALE',
        message: 'What is your Locale?',
        default: 'en-GB',
        validate: validateEmptyString
    },
    {
        type: 'input',
        name: 'AZCOSTS_CURRENCY',
        message: 'What is your Currency?',
        default: 'GBP',
        validate: (input) => {
            if (typeof input === 'string' && input.length === 3) {
                return true;
            }

            return 'The language code must be a 3 character string';
        }
    },
    {
        type: 'input',
        name: 'path',
        message: 'File path where the options will be saved.',
        default: path.resolve(process.cwd(), 'azcosts.json'),
        validate: validateEmptyString
    },
    {
        type: 'confirm',
        name: 'confirmed',
        message: (answers) => {
            return 'These settings will be saved in the ' + answers.path + ' file (it could be overrided). Do you want to continue?';
        },
        default: false,
        validate: validateEmptyString
    }
]).then(function (answers) {
    if (answers.confirmed) {
        let path = answers.path;

        delete answers.confirmed;
        delete answers.path;

        let text = JSON.stringify(answers, null, '\t');

        fs.writeFile(path, text, (err) => {
            if (err) {
                ui.log.write('');
                ui.log.write('Error creating config file!');
            } else {
                ui.log.write('');
                ui.log.write('Config file successfully created!');
            }
        });

    } else {
        ui.log.write('');
        ui.log.write('Config file creation aborted!');
    }
});
