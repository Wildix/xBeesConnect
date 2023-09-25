import {xBeesConnectLib} from './src/xBeesConnectLib';

(function () {
  // @ts-expect-error window.xBeesConnect will be used inside another app
  window.xBeesConnect = xBeesConnectLib;
})();

export default xBeesConnectLib;
