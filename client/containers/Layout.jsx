import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { PureComponent } from 'react';
import { IntlProvider } from 'react-intl';
import { ChakraProvider } from '@chakra-ui/react';

export const UserContext = React.createContext(null);

import AppTabBar from '../reusables/AppTabBar';
import { notificationsCounter } from '../functions';
import { ActivityIndicator } from 'antd-mobile';

import messages from '../langs/en';

const routesWithTabBar = [
  '/',
  '/discover',
  '/my-shelf',
  '/messages',
  '/profile',
];

class Layout extends PureComponent {
  state = {};

  componentDidMount() {
    const { currentUser } = this.props;
    if (!currentUser || !currentUser.isIntroDone) {
      this.changeRoute('/intro');
    }
    this.setState({ isLoading: false });
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

    const pathname =
      history && history.location && history.location.pathname;
    const shouldRenderTabBar = this.shouldRenderTabBar();

    // if (userLoading) {
    //   return <ActivityIndicator toast text="Loading..." />;
    // }

    return (
      <IntlProvider locale="en" messages={messages}>
        <UserContext.Provider value={{ currentUser, userLoading }}>
          <ChakraProvider>
            {children}

            {shouldRenderTabBar && (
              <AppTabBar
                pathname={pathname}
                changeRoute={this.changeRoute}
                messageNotificationCount={this.getMessageNotificationCount()}
              />
            )}
          </ChakraProvider>
        </UserContext.Provider>
      </IntlProvider>
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
