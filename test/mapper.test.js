'use strict';

let should = require('chai').should();
let rewire = require('rewire');
let mapper = rewire('../src/mapper.js');

describe('mapper.js', function() {
    let sampleMetric = {
        id: '/subscriptions/8d4abd5c-09ec-3456-aa23-ed7873828a23/providers/Microsoft.Commerce/UsageAggregates/Daily_BRSDT_20170101_0000',
        name: 'Daily_BRSDT_20170101_0000',
        type: 'Microsoft.Commerce/UsageAggregate',
        subscriptionId: '8d4abd5c-09ec-3456-aa23-ed7873828a23',
        meterId: '211e620c-ebcf-4db5-a7fd-996abebe9546',
        usageStartTime: new Date('2017-01-01T00:00:00.000Z'),
        usageEndTime: new Date('2017-01-02T00:00:00.000Z'),
        quantity: 0.6864,
        unit: '10,000s',
        meterName: 'Standard IO - Block Blob Write Operation Units (in 10,000s)',
        meterCategory: 'Data Management',
        infoFields: {},
        instanceData: '{"Microsoft.Resources":{"resourceUri":"/subscriptions/8d4abd5c-09ec-3456-aa23-ed7873828a23/resourceGroups/mygroup/providers/Microsoft.Storage/storageAccounts/myresource","location":"euwest","tags":{"displayName":"Storage Account"}}}'
    };

    let sampleMetric2 = {
        id: '/subscriptions/8d4abd5c-09ec-3456-aa23-ed7873828a23/providers/Microsoft.Commerce/UsageAggregates/Daily_BRSDT_20170101_0000',
        name: 'Daily_BRSDT_20170101_0000',
        type: 'Microsoft.Commerce/UsageAggregate',
        subscriptionId: '8d4abd5c-09ec-3456-aa23-ed7873828a23',
        meterId: '211e620c-ebcf-4db5-a7fd-545454545454',
        usageStartTime: new Date('2017-01-02T00:00:00.000Z'),
        usageEndTime: new Date('2017-01-03T00:00:00.000Z'),
        quantity: 0.6864,
        unit: '10,000s',
        meterName: 'Standard IO - Block Blob Write Operation Units (in 10,000s)',
        meterCategory: 'Data Management',
        infoFields: {},
        instanceData: '{"Microsoft.Resources":{}}'
    };

    let sampleRate = {
        '211e620c-ebcf-4db5-a7fd-996abebe9546': 0.5,
        '211e620c-ebcf-4db5-a7fd-545454545454': 2
    }

    let mappedMetrics = mapper([sampleMetric, sampleMetric2], sampleRate);

    it('should calculate the cost', function() {
        mappedMetrics[0].cost.should.equal(0.3432);
        mappedMetrics[1].cost.should.equal(1.3728);
    });

    it('should set the rate', function() {
        mappedMetrics[0].rate.should.equal(0.5);
        mappedMetrics[1].rate.should.equal(2);
    });

    it('should set the date', function() {
        mappedMetrics[0].day.toISOString().should.equal(new Date('2017-01-02T00:00:00.000Z').toISOString());
        mappedMetrics[1].day.toISOString().should.equal(new Date('2017-01-03T00:00:00.000Z').toISOString());
    });

    it('should set the resource ID', function() {
        mappedMetrics[0].resourceUri.should.equal('/subscriptions/8d4abd5c-09ec-3456-aa23-ed7873828a23/resourceGroups/mygroup/providers/Microsoft.Storage/storageAccounts/myresource');
        mappedMetrics[1].resourceUri.should.equal('others');
    });

    it('should set the location', function() {
        mappedMetrics[0].location.should.equal('euwest');
        should.not.exist(mappedMetrics[1].location);
    });

    it('should set the tags', function() {
        mappedMetrics[0].tags.should.eql({
            displayName: 'Storage Account'
        });
        should.not.exist(mappedMetrics[1].tags);
    });

    it('should set the resource group', function() {
        mappedMetrics[0].resourceGroup.should.equal('mygroup');
        mappedMetrics[1].resourceGroup.should.equal('');
    });

    it('should set the name', function() {
        mappedMetrics[0].name.should.equal('myresource');
        mappedMetrics[1].name.should.equal('Others');
    });

    it('should unset the id', function() {
        should.not.exist(mappedMetrics[0].id);
        should.not.exist(mappedMetrics[1].id);
    });

    it('should unset the type', function() {
        should.not.exist(mappedMetrics[0].type);
        should.not.exist(mappedMetrics[1].type);
    });

    it('should unset the meterId', function() {
        should.not.exist(mappedMetrics[0].meterId);
        should.not.exist(mappedMetrics[1].meterId);
    });

    it('should unset the usageStartTime', function() {
        should.not.exist(mappedMetrics[0].usageStartTime);
        should.not.exist(mappedMetrics[1].usageStartTime);
    });

    it('should unset the usageEndTime', function() {
        should.not.exist(mappedMetrics[0].usageEndTime);
        should.not.exist(mappedMetrics[1].usageEndTime);
    });

    it('should unset the instanceData', function() {
        should.not.exist(mappedMetrics[0].instanceData);
        should.not.exist(mappedMetrics[1].instanceData);
    });

    it('should unset the infoFields', function() {
        should.not.exist(mappedMetrics[0].infoFields);
        should.not.exist(mappedMetrics[1].infoFields);
    });
});
