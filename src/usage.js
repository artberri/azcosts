'use strict';

function usage(client, startDate, endDate) {
    return new Promise((resolve, reject) => {
        let aggregates = [];

        let usageOptions = {
            showDetails: true,
            granularity: 'Daily'
        };

        client.usageAggregates.list(startDate, endDate, usageOptions, (err, result, request, response) => {
            if (err) {
                reject(err);
            } else {
                let loop = (nextLink) => {
                    if (typeof nextLink !== 'undefined' && nextLink) {
                        client.usageAggregates.listNext(nextLink, (err, res) => {
                            if (err) {
                                reject(err);
                            } else {
                                for (aggregate of res) {
                                    aggregates.push(aggregate);
                                }

                                loop(res.nextLink);
                            }
                        });
                    } else {
                        resolve(aggregates);
                    }
                };

                for (aggregate of result) {
                    aggregates.push(aggregate);
                }

                loop(result.nextLink);
            }
        });
    });
}

module.exports = usage;
