import * as React from 'react';
import {autobind} from '@shopify/javascript-utilities/decorators';
import {
  addEventListener,
  removeEventListener,
} from '@shopify/javascript-utilities/events';
import {isServer} from '@shopify/react-utilities/target';
import {Key} from '../../types';

export interface Props {
  keyCode: Key;
  handler(event: KeyboardEvent): void;
}

export default class KeypressListener extends React.Component<Props, never> {
  componentDidMount() {
    if (isServer) return;
    addEventListener(document, 'keyup', this.handleKeyEvent);
  }

  componentWillUnmount() {
    if (isServer) return;
    removeEventListener(document, 'keyup', this.handleKeyEvent);
  }

  render() {
    return null;
  }

  @autobind
  private handleKeyEvent(event: KeyboardEvent) {
    const {keyCode, handler} = this.props;

    if (event.keyCode === keyCode) {
      handler(event);
    }
  }
}
