import { TimedAudioBufferSourceNodeAudioWorkletProcessor } from '../../src/timed-audio-buffer-source-node-audio-worklet-processor';

describe('TimedAudioBufferSourceNodeAudioWorkletProcessor', () => {
    describe('constructor()', () => {
        let options;

        beforeEach(() => {
            options = {
                numberOfInputs: 0,
                numberOfOutputs: 1,
                outputChannelCount: [2]
            };
        });

        describe('with a buffer that is not an array', () => {
            beforeEach(() => {
                options.processorOptions = { buffer: 'something other than an array' };
            });

            it('should throw an error', () => {
                expect(() => new TimedAudioBufferSourceNodeAudioWorkletProcessor(options)).to.throw(
                    Error,
                    'The buffer needs to be either null or an array with where each element is a Float32Array.'
                );
            });
        });

        describe('with a buffer that contains of something other than a Float32Array', () => {
            beforeEach(() => {
                options.processorOptions = { buffer: ['something other than a Float32Array'] };
            });

            it('should throw an error', () => {
                expect(() => new TimedAudioBufferSourceNodeAudioWorkletProcessor(options)).to.throw(
                    Error,
                    'The buffer needs to be either null or an array with where each element is a Float32Array.'
                );
            });
        });

        describe('with a numberOfInputs other than 0', () => {
            beforeEach(() => {
                options.numberOfInputs = 1;
            });

            it('should throw an error', () => {
                expect(() => new TimedAudioBufferSourceNodeAudioWorkletProcessor(options)).to.throw(Error, 'The numberOfInputs must be 0.');
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
    });
});
