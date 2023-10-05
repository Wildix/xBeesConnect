import { IxBeesSend, ResponseFromChannel } from './types';
export declare class xBeesConnectNative implements IxBeesSend {
    private readonly target;
    private timeout;
    constructor();
    sendAsync(data: any): Promise<ResponseFromChannel>;
    private send;
}
