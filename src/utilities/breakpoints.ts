import {noop} from '@shopify/javascript-utilities/other';
import {isServer} from '@shopify/react-utilities/target';

const Breakpoints = {
  navigationBarCollapsed: '769px',
  stackedContent: '1043px',
};

const noWindowMatches = {
  media: '',
  addListener: noop,
  removeListener: noop,
  matches: false,
};

export function navigationBarCollapsed(): MediaQueryList {
  return isServer
    ? noWindowMatches
    : window.matchMedia(`(max-width: ${Breakpoints.navigationBarCollapsed})`);
}

export function stackedContent(): MediaQueryList {
  return isServer
    ? noWindowMatches
    : window.matchMedia(`(max-width: ${Breakpoints.stackedContent})`);
}
