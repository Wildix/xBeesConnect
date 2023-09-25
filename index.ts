import {xBeesConnectLib} from './src/xBeesConnectLib';

(function () {
  // @ts-expect-error window.xBeesConnect will be used inside another app
  window.xBeesConnect = xBeesConnectLib;
})();

let xBeesConnect: any = null;

const connectProvider = () => {
  if (!xBeesConnect) {
    //@ts-ignore
    xBeesConnect = new xBeesConnectLib();
  }
  return xBeesConnect;
}

export default xBeesConnect;
