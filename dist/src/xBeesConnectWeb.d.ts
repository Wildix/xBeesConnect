import { IxBeesSend, ResponseFromChannel } from './types';
export declare class xBeesConnectWeb implements IxBeesSend {
    private readonly target;
    private timeout;
    constructor();
    sendAsync(data: any): Promise<ResponseFromChannel>;
    private send;
}
