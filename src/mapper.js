module.exports = (usage, rates) => {

    usage.map(metric => {
        const re = /\/resourceGroups\/([a-zA-Z0-9_-]+)\//;

        let rate = rates[metric.meterId];
        let instanceData = metric.instanceData ? JSON.parse(metric.instanceData)['Microsoft.Resources'] : {};
        let segments = instanceData.resourceUri ? instanceData.resourceUri.split('/') : ['Others'];
        let matchs = instanceData.resourceUri ? re.exec(instanceData.resourceUri) : [];

        metric.rate = rate;
        metric.cost = rate * metric.quantity;
        metric.day = metric.usageEndTime;
        metric.resourceUri = instanceData.resourceUri ? instanceData.resourceUri : 'others';
        metric.location = instanceData.location;
        metric.tags = instanceData.tags;
        metric.resourceGroup = matchs && matchs[1] ? matchs[1] : '';
        metric.name = segments[segments.length - 1];

        delete metric.id;
        delete metric.type;
        delete metric.meterId;
        delete metric.usageStartTime;
        delete metric.usageEndTime;
        delete metric.instanceData;
        delete metric.infoFields;

        return metric;
    });

    return usage;
};
