'use strict';

function rates(client, config) {
    return new Promise((resolve, reject) => {
        client.rateCard.get({
            filter: "OfferDurableId eq '" + config.offer +
                    "' and Currency eq '" + config.currency +
                    "' and Locale eq '" + config.locale +
                    "' and RegionInfo eq '" + config.region +
                    "'"
        }, (err, result) => {
            if (err) {
                reject(err);

                return;
            }

            let offers = {};

            result.meters.forEach(meter => {
                offers[meter.meterId] = meter.meterRates['0'];
            });

            resolve(offers);
        });
    });
}

module.exports = rates;
