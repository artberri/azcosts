'use strict';

let msRestAzure = require('ms-rest-azure');
let UsageManagementClient = require('azure-arm-commerce');

module.exports = (authConfig) => {
    return new Promise((resolve, reject) => {
        msRestAzure.loginWithServicePrincipalSecret(
            authConfig.client,
            authConfig.secret,
            authConfig.tenant,
            (err, credentials) => {
                if (err) {
                    reject(err);
                }

                resolve(new UsageManagementClient(credentials, authConfig.subscription));
            }
        );
    });
}
