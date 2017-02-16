const msRestAzure = require('ms-rest-azure');
const UsageManagementClient = require('azure-arm-commerce');

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
