import { AudioWorkletNode, OfflineAudioContext } from 'standardized-audio-context';
import { beforeEach, describe, expect, it } from 'vitest';

describe('module', () => {
    let offlineAudioContext;

    beforeEach(async () => {
        offlineAudioContext = new OfflineAudioContext({ length: 128, sampleRate: 44100 });

        await offlineAudioContext.audioWorklet.addModule('../../src/module.js');
    });

    describe('without a buffer', () => {
        let audioWorkletNode;

        beforeEach(() => {
            audioWorkletNode = new AudioWorkletNode(offlineAudioContext, 'timed-audio-buffer-source-node-audio-worklet-processor', {
                numberOfInputs: 1,
                numberOfOutputs: 1,
                outputChannelCount: [1]
            });

            audioWorkletNode.connect(offlineAudioContext.destination);
        });

        it('should render silence', async () => {
            const channelData = new Float32Array(128);
            const renderedBuffer = await offlineAudioContext.startRendering();

            renderedBuffer.copyFromChannel(channelData, 0);

            for (const sample of channelData) {
                expect(sample).to.equal(0);
            }
        });
    });

    describe('with a mono buffer', () => {
        let buffer;

        beforeEach(() => {
            buffer = [new Float32Array(Array.from({ length: 128 }, (_, index) => index))];
        });

        describe('without a position', () => {
            describe('without a timestamp', () => {
                describe('without a velocity', () => {
                    let audioWorkletNode;

                    beforeEach(() => {
                        audioWorkletNode = new AudioWorkletNode(
                            offlineAudioContext,
                            'timed-audio-buffer-source-node-audio-worklet-processor',
                            {
                                numberOfInputs: 1,
                                numberOfOutputs: 1,
                                outputChannelCount: [1],
                                processorOptions: { buffer }
                            }
                        );

                        audioWorkletNode.connect(offlineAudioContext.destination);
                    });

                    it('should render silence', async () => {
                        const channelData = new Float32Array(128);
                        const renderedBuffer = await offlineAudioContext.startRendering();

                        renderedBuffer.copyFromChannel(channelData, 0);

                        for (const sample of channelData) {
                            expect(sample).to.equal(0);
                        }
                    });
                });

                describe('with a velocity of 1', () => {
                    let audioWorkletNode;

                    beforeEach(() => {
                        audioWorkletNode = new AudioWorkletNode(
                            offlineAudioContext,
                            'timed-audio-buffer-source-node-audio-worklet-processor',
                            {
                                numberOfInputs: 1,
                                numberOfOutputs: 1,
                                outputChannelCount: [1],
                                processorOptions: { buffer, velocity: 1 }
                            }
                        );

                        audioWorkletNode.connect(offlineAudioContext.destination);
                    });

                    it('should render the buffer', async () => {
                        const channelData = new Float32Array(128);
                        const renderedBuffer = await offlineAudioContext.startRendering();

                        renderedBuffer.copyFromChannel(channelData, 0);

                        for (let index = 0; index < 128; index += 1) {
                            const sample = channelData[index];

                            expect(sample).to.equal(index);
                        }
                    });
                });
            });

            describe('with a timestamp of 64', () => {
                describe('without a velocity', () => {
                    let audioWorkletNode;

                    beforeEach(() => {
                        audioWorkletNode = new AudioWorkletNode(
                            offlineAudioContext,
                            'timed-audio-buffer-source-node-audio-worklet-processor',
                            {
                                numberOfInputs: 1,
                                numberOfOutputs: 1,
                                outputChannelCount: [1],
                                processorOptions: { buffer, timestamp: 64 }
                            }
                        );

                        audioWorkletNode.connect(offlineAudioContext.destination);
                    });

                    it('should render silence', async () => {
                        const channelData = new Float32Array(128);
                        const renderedBuffer = await offlineAudioContext.startRendering();

                        renderedBuffer.copyFromChannel(channelData, 0);

                        for (const sample of channelData) {
                            expect(sample).to.equal(0);
                        }
                    });
                });

                describe('with a velocity of 1', () => {
                    let audioWorkletNode;

                    beforeEach(() => {
                        audioWorkletNode = new AudioWorkletNode(
                            offlineAudioContext,
                            'timed-audio-buffer-source-node-audio-worklet-processor',
                            {
                                numberOfInputs: 1,
                                numberOfOutputs: 1,
                                outputChannelCount: [1],
                                processorOptions: { buffer, timestamp: 64, velocity: 1 }
                            }
                        );

                        audioWorkletNode.connect(offlineAudioContext.destination);
                    });

                    it('should render the buffer', async () => {
                        const channelData = new Float32Array(128);
                        const renderedBuffer = await offlineAudioContext.startRendering();

                        renderedBuffer.copyFromChannel(channelData, 0);

                        for (let index = 0; index < 128; index += 1) {
                            const sample = channelData[index];

                            expect(sample).to.equal(index < 64 ? 0 : index - 64);
                        }
                    });
                });
            });
        });

        describe('with a position of 64', () => {
            let position;

            beforeEach(() => {
                position = 64;
            });

            describe('without a timestamp', () => {
                describe('without a velocity', () => {
                    let audioWorkletNode;

                    beforeEach(() => {
                        audioWorkletNode = new AudioWorkletNode(
                            offlineAudioContext,
                            'timed-audio-buffer-source-node-audio-worklet-processor',
                            {
                                numberOfInputs: 1,
                                numberOfOutputs: 1,
                                outputChannelCount: [1],
                                processorOptions: { buffer, position }
                            }
                        );

                        audioWorkletNode.connect(offlineAudioContext.destination);
                    });

                    it('should render a constant value', async () => {
                        const channelData = new Float32Array(128);
                        const renderedBuffer = await offlineAudioContext.startRendering();

                        renderedBuffer.copyFromChannel(channelData, 0);

                        for (const sample of channelData) {
                            expect(sample).to.equal(64);
                        }
                    });
                });

                describe('with a velocity of 1', () => {
                    let audioWorkletNode;

                    beforeEach(() => {
                        audioWorkletNode = new AudioWorkletNode(
                            offlineAudioContext,
                            'timed-audio-buffer-source-node-audio-worklet-processor',
                            {
                                numberOfInputs: 1,
                                numberOfOutputs: 1,
                                outputChannelCount: [1],
                                processorOptions: { buffer, position, velocity: 1 }
                            }
                        );

                        audioWorkletNode.connect(offlineAudioContext.destination);
                    });

                    it('should render the buffer', async () => {
                        const channelData = new Float32Array(128);
                        const renderedBuffer = await offlineAudioContext.startRendering();

                        renderedBuffer.copyFromChannel(channelData, 0);

                        for (let index = 0; index < 128; index += 1) {
                            const sample = channelData[index];

                            expect(sample).to.equal(index < 64 ? index + 64 : 0);
                        }
                    });
                });
            });

            describe('with a timestamp of 64', () => {
                describe('without a velocity', () => {
                    let audioWorkletNode;

                    beforeEach(() => {
                        audioWorkletNode = new AudioWorkletNode(
                            offlineAudioContext,
                            'timed-audio-buffer-source-node-audio-worklet-processor',
                            {
                                numberOfInputs: 1,
                                numberOfOutputs: 1,
                                outputChannelCount: [1],
                                processorOptions: { buffer, position, timestamp: 64 }
                            }
                        );

                        audioWorkletNode.connect(offlineAudioContext.destination);
                    });

                    it('should render a constant value', async () => {
                        const channelData = new Float32Array(128);
                        const renderedBuffer = await offlineAudioContext.startRendering();

                        renderedBuffer.copyFromChannel(channelData, 0);

                        for (const sample of channelData) {
                            expect(sample).to.equal(64);
                        }
                    });
                });

                describe('with a velocity of 1', () => {
                    let audioWorkletNode;

                    beforeEach(() => {
                        audioWorkletNode = new AudioWorkletNode(
                            offlineAudioContext,
                            'timed-audio-buffer-source-node-audio-worklet-processor',
                            {
                                numberOfInputs: 1,
                                numberOfOutputs: 1,
                                outputChannelCount: [1],
                                processorOptions: { buffer, position, timestamp: 64, velocity: 1 }
                            }
                        );

                        audioWorkletNode.connect(offlineAudioContext.destination);
                    });

                    it('should render the buffer', async () => {
                        const channelData = new Float32Array(128);
                        const renderedBuffer = await offlineAudioContext.startRendering();

                        renderedBuffer.copyFromChannel(channelData, 0);

                        for (let index = 0; index < 128; index += 1) {
                            const sample = channelData[index];

                            expect(sample).to.equal(index);
                        }
                    });
                });
            });
        });
    });

    describe('with a stereo buffer', () => {
        let buffer;

        beforeEach(() => {
            buffer = [
                new Float32Array(Array.from({ length: 128 }, (_, index) => index)),
                new Float32Array(Array.from({ length: 128 }, (_, index) => 128 - index))
            ];
        });

        describe('without a position', () => {
            describe('without a timestamp', () => {
                describe('without a velocity', () => {
                    let audioWorkletNode;

                    beforeEach(() => {
                        audioWorkletNode = new AudioWorkletNode(
                            offlineAudioContext,
                            'timed-audio-buffer-source-node-audio-worklet-processor',
                            {
                                numberOfInputs: 1,
                                numberOfOutputs: 1,
                                outputChannelCount: [2],
                                processorOptions: { buffer }
                            }
                        );

                        audioWorkletNode.connect(offlineAudioContext.destination);
                    });

                    it('should render a constant value', async () => {
                        const channelData = new Float32Array(128);
                        const renderedBuffer = await offlineAudioContext.startRendering();

                        renderedBuffer.copyFromChannel(channelData, 0);

                        for (const sample of channelData) {
                            expect(sample).to.equal(64);
                        }
                    });
                });

                describe('with a velocity of 1', () => {
                    let audioWorkletNode;

                    beforeEach(() => {
                        audioWorkletNode = new AudioWorkletNode(
                            offlineAudioContext,
                            'timed-audio-buffer-source-node-audio-worklet-processor',
                            {
                                numberOfInputs: 1,
                                numberOfOutputs: 1,
                                outputChannelCount: [2],
                                processorOptions: { buffer, velocity: 1 }
                            }
                        );

                        audioWorkletNode.connect(offlineAudioContext.destination);
                    });

                    it('should render a constant value', async () => {
                        const channelData = new Float32Array(128);
                        const renderedBuffer = await offlineAudioContext.startRendering();

                        renderedBuffer.copyFromChannel(channelData, 0);

                        for (const sample of channelData) {
                            expect(sample).to.equal(64);
                        }
                    });
                });
            });

            describe('with a timestamp of 64', () => {
                describe('without a velocity', () => {
                    let audioWorkletNode;

                    beforeEach(() => {
                        audioWorkletNode = new AudioWorkletNode(
                            offlineAudioContext,
                            'timed-audio-buffer-source-node-audio-worklet-processor',
                            {
                                numberOfInputs: 1,
                                numberOfOutputs: 1,
                                outputChannelCount: [2],
                                processorOptions: { buffer, timestamp: 64 }
                            }
                        );

                        audioWorkletNode.connect(offlineAudioContext.destination);
                    });

                    it('should render a constant value', async () => {
                        const channelData = new Float32Array(128);
                        const renderedBuffer = await offlineAudioContext.startRendering();

                        renderedBuffer.copyFromChannel(channelData, 0);

                        for (const sample of channelData) {
                            expect(sample).to.equal(64);
                        }
                    });
                });

                describe('with a velocity of 1', () => {
                    let audioWorkletNode;

                    beforeEach(() => {
                        audioWorkletNode = new AudioWorkletNode(
                            offlineAudioContext,
                            'timed-audio-buffer-source-node-audio-worklet-processor',
                            {
                                numberOfInputs: 1,
                                numberOfOutputs: 1,
                                outputChannelCount: [2],
                                processorOptions: { buffer, timestamp: 64, velocity: 1 }
                            }
                        );

                        audioWorkletNode.connect(offlineAudioContext.destination);
                    });

                    it('should render the buffer', async () => {
                        const channelData = new Float32Array(128);
                        const renderedBuffer = await offlineAudioContext.startRendering();

                        renderedBuffer.copyFromChannel(channelData, 0);

                        for (let index = 0; index < 128; index += 1) {
                            const sample = channelData[index];

                            expect(sample).to.equal(index < 64 ? 0 : 64);
                        }
                    });
                });
            });
        });

        describe('with a position of 64', () => {
            let position;

            beforeEach(() => {
                position = 64;
            });

            describe('without a timestamp', () => {
                describe('without a velocity', () => {
                    let audioWorkletNode;

                    beforeEach(() => {
                        audioWorkletNode = new AudioWorkletNode(
                            offlineAudioContext,
                            'timed-audio-buffer-source-node-audio-worklet-processor',
                            {
                                numberOfInputs: 1,
                                numberOfOutputs: 1,
                                outputChannelCount: [2],
                                processorOptions: { buffer, position }
                            }
                        );

                        audioWorkletNode.connect(offlineAudioContext.destination);
                    });

                    it('should render a constant value', async () => {
                        const channelData = new Float32Array(128);
                        const renderedBuffer = await offlineAudioContext.startRendering();

                        renderedBuffer.copyFromChannel(channelData, 0);

                        for (const sample of channelData) {
                            expect(sample).to.equal(64);
                        }
                    });
                });

                describe('with a velocity of 1', () => {
                    let audioWorkletNode;

                    beforeEach(() => {
                        audioWorkletNode = new AudioWorkletNode(
                            offlineAudioContext,
                            'timed-audio-buffer-source-node-audio-worklet-processor',
                            {
                                numberOfInputs: 1,
                                numberOfOutputs: 1,
                                outputChannelCount: [2],
                                processorOptions: { buffer, position, velocity: 1 }
                            }
                        );

                        audioWorkletNode.connect(offlineAudioContext.destination);
                    });

                    it('should render the buffer', async () => {
                        const channelData = new Float32Array(128);
                        const renderedBuffer = await offlineAudioContext.startRendering();

                        renderedBuffer.copyFromChannel(channelData, 0);

                        for (let index = 0; index < 128; index += 1) {
                            const sample = channelData[index];

                            expect(sample).to.equal(index < 64 ? 64 : 0);
                        }
                    });
                });
            });

            describe('with a timestamp of 64', () => {
                describe('without a velocity', () => {
                    let audioWorkletNode;

                    beforeEach(() => {
                        audioWorkletNode = new AudioWorkletNode(
                            offlineAudioContext,
                            'timed-audio-buffer-source-node-audio-worklet-processor',
                            {
                                numberOfInputs: 1,
                                numberOfOutputs: 1,
                                outputChannelCount: [2],
                                processorOptions: { buffer, position, timestamp: 64 }
                            }
                        );

                        audioWorkletNode.connect(offlineAudioContext.destination);
                    });

                    it('should render a constant value', async () => {
                        const channelData = new Float32Array(128);
                        const renderedBuffer = await offlineAudioContext.startRendering();

                        renderedBuffer.copyFromChannel(channelData, 0);

                        for (const sample of channelData) {
                            expect(sample).to.equal(64);
                        }
                    });
                });

                describe('with a velocity of 1', () => {
                    let audioWorkletNode;

                    beforeEach(() => {
                        audioWorkletNode = new AudioWorkletNode(
                            offlineAudioContext,
                            'timed-audio-buffer-source-node-audio-worklet-processor',
                            {
                                numberOfInputs: 1,
                                numberOfOutputs: 1,
                                outputChannelCount: [2],
                                processorOptions: { buffer, position, timestamp: 64, velocity: 1 }
                            }
                        );

                        audioWorkletNode.connect(offlineAudioContext.destination);
                    });

                    it('should render a constant value', async () => {
                        const channelData = new Float32Array(128);
                        const renderedBuffer = await offlineAudioContext.startRendering();

                        renderedBuffer.copyFromChannel(channelData, 0);

                        for (const sample of channelData) {
                            expect(sample).to.equal(64);
                        }
                    });
                });
            });
        });
    });
});
