import {isServer} from '@shopify/react-utilities/target';

export interface Polaris {
  VERSION: string;
}

declare global {
  interface Window {
    Polaris: Polaris;
  }
}

if (!isServer) {
  window.Polaris = window.Polaris || {};
  window.Polaris.VERSION = '{{POLARIS_VERSION}}';
}
