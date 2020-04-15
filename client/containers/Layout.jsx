import React, { Fragment } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

export const UserContext = React.createContext(null);

import AppTabBar from '../reusables/AppTabBar';
import { notificationsCounter } from '../functions';
import { ActivityIndicator } from 'antd-mobile';

const routesWithTabBar = [
  '/',
  '/discover',
  '/my-shelf',
  '/messages',
  '/profile',
];

class Layout extends React.Component {
  state = {
    isLoading: true,
  };

  componentDidMount() {
    setTimeout(() => {
      const { currentUser } = this.props;
      if (!currentUser || !currentUser.isIntroDone) {
        this.changeRoute('/intro');
      }
      this.setState({ isLoading: false });
    }, 3000);
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentUser } = this.props;
    if (!prevProps.currentUser && currentUser) {
      this.setState({
        isLoading: false,
      });
      return;
    }
  }

  shouldRenderTabBar = () => {
    const { location } = this.props;
    if (!location || !location.pathname) {
      return false;
    }
    const pathname = location.pathname;
    return routesWithTabBar.some((route) => route === pathname);
  };

  getMessageNotificationCount = () => {
    const { currentUser } = this.props;
    if (!currentUser) {
      return '0';
    }

    return notificationsCounter(currentUser.notifications).toString();
  };

  changeRoute = (route) => {
    const { history } = this.props;
    const pathname =
      history && history.location && history.location.pathname;
    if (pathname === route) {
      return;
    }
    history.push(route);
  };

  render() {
    const {
      currentUser,
      userLoading,
      history,
      children,
    } = this.props;
    const { isLoading } = this.state;

    const pathname =
      history && history.location && history.location.pathname;
    const shouldRenderTabBar = this.shouldRenderTabBar();

    if (isLoading) {
      return <ActivityIndicator toast text="Loading..." />;
    }

    return (
      <UserContext.Provider value={{ currentUser, userLoading }}>
        <div>
          {children}

          {shouldRenderTabBar && (
            <Fragment>
              <AppTabBar
                pathname={pathname}
                changeRoute={this.changeRoute}
                messageNotificationCount={this.getMessageNotificationCount()}
              />
            </Fragment>
          )}
        </div>
      </UserContext.Provider>
    );
  }
}

export default LayoutContainer = withTracker((props) => {
  const currentUserSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();
  const userLoading = !currentUserSub.ready();

  return {
    currentUser,
    userLoading,
  };
})(Layout);
