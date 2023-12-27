import { TimedAudioBufferSourceNodeAudioWorkletProcessor } from '../../src/timed-audio-buffer-source-node-audio-worklet-processor';

describe('TimedAudioBufferSourceNodeAudioWorkletProcessor', () => {
    describe('constructor()', () => {
        let options;

        beforeEach(() => {
            options = {
                numberOfInputs: 1,
                numberOfOutputs: 1,
                outputChannelCount: [1],
                processorOptions: {
                    buffer: [new Float32Array(128)]
                }
            };
        });

        describe('with a buffer that is not an array', () => {
            beforeEach(() => {
                options.processorOptions.buffer = 'something other than an array';
            });

            it('should throw an error', () => {
                expect(() => new TimedAudioBufferSourceNodeAudioWorkletProcessor(options)).to.throw(
                    Error,
                    'The buffer needs to be either null or an array with where each element is a Float32Array.'
                );
            });
        });

        describe('with a buffer that contains something other than a Float32Array', () => {
            beforeEach(() => {
                options.processorOptions.buffer = ['something other than a Float32Array'];
            });

            it('should throw an error', () => {
                expect(() => new TimedAudioBufferSourceNodeAudioWorkletProcessor(options)).to.throw(
                    Error,
                    'The buffer needs to be either null or an array with where each element is a Float32Array.'
                );
            });
        });

        describe('with a numberOfInputs other than 1', () => {
            beforeEach(() => {
                options.numberOfInputs = 0;
            });

            it('should throw an error', () => {
                expect(() => new TimedAudioBufferSourceNodeAudioWorkletProcessor(options)).to.throw(Error, 'The numberOfInputs must be 1.');
            });
        });

        describe('with a numberOfOutputs other than 1', () => {
            beforeEach(() => {
                options.numberOfOutputs = 0;
            });

            it('should throw an error', () => {
                expect(() => new TimedAudioBufferSourceNodeAudioWorkletProcessor(options)).to.throw(
                    Error,
                    'The numberOfOutputs must be 1.'
                );
            });
        });

        describe('without a defined outputChannelCount', () => {
            beforeEach(() => {
                delete options.outputChannelCount;
            });

            it('should throw an error', () => {
                expect(() => new TimedAudioBufferSourceNodeAudioWorkletProcessor(options)).to.throw(
                    Error,
                    'The outputChannelCount must match the number of channels of the buffer.'
                );
            });
        });

        describe('without a matching outputChannelCount', () => {
            beforeEach(() => {
                options.outputChannelCount = [3];
            });

            it('should throw an error', () => {
                expect(() => new TimedAudioBufferSourceNodeAudioWorkletProcessor(options)).to.throw(
                    Error,
                    'The outputChannelCount must match the number of channels of the buffer.'
                );
            });
        });

        describe('with a velocity other than 0 or 1', () => {
            beforeEach(() => {
                options.processorOptions.velocity = 2;
            });

            it('should throw an error', () => {
                expect(() => new TimedAudioBufferSourceNodeAudioWorkletProcessor(options)).to.throw(
                    Error,
                    'The velocity needs to be either 0 or 1.'
                );
            });
        });
    });

    describe('process()', () => {
        describe('without a buffer', () => {
            let outputChannelData;
            let timedAudioBufferSourceNodeAudioWorkletProcessor;

            beforeEach(() => {
                outputChannelData = new Float32Array(128);
                timedAudioBufferSourceNodeAudioWorkletProcessor = new TimedAudioBufferSourceNodeAudioWorkletProcessor({
                    numberOfInputs: 1,
                    numberOfOutputs: 1,
                    outputChannelCount: [1]
                });
            });

            describe('with a currentFrame of 0', () => {
                beforeEach(() => {
                    // eslint-disable-next-line no-undef
                    global.currentFrame = 0;
                });

                it('should return true', () => {
                    expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([[]], [[outputChannelData]])).to.be.true;
                });

                it('should not change the output', () => {
                    timedAudioBufferSourceNodeAudioWorkletProcessor.process([[]], [[outputChannelData]]);

                    expect(outputChannelData).to.deep.equal(new Float32Array(128));
                });
            });

            describe('with a currentFrame of 128', () => {
                beforeEach(() => {
                    // eslint-disable-next-line no-undef
                    global.currentFrame = 128;
                });

                it('should return true', () => {
                    expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([[]], [[outputChannelData]])).to.be.true;
                });

                it('should not change the output', () => {
                    timedAudioBufferSourceNodeAudioWorkletProcessor.process([[]], [[outputChannelData]]);

                    expect(outputChannelData).to.deep.equal(new Float32Array(128));
                });
            });

            describe('with a currentFrame of 256', () => {
                beforeEach(() => {
                    // eslint-disable-next-line no-undef
                    global.currentFrame = 256;
                });

                it('should return true', () => {
                    expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([[]], [[outputChannelData]])).to.be.true;
                });

                it('should not change the output', () => {
                    timedAudioBufferSourceNodeAudioWorkletProcessor.process([[]], [[outputChannelData]]);

                    expect(outputChannelData).to.deep.equal(new Float32Array(128));
                });
            });
        });

        describe('with a buffer', () => {
            let bufferChannelData;
            let outputChannelData;

            beforeEach(() => {
                bufferChannelData = new Float32Array(Array.from({ length: 384 }, (_, index) => index));
                outputChannelData = new Float32Array(128);
            });

            describe('without a position, timestamp and velocity', () => {
                let timedAudioBufferSourceNodeAudioWorkletProcessor;

                beforeEach(() => {
                    timedAudioBufferSourceNodeAudioWorkletProcessor = new TimedAudioBufferSourceNodeAudioWorkletProcessor({
                        numberOfInputs: 1,
                        numberOfOutputs: 1,
                        outputChannelCount: [1],
                        processorOptions: {
                            buffer: [bufferChannelData]
                        }
                    });
                });

                describe('with a currentFrame of 0', () => {
                    beforeEach(() => {
                        // eslint-disable-next-line no-undef
                        global.currentFrame = 0;
                    });

                    it('should return true', () => {
                        expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([[]], [[outputChannelData]])).to.be.true;
                    });

                    it('should not change the output', () => {
                        timedAudioBufferSourceNodeAudioWorkletProcessor.process([], [[outputChannelData]]);

                        expect(outputChannelData).to.deep.equal(new Float32Array(128));
                    });
                });

                describe('with a currentFrame of 128', () => {
                    beforeEach(() => {
                        // eslint-disable-next-line no-undef
                        global.currentFrame = 128;
                    });

                    it('should return true', () => {
                        expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([[]], [[outputChannelData]])).to.be.true;
                    });

                    it('should not change the output', () => {
                        timedAudioBufferSourceNodeAudioWorkletProcessor.process([], [[outputChannelData]]);

                        expect(outputChannelData).to.deep.equal(new Float32Array(128));
                    });
                });

                describe('with a currentFrame of 256', () => {
                    beforeEach(() => {
                        // eslint-disable-next-line no-undef
                        global.currentFrame = 256;
                    });

                    it('should return true', () => {
                        expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([[]], [[outputChannelData]])).to.be.true;
                    });

                    it('should not change the output', () => {
                        timedAudioBufferSourceNodeAudioWorkletProcessor.process([], [[outputChannelData]]);

                        expect(outputChannelData).to.deep.equal(new Float32Array(128));
                    });
                });
            });

            describe('with a position', () => {
                for (const [description, input, processorOptions] of [
                    ['set in the constructor', [], { position: 128 }],
                    ['given as input', [new Float32Array(Array.from({ length: 128 }, (_, index) => (index === 0 ? 128 : 0)))], {}]
                ]) {
                    describe(`with a value ${description}`, () => {
                        let timedAudioBufferSourceNodeAudioWorkletProcessor;

                        beforeEach(() => {
                            timedAudioBufferSourceNodeAudioWorkletProcessor = new TimedAudioBufferSourceNodeAudioWorkletProcessor({
                                numberOfInputs: 1,
                                numberOfOutputs: 1,
                                outputChannelCount: [1],
                                processorOptions: {
                                    buffer: [bufferChannelData],
                                    ...processorOptions
                                }
                            });
                        });

                        describe('with a currentFrame of 0', () => {
                            beforeEach(() => {
                                // eslint-disable-next-line no-undef
                                global.currentFrame = 0;
                            });

                            it('should return true', () => {
                                expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]])).to.be.true;
                            });

                            it('should fill the output with the sample at the position', () => {
                                timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]]);

                                expect(outputChannelData).to.deep.equal(new Float32Array(Array.from({ length: 128 }, () => 128)));
                            });
                        });

                        describe('with a currentFrame of 128', () => {
                            beforeEach(() => {
                                // eslint-disable-next-line no-undef
                                global.currentFrame = 128;
                            });

                            it('should return true', () => {
                                expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]])).to.be.true;
                            });

                            it('should fill the output with the sample at the position', () => {
                                timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]]);

                                expect(outputChannelData).to.deep.equal(new Float32Array(Array.from({ length: 128 }, () => 128)));
                            });
                        });

                        describe('with a currentFrame of 256', () => {
                            beforeEach(() => {
                                // eslint-disable-next-line no-undef
                                global.currentFrame = 256;
                            });

                            it('should return true', () => {
                                expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]])).to.be.true;
                            });

                            it('should fill the output with the sample at the position', () => {
                                timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]]);

                                expect(outputChannelData).to.deep.equal(new Float32Array(Array.from({ length: 128 }, () => 128)));
                            });
                        });
                    });
                }
            });

            describe('with a timestamp', () => {
                for (const [description, input, processorOptions] of [
                    ['set in the constructor', [], { timestamp: 128 }],
                    ['given as input', [new Float32Array(Array.from({ length: 128 }, (_, index) => (index === 1 ? 128 : 0)))], {}]
                ]) {
                    describe(`with a value ${description}`, () => {
                        let timedAudioBufferSourceNodeAudioWorkletProcessor;

                        beforeEach(() => {
                            timedAudioBufferSourceNodeAudioWorkletProcessor = new TimedAudioBufferSourceNodeAudioWorkletProcessor({
                                numberOfInputs: 1,
                                numberOfOutputs: 1,
                                outputChannelCount: [1],
                                processorOptions: {
                                    buffer: [bufferChannelData],
                                    ...processorOptions
                                }
                            });
                        });

                        describe('with a currentFrame of 0', () => {
                            beforeEach(() => {
                                // eslint-disable-next-line no-undef
                                global.currentFrame = 0;
                            });

                            it('should return true', () => {
                                expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]])).to.be.true;
                            });

                            it('should not change the output', () => {
                                timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]]);

                                expect(outputChannelData).to.deep.equal(new Float32Array(128));
                            });
                        });

                        describe('with a currentFrame of 128', () => {
                            beforeEach(() => {
                                // eslint-disable-next-line no-undef
                                global.currentFrame = 128;
                            });

                            it('should return true', () => {
                                expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]])).to.be.true;
                            });

                            it('should not change the output', () => {
                                timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]]);

                                expect(outputChannelData).to.deep.equal(new Float32Array(128));
                            });
                        });

                        describe('with a currentFrame of 256', () => {
                            beforeEach(() => {
                                // eslint-disable-next-line no-undef
                                global.currentFrame = 256;
                            });

                            it('should return true', () => {
                                expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]])).to.be.true;
                            });

                            it('should not change the output', () => {
                                timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]]);

                                expect(outputChannelData).to.deep.equal(new Float32Array(128));
                            });
                        });
                    });
                }
            });

            describe('with a velocity', () => {
                for (const [description, input, processorOptions] of [
                    ['set in the constructor', [], { velocity: 1 }],
                    ['given as input', [new Float32Array(Array.from({ length: 128 }, (_, index) => (index === 2 ? 1 : 0)))], {}]
                ]) {
                    describe(`with a value ${description}`, () => {
                        let timedAudioBufferSourceNodeAudioWorkletProcessor;

                        beforeEach(() => {
                            timedAudioBufferSourceNodeAudioWorkletProcessor = new TimedAudioBufferSourceNodeAudioWorkletProcessor({
                                numberOfInputs: 1,
                                numberOfOutputs: 1,
                                outputChannelCount: [1],
                                processorOptions: {
                                    buffer: [bufferChannelData],
                                    ...processorOptions
                                }
                            });
                        });

                        describe('with a currentFrame of 0', () => {
                            beforeEach(() => {
                                // eslint-disable-next-line no-undef
                                global.currentFrame = 0;
                            });

                            it('should return true', () => {
                                expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]])).to.be.true;
                            });

                            it('should fill the output with samples from the buffer', () => {
                                timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]]);

                                expect(outputChannelData).to.deep.equal(bufferChannelData.slice(0, 128));
                            });
                        });

                        describe('with a currentFrame of 128', () => {
                            beforeEach(() => {
                                // eslint-disable-next-line no-undef
                                global.currentFrame = 128;
                            });

                            it('should return true', () => {
                                expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]])).to.be.true;
                            });

                            it('should fill the output with samples from the buffer', () => {
                                timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]]);

                                expect(outputChannelData).to.deep.equal(bufferChannelData.slice(128, 256));
                            });
                        });

                        describe('with a currentFrame of 256', () => {
                            beforeEach(() => {
                                // eslint-disable-next-line no-undef
                                global.currentFrame = 256;
                            });

                            it('should return true', () => {
                                expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]])).to.be.true;
                            });

                            it('should fill the output with samples from the buffer', () => {
                                timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]]);

                                expect(outputChannelData).to.deep.equal(bufferChannelData.slice(256, 384));
                            });
                        });
                    });
                }
            });

            describe('with a position and velocity', () => {
                for (const [description, input, processorOptions] of [
                    ['set in the constructor', [], { position: 128, velocity: 1 }],
                    [
                        'given as input',
                        [new Float32Array(Array.from({ length: 128 }, (_, index) => (index === 0 ? 128 : index === 2 ? 1 : 0)))],
                        {}
                    ]
                ]) {
                    describe(`with the values ${description}`, () => {
                        let timedAudioBufferSourceNodeAudioWorkletProcessor;

                        beforeEach(() => {
                            timedAudioBufferSourceNodeAudioWorkletProcessor = new TimedAudioBufferSourceNodeAudioWorkletProcessor({
                                numberOfInputs: 1,
                                numberOfOutputs: 1,
                                outputChannelCount: [1],
                                processorOptions: {
                                    buffer: [bufferChannelData],
                                    ...processorOptions
                                }
                            });
                        });

                        describe('with a currentFrame of 0', () => {
                            beforeEach(() => {
                                // eslint-disable-next-line no-undef
                                global.currentFrame = 0;
                            });

                            it('should return true', () => {
                                expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]])).to.be.true;
                            });

                            it('should fill the output with samples from the buffer', () => {
                                timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]]);

                                expect(outputChannelData).to.deep.equal(bufferChannelData.slice(128, 256));
                            });
                        });

                        describe('with a currentFrame of 128', () => {
                            beforeEach(() => {
                                // eslint-disable-next-line no-undef
                                global.currentFrame = 128;
                            });

                            it('should return true', () => {
                                expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]])).to.be.true;
                            });

                            it('should fill the output with samples from the buffer', () => {
                                timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]]);

                                expect(outputChannelData).to.deep.equal(bufferChannelData.slice(256, 384));
                            });
                        });

                        describe('with a currentFrame of 256', () => {
                            beforeEach(() => {
                                // eslint-disable-next-line no-undef
                                global.currentFrame = 256;
                            });

                            it('should return true', () => {
                                expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]])).to.be.true;
                            });

                            it('should not change the output', () => {
                                timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]]);

                                expect(outputChannelData).to.deep.equal(new Float32Array(128));
                            });
                        });
                    });
                }
            });

            describe('with a position and timestamp', () => {
                for (const [description, input, processorOptions] of [
                    ['set in the constructor', [], { position: 128, timestamp: 128 }],
                    ['given as input', [new Float32Array(Array.from({ length: 128 }, (_, index) => (index < 2 ? 128 : 0)))], {}]
                ]) {
                    describe(`with the values ${description}`, () => {
                        let timedAudioBufferSourceNodeAudioWorkletProcessor;

                        beforeEach(() => {
                            timedAudioBufferSourceNodeAudioWorkletProcessor = new TimedAudioBufferSourceNodeAudioWorkletProcessor({
                                numberOfInputs: 1,
                                numberOfOutputs: 1,
                                outputChannelCount: [1],
                                processorOptions: {
                                    buffer: [bufferChannelData],
                                    ...processorOptions
                                }
                            });
                        });

                        describe('with a currentFrame of 0', () => {
                            beforeEach(() => {
                                // eslint-disable-next-line no-undef
                                global.currentFrame = 0;
                            });

                            it('should return true', () => {
                                expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]])).to.be.true;
                            });

                            it('should fill the output with the sample at the position', () => {
                                timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]]);

                                expect(outputChannelData).to.deep.equal(new Float32Array(Array.from({ length: 128 }, () => 128)));
                            });
                        });

                        describe('with a currentFrame of 128', () => {
                            beforeEach(() => {
                                // eslint-disable-next-line no-undef
                                global.currentFrame = 128;
                            });

                            it('should return true', () => {
                                expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]])).to.be.true;
                            });

                            it('should fill the output with the sample at the position', () => {
                                timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]]);

                                expect(outputChannelData).to.deep.equal(new Float32Array(Array.from({ length: 128 }, () => 128)));
                            });
                        });

                        describe('with a currentFrame of 256', () => {
                            beforeEach(() => {
                                // eslint-disable-next-line no-undef
                                global.currentFrame = 256;
                            });

                            it('should return true', () => {
                                expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]])).to.be.true;
                            });

                            it('should fill the output with the sample at the position', () => {
                                timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]]);

                                expect(outputChannelData).to.deep.equal(new Float32Array(Array.from({ length: 128 }, () => 128)));
                            });
                        });
                    });
                }
            });

            describe('with a timestamp and velocity', () => {
                for (const [description, input, processorOptions] of [
                    ['set in the constructor', [], { timestamp: 128, velocity: 1 }],
                    [
                        'given as input',
                        [new Float32Array(Array.from({ length: 128 }, (_, index) => (index === 1 ? 128 : index === 2 ? 1 : 0)))],
                        {}
                    ]
                ]) {
                    describe(`with the values ${description}`, () => {
                        let timedAudioBufferSourceNodeAudioWorkletProcessor;

                        beforeEach(() => {
                            timedAudioBufferSourceNodeAudioWorkletProcessor = new TimedAudioBufferSourceNodeAudioWorkletProcessor({
                                numberOfInputs: 1,
                                numberOfOutputs: 1,
                                outputChannelCount: [1],
                                processorOptions: {
                                    buffer: [bufferChannelData],
                                    ...processorOptions
                                }
                            });
                        });

                        describe('with a currentFrame of 0', () => {
                            beforeEach(() => {
                                // eslint-disable-next-line no-undef
                                global.currentFrame = 0;
                            });

                            it('should return true', () => {
                                expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]])).to.be.true;
                            });

                            it('should not change the output', () => {
                                timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]]);

                                expect(outputChannelData).to.deep.equal(new Float32Array(128));
                            });
                        });

                        describe('with a currentFrame of 128', () => {
                            beforeEach(() => {
                                // eslint-disable-next-line no-undef
                                global.currentFrame = 128;
                            });

                            it('should return true', () => {
                                expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]])).to.be.true;
                            });

                            it('should fill the output with samples from the buffer', () => {
                                timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]]);

                                expect(outputChannelData).to.deep.equal(bufferChannelData.slice(0, 128));
                            });
                        });

                        describe('with a currentFrame of 256', () => {
                            beforeEach(() => {
                                // eslint-disable-next-line no-undef
                                global.currentFrame = 256;
                            });

                            it('should return true', () => {
                                expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]])).to.be.true;
                            });

                            it('should fill the output with samples from the buffer', () => {
                                timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]]);

                                expect(outputChannelData).to.deep.equal(bufferChannelData.slice(128, 256));
                            });
                        });
                    });
                }
            });

            describe('with a position, timestamp and velocity', () => {
                for (const [description, input, processorOptions] of [
                    ['set in the constructor', [], { position: 128, timestamp: 128, velocity: 1 }],
                    [
                        'given as input',
                        [new Float32Array(Array.from({ length: 128 }, (_, index) => (index < 2 ? 128 : index === 2 ? 1 : 0)))],
                        {}
                    ]
                ]) {
                    describe(`with the values ${description}`, () => {
                        let timedAudioBufferSourceNodeAudioWorkletProcessor;

                        beforeEach(() => {
                            timedAudioBufferSourceNodeAudioWorkletProcessor = new TimedAudioBufferSourceNodeAudioWorkletProcessor({
                                numberOfInputs: 1,
                                numberOfOutputs: 1,
                                outputChannelCount: [1],
                                processorOptions: {
                                    buffer: [bufferChannelData],
                                    ...processorOptions
                                }
                            });
                        });

                        describe('with a currentFrame of 0', () => {
                            beforeEach(() => {
                                // eslint-disable-next-line no-undef
                                global.currentFrame = 0;
                            });

                            it('should return true', () => {
                                expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]])).to.be.true;
                            });

                            it('should fill the output with samples from the buffer', () => {
                                timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]]);

                                expect(outputChannelData).to.deep.equal(bufferChannelData.slice(0, 128));
                            });
                        });

                        describe('with a currentFrame of 128', () => {
                            beforeEach(() => {
                                // eslint-disable-next-line no-undef
                                global.currentFrame = 128;
                            });

                            it('should return true', () => {
                                expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]])).to.be.true;
                            });

                            it('should fill the output with samples from the buffer', () => {
                                timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]]);

                                expect(outputChannelData).to.deep.equal(bufferChannelData.slice(128, 256));
                            });
                        });

                        describe('with a currentFrame of 256', () => {
                            beforeEach(() => {
                                // eslint-disable-next-line no-undef
                                global.currentFrame = 256;
                            });

                            it('should return true', () => {
                                expect(timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]])).to.be.true;
                            });

                            it('should fill the output with samples from the buffer', () => {
                                timedAudioBufferSourceNodeAudioWorkletProcessor.process([input], [[outputChannelData]]);

                                expect(outputChannelData).to.deep.equal(bufferChannelData.slice(256, 384));
                            });
                        });
                    });
                }
            });
        });
    });
});
