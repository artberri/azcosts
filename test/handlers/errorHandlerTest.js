let sinon = require('sinon');
let rewire = require('rewire');
let errorHandler = rewire('../../src/handlers/errorHandler.js');

require('chai').should();

describe('errorHandler.js', function() {
    let exitMock;
    let logMock;

    beforeEach(function() {
        // Mock process.exit() function
        exitMock = sinon.spy();
        errorHandler.__set__('process', {
            exit: exitMock
        });

        // Mock console.log() function
        logMock = sinon.spy();
        errorHandler.__set__('console', {
            log: logMock
        });
    });

    describe('#raise()', function() {
        it('should stop the process with exit code 1', function() {
            errorHandler.raise('title');

            exitMock.calledWith(1).should.be.true;
        });

        it('should show the error message', function() {
            errorHandler.raise('title');

            logMock.calledWith('  title').should.be.true;
        });

        it('should show the common help message', function() {
            errorHandler.raise('title');

            logMock.calledWith('  - Run `azcosts help get` for more help.').should.be.true;
        });

        describe('when only title is passed', function() {
            it('shouldn\'t show an extra message if only title has been passed', function() {
                errorHandler.raise('title');

                logMock.callCount.should.equal(5);
            });
        });

        describe('when a single extra message is added', function() {
            it('shouldn\'t show an extra message if only title has been passed', function() {
                errorHandler.raise('title', [
                    'message1'
                ]);

                logMock.callCount.should.equal(6);
            });
        });

        describe('when multiple extra messages are added', function() {
            it('should show a an extra message if only title has been passed', function() {
                errorHandler.raise('title', [
                    'message1',
                    'message2',
                    'message3'
                ]);

                logMock.callCount.should.equal(8);
            });
        });
    });
});
