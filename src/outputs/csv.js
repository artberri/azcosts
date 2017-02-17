/* eslint-disable no-console */

'use strict';

let json2csv = require('json2csv');
let path = require('path');
let fs = require('fs');

module.exports = (metrics) => {
    let resources = {};

    metrics.forEach((metric) => {
        let day = metric.day.toISOString().slice(0,10);

        if (typeof resources[metric.resourceUri] === 'undefined') {
            resources[metric.resourceUri] = {
                name: metric.name,
                location: metric.location,
                resourceGroup: metric.resourceGroup
            };

            for (let tag in metric.tags) {
                if (metric.tags.hasOwnProperty(tag) && tag.indexOf('hidden-related') !== 0) {
                    resources[metric.resourceUri][tag] = metric.tags[tag];
                }
            }
        }

        if (typeof resources[metric.resourceUri][day] === 'undefined') {
            resources[metric.resourceUri][day] = 0;
        }

        resources[metric.resourceUri][day] += metric.cost;
    });

    let items = [];

    for (let resource in resources) {
        if (resources.hasOwnProperty(resource)) {
            items.push(resources[resource]);
        }
    }

    try {
        var csv = json2csv({ data: items });

        fs.writeFile(path.resolve(process.cwd(), 'azcosts.csv'), csv, (err) => {
            if (err) throw err;
            console.log('file saved');
        });
    } catch (err) {
        // Errors are thrown for bad options, or if the data is empty and no fields are provided.
        // Be sure to provide fields if it is possible that your data array will be empty.
        console.error(err);
    }
};
