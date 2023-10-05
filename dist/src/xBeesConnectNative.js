export class xBeesConnectNative {
    constructor() {
        this.timeout = 10000;
        // @ts-expect-error window.ReactNativeWebView will be provided by ReactNative WebView
        this.target = window.ReactNativeWebView;
    }
    async sendAsync(data) {
        if (!this.target) {
            return Promise.reject('xBeesConnect should be wrapped within iframe to perform the connection');
        }
        return this.send(this.target, data);
    }
    send(target, payload) {
        return new Promise((res, rej) => {
            const channel = new MessageChannel();
            const listener = (event) => {
                try {
                    let parsedData;
                    try {
                        parsedData = JSON.parse(event.data);
                    }
                    catch (e) {
                        return;
                    }
                    if (parsedData?.type === payload.type) {
                        clearTimeout(timeout);
                        window.removeEventListener('message', listener);
                        if (!parsedData.errorMessage) {
                            res(parsedData);
                        }
                        else {
                            rej(parsedData);
                        }
                    }
                }
                catch (e) {
                    target.postMessage('log on receive response Error ' + e);
                }
            };
            window.addEventListener('message', listener);
            const timeout = setTimeout(() => {
                channel.port1.close();
                window.removeEventListener('message', listener);
                rej({ errorMessage: 'timeout' });
            }, this.timeout);
            target.postMessage(JSON.stringify(payload));
        });
    }
}
