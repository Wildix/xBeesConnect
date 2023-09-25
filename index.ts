import {xBeesConnectLib} from './src/xBeesConnectLib';

(function () {
  // @ts-expect-error window.xBeesConnect will be used inside another app
  window.xBeesConnect = xBeesConnectLib;
})();

let connect: any = null;

const xBeesConnect = () => {
  if (!connect) {
    //@ts-ignore
    connect = new xBeesConnectLib();
  }
  return connect;
}

export default xBeesConnect;
