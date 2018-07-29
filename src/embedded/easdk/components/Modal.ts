import Messenger from '../Messenger';
import {transformAction} from '../transformers';
import {EASDKAction} from '../../../types';

export interface FrameLoadedCallback {
  (modalFrame?: Window): void;
}

export interface CloseCallback {
  (result?: boolean, data?: any): void;
}

export interface OpenConfig {
  src: string;
  title?: string;
  width?: string;
  height?: number;
  primaryAction?: EASDKAction;
  secondaryActions?: EASDKAction[];
  onFrameLoaded?(): void;
  onClose?(): void;
}

export interface AlertConfig {
  children?: string;
  title?: string;
  destructive?: boolean;
  confirmContent: string;
  cancelContent?: string;
  onClose?(): void;
  onConfirm(): void;
}

export default class Modal {
  private frameLoadedCallback: FrameLoadedCallback | undefined;
  private closeCallback: CloseCallback | undefined;

  constructor(private messenger: Messenger) {}

  open(config: OpenConfig) {
    const {
      title,
      primaryAction,
      secondaryActions,
      src,
      width,
      height,
      onClose,
      onFrameLoaded,
    } = config;
    if (onFrameLoaded != null) {
      this.storeFrameLoadedCallback(onFrameLoaded);
    }

    if (onClose != null) {
      this.storeCloseCallback(onClose);
    }

    this.messenger.send('Shopify.API.Modal.open', {
      src,
      title,
      width,
      height,
      buttons: {
        primary: primaryAction
          ? transformAction(this.messenger.targetOrigin)(primaryAction)
          : undefined,
        secondary: secondaryActions
          ? secondaryActions.map(transformAction(this.messenger.targetOrigin))
          : undefined,
      },
    });
  }

  alert(config: AlertConfig) {
    const {
      children,
      title,
      destructive,
      confirmContent,
      cancelContent,
      onClose,
      onConfirm,
    } = config;

    this.storeCloseCallback((result: boolean) => {
      if (result) {
        if (onConfirm) {
          onConfirm();
        }
      } else if (onClose) {
        onClose();
      }
    });

    if (onClose && cancelContent) {
      this.messenger.send('Shopify.API.Modal.confirm', {
        message: {
          title,
          message: children,
          okButton: confirmContent,
          cancelButton: cancelContent,
          style: destructive ? 'danger' : undefined,
        },
      });
    } else {
      this.messenger.send('Shopify.API.Modal.alert', {
        message: {
          title,
          message: children,
          okButton: confirmContent,
          style: destructive ? 'danger' : undefined,
        },
      });
    }
  }

  close(result?: boolean, data?: any) {
    if (this.closeCallback == null) {
      return;
    }

    this.messenger.send('Shopify.API.Modal.close', {
      result,
      data,
    });
  }

  storeFrameLoadedCallback(callback: FrameLoadedCallback) {
    this.frameLoadedCallback = callback;
  }

  callFrameLoadedCallback(frameName?: string) {
    const {frameLoadedCallback} = this;

    if (!frameName) {
      return;
    }

    const modalFrame = findRemoteFrame(frameName);
    if (typeof frameLoadedCallback === 'function' && modalFrame) {
      delete this.frameLoadedCallback;
      frameLoadedCallback(modalFrame);
    }
  }

  storeCloseCallback(callback: CloseCallback) {
    this.closeCallback = callback;
  }

  callCloseCallback(result?: boolean, data?: any) {
    const {closeCallback} = this;
    if (typeof closeCallback === 'function') {
      delete this.closeCallback;
      closeCallback(result, data);
    }
  }
}

interface FrameList extends Window {
  [index: number]: Window;
}

function findRemoteFrame(name: string): Window | null {
  if (window.parent) {
    const frames = window.parent.frames as FrameList;

    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];

      try {
        if (frame.name === name) {
          return frame;
        }
      } catch (_) {
        // no-op
      }
    }
  }

  return null;
}
