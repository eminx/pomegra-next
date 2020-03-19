import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import AppTabBar from '../reusables/AppTabBar';
import { notificationsCounter } from '../functions';

const routesWithTabBar = ['/', '/discover', '/my-shelf', '/messages'];

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

    return notificationsCounter(currentUser.notifications);
  };

  changeRoute = route => {
    const { history } = this.props;
    history.push(route);
  };

  render() {
    const { children, history } = this.props;
    const pathname = history && history.location && history.location.pathname;
    const shouldRenderTabBar = this.shouldRenderTabBar();

    return (
      <div>
        {children}
        <div style={{ width: '100%', height: 80 }} />
        {shouldRenderTabBar && (
          <AppTabBar
            pathname={pathname}
            changeRoute={this.changeRoute}
            messageNotificationCount={this.getMessageNotificationCount()}
          />
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
