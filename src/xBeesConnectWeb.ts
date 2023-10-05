import {IxBeesSend, ResponseFromChannel} from './types';

export class xBeesConnectWeb implements IxBeesSend {
  private readonly target: Window;
  private timeout = 10000;

  constructor() {
    this.target = parent;
  }

  public async sendAsync(data: any): Promise<ResponseFromChannel> {
    if (!this.target || this.target === window) {
      return Promise.reject('xBeesConnect should be wrapped within iframe to perform the connection');
    }
    return this.send(this.target, data);
  }

  private send(target: Window, payload: any): Promise<ResponseFromChannel> {
    return new Promise((res, rej) => {
      const channel = new MessageChannel();
      const timeout = setTimeout(() => {
        channel.port1.close();
        rej({errorMessage: 'timeout', type: payload.type});
      }, this.timeout);

      channel.port1.onmessage = ({data}) => {
        clearTimeout(timeout);
        channel.port1.close();

        if (!data.errorMessage) {
          res(data);
        } else {
          rej(data);
        }
      };

      target.postMessage(payload, '*', [channel.port2]);
    });
  }
}
