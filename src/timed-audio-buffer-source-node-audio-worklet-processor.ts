import { IAudioWorkletProcessor } from './interfaces';

export class TimedAudioBufferSourceNodeAudioWorkletProcessor extends AudioWorkletProcessor implements IAudioWorkletProcessor {
    public static parameterDescriptors = [];

    private _buffer: null | Float32Array[];

    private _position: number;

    private _timestamp: number;

    private _velocity: number;

    constructor({ numberOfInputs, numberOfOutputs, outputChannelCount, processorOptions }: AudioWorkletNodeOptions) {
        const buffer =
            typeof processorOptions === 'object' && processorOptions !== null && 'buffer' in processorOptions
                ? processorOptions.buffer
                : null;

        if (
            buffer !== null &&
            !(
                Array.isArray(buffer) &&
                buffer.every((channelData: unknown): channelData is Float32Array => channelData instanceof Float32Array)
            )
        ) {
            throw new Error('The buffer needs to be either null or an array with where each element is a Float32Array.');
        }

        if (numberOfInputs !== 1) {
            throw new Error('The numberOfInputs must be 1.');
        }

        if (numberOfOutputs !== 1) {
            throw new Error('The numberOfOutputs must be 1.');
        }

        const numberOfChannels = buffer?.length ?? 1;

        if (outputChannelCount === undefined || outputChannelCount.length !== 1 || numberOfChannels !== outputChannelCount[0]) {
            throw new Error('The outputChannelCount must match the number of channels of the buffer.');
        }

        const position =
            typeof processorOptions === 'object' && processorOptions !== null && 'position' in processorOptions
                ? processorOptions.position
                : 0;

        if (typeof position !== 'number') {
            throw new Error('The position needs to be of type "number".');
        }

        const timestamp =
            typeof processorOptions === 'object' && processorOptions !== null && 'timestamp' in processorOptions
                ? processorOptions.timestamp
                : 0;

        if (typeof timestamp !== 'number') {
            throw new Error('The timestamp needs to be of type "number".');
        }

        const velocity =
            typeof processorOptions === 'object' && processorOptions !== null && 'velocity' in processorOptions
                ? processorOptions.velocity
                : 0;

        if (![0, 1].includes(velocity)) {
            throw new Error('The velocity needs to be either 0 or 1.');
        }

        super();

        this._buffer = buffer;
        this._position = position;
        this._timestamp = timestamp;
        this._velocity = velocity;
    }

    public process([input]: Float32Array[][], [output]: Float32Array[][]): boolean {
        if (input?.length > 0) {
            const [inputChannelData] = input;

            if (inputChannelData.length > 1) {
                this._position = Math.round(inputChannelData[0]);
                this._timestamp = Math.round(inputChannelData[1]);
                this._velocity = Math.round(inputChannelData[2]);
            }
        }

        if (this._buffer !== null) {
            const numberOfChannels = this._buffer.length;

            for (let channel = 0; channel < numberOfChannels; channel += 1) {
                const bufferChannelData = this._buffer[channel];
                const outputChannelData = output[channel];

                for (let i = 0; i < 128; i += 1) {
                    const index = this._position + (currentFrame - this._timestamp + i) * this._velocity;

                    if (index >= 0 && index < bufferChannelData.length) {
                        outputChannelData[i] = bufferChannelData[index];
                    }
                }
            }
        }

        return true;
    }
}
