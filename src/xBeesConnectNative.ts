import {IReactNativeWebView, IxBeesSend, ResponseFromChannel} from './types';

export class xBeesConnectNative implements IxBeesSend {
  private readonly target: IReactNativeWebView;
  private timeout = 10000;

  constructor() {
    // @ts-expect-error window.ReactNativeWebView will be provided by ReactNative WebView
    this.target = window.ReactNativeWebView;
  }

  public async sendAsync(data: any): Promise<ResponseFromChannel> {
    if (!this.target) {
      return Promise.reject('xBeesConnect should be wrapped within iframe');
    }
    return this.send(this.target, data);
  }

  private send(target: IReactNativeWebView, payload: any): Promise<ResponseFromChannel> {
    return new Promise((res, rej) => {
      const channel = new MessageChannel();
      const listener = (event: any) => {
        try {
          let parsedData;
          try {
            parsedData = JSON.parse(event.data);
          } catch (e) {
            return;
          }

          if (parsedData?.type === payload.type) {
            clearTimeout(timeout);
            window.removeEventListener('message', listener);
            if (!parsedData.errorMessage) {
              res(parsedData);
            } else {
              rej(parsedData);
            }
          }
        } catch (e) {
          target.postMessage('log on receive response Error ' + e);
        }
      };

      window.addEventListener('message', listener);

      const timeout = setTimeout(() => {
        channel.port1.close();
        window.removeEventListener('message', listener);

        rej({errorMessage: 'timeout'});
      }, this.timeout);

      target.postMessage(JSON.stringify(payload));
    });
  }
}
