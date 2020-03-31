import React, { Fragment } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import AppTabBar from '../reusables/AppTabBar';
import { notificationsCounter } from '../functions';
import { WhiteSpace } from 'antd-mobile';

const routesWithTabBar = [
  '/',
  '/discover',
  '/my-shelf',
  '/messages',
  '/profile'
];

class Layout extends React.Component {
  shouldRenderTabBar = () => {
    const { location } = this.props;
    if (!location || !location.pathname) {
      return false;
    }
    const pathname = location.pathname;
    return routesWithTabBar.some(route => route === pathname);
  };

  getMessageNotificationCount = () => {
    const { currentUser } = this.props;
    if (!currentUser) {
      return '0';
    }

    return notificationsCounter(currentUser.notifications).toString();
  };

  changeRoute = route => {
    const { history } = this.props;
    const pathname = history && history.location && history.location.pathname;
    if (pathname === route) {
      return;
    }
    history.push(route);
  };

  render() {
    const { currentUser, children, history } = this.props;
    const pathname = history && history.location && history.location.pathname;
    const shouldRenderTabBar = this.shouldRenderTabBar();

    if (!currentUser || !currentUser.isIntroDone) {
      this.changeRoute('/intro');
    }

    return (
      <div style={{ paddingBottom: 100 }}>
        {children}

        {shouldRenderTabBar && (
          <Fragment>
            <AppTabBar
              pathname={pathname}
              changeRoute={this.changeRoute}
              messageNotificationCount={this.getMessageNotificationCount()}
            />
            <WhiteSpace size={80} />
          </Fragment>
        )}
      </div>
    );
  }
}

export default LayoutContainer = withTracker(props => {
  const currentUserSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();
  const isLoading = !currentUserSub.ready();

  return {
    currentUser,
    isLoading
  };
})(Layout);
