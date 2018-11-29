import * as React from 'react';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import {classNames} from '@shopify/react-utilities/styles';
import {
  Button as AppBridgeButton,
  TitleBar as AppBridgeTitleBar,
} from '@shopify/app-bridge/actions';

import {
  transformActions,
  generateRedirect,
} from '../../utilities/app-bridge-transformers';
import {withAppProvider, WithAppProviderProps} from '../AppProvider';

import {Header, HeaderProps} from './components';
import * as styles from './Page.scss';

export interface Props extends HeaderProps {
  /** The contents of the page */
  children?: React.ReactNode;
  /** Remove the normal max-width on the page */
  fullWidth?: boolean;
  /** Decreases the maximum layout width. Intended for single-column layouts */
  singleColumn?: boolean;
  /** Force render of title and breadcrumbs in page on embedded app, default false */
  forceRenderTitle?: boolean;
  /** Force render of page actions in page on embedded app, default false */
  forceRenderActions?: boolean;
}

export type ComposedProps = Props & WithAppProviderProps;

const APP_BRIDGE_PROPS: (keyof Props)[] = [
  'title',
  'breadcrumbs',
  'secondaryActions',
  'actionGroups',
  'primaryAction',
];

export class Page extends React.PureComponent<ComposedProps, never> {
  private titlebar: AppBridgeTitleBar.TitleBar | undefined;

  componentDidMount() {
    if (this.props.polaris.appBridge == null) {
      return;
    }

    this.titlebar = AppBridgeTitleBar.create(
      this.props.polaris.appBridge,
      this.transformProps(),
    );
  }

  componentDidUpdate(prevProps: ComposedProps) {
    if (this.props.polaris.appBridge == null || this.titlebar == null) {
      return;
    }

    const prevAppBridgeProps = pick(prevProps, APP_BRIDGE_PROPS);
    const currentAppBridgeProps = pick(this.props, APP_BRIDGE_PROPS);

    if (!isEqual(prevAppBridgeProps, currentAppBridgeProps)) {
      this.titlebar.unsubscribe();
      this.titlebar.set(this.transformProps());
    }
  }

  componentWillUnmount() {
    if (this.props.polaris.appBridge == null || this.titlebar == null) {
      return;
    }

    this.titlebar.unsubscribe();
  }

  render() {
    const {children, fullWidth, singleColumn} = this.props;

    const className = classNames(
      styles.Page,
      fullWidth && styles.fullWidth,
      singleColumn && styles.singleColumn,
    );

    const headerProps = this.headerProps;
    const headerMarkup = headerProps ? <Header {...headerProps} /> : null;

    return (
      <div className={className}>
        {headerMarkup}
        <div className={styles.Content}>{children}</div>
      </div>
    );
  }

  private get headerProps(): HeaderProps | undefined {
    const {
      children,
      fullWidth,
      singleColumn,
      polaris: {appBridge},
      forceRenderTitle = false,
      forceRenderActions = false,
      title,
      primaryAction,
      secondaryActions,
      actionGroups,
      breadcrumbs,
      ...rest
    } = this.props;

    const hasHeaderTitle =
      title != null && title !== '' && (appBridge ? forceRenderTitle : true);

    const hasHeaderActions =
      (primaryAction != null ||
        (secondaryActions != null && secondaryActions.length > 0) ||
        (actionGroups != null && actionGroups.length > 0)) &&
      (appBridge ? forceRenderActions : true);

    const hasHeaderBreadcrumbs =
      breadcrumbs != null &&
      breadcrumbs.length > 0 &&
      (appBridge ? forceRenderTitle : true);

    if (!hasHeaderTitle && !hasHeaderActions && !hasHeaderBreadcrumbs) {
      return undefined;
    }

    return {
      ...rest,
      title: hasHeaderTitle ? title : '',
      primaryAction: hasHeaderActions ? primaryAction : undefined,
      secondaryActions: hasHeaderActions ? secondaryActions : undefined,
      actionGroups: hasHeaderActions ? actionGroups : undefined,
      breadcrumbs: hasHeaderBreadcrumbs ? breadcrumbs : undefined,
    };
  }

  private transformProps(): AppBridgeTitleBar.Options {
    const {appBridge} = this.props.polaris;
    const {
      title,
      primaryAction,
      secondaryActions,
      actionGroups,
      forceRenderTitle = false,
      forceRenderActions = false,
    } = this.props;

    return {
      title: forceRenderTitle ? undefined : title,
      buttons: forceRenderActions
        ? undefined
        : transformActions(appBridge, {
            primaryAction,
            secondaryActions,
            actionGroups,
          }),
      breadcrumbs: forceRenderTitle ? undefined : this.transformBreadcrumbs(),
    };
  }

  private transformBreadcrumbs(): AppBridgeButton.Button | undefined {
    const {appBridge} = this.props.polaris;
    const {breadcrumbs} = this.props;

    if (breadcrumbs != null && breadcrumbs.length > 0) {
      const breadcrumb = breadcrumbs[breadcrumbs.length - 1];
      const button = AppBridgeButton.create(appBridge, {
        label: breadcrumb.content || '',
      });

      const callback = !('url' in breadcrumb)
        ? breadcrumb.onAction
        : generateRedirect(appBridge, breadcrumb.url, breadcrumb.target);

      if (callback != null) {
        button.subscribe(AppBridgeButton.Action.CLICK, callback);
      }

      return button;
    } else {
      return undefined;
    }
  }
}

export default withAppProvider<Props>()(Page);
