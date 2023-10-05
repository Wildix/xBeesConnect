export class xBeesConnectWeb {
    constructor() {
        this.timeout = 10000;
        this.target = parent;
    }
    async sendAsync(data) {
        if (!this.target || this.target === window) {
            return Promise.reject('xBeesConnect should be wrapped within iframe to perform the connection');
        }
        return this.send(this.target, data);
    }
    send(target, payload) {
        return new Promise((res, rej) => {
            const channel = new MessageChannel();
            const timeout = setTimeout(() => {
                channel.port1.close();
                rej({ errorMessage: 'timeout' });
            }, this.timeout);
            channel.port1.onmessage = ({ data }) => {
                clearTimeout(timeout);
                channel.port1.close();
                if (!data.errorMessage) {
                    res(data);
                }
                else {
                    rej(data);
                }
            };
            target.postMessage(payload, '*', [channel.port2]);
        });
    }
}
