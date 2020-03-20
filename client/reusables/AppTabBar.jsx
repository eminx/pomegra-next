import React, { Component } from 'react';
import { TabBar, Badge } from 'antd-mobile';
import { GoHome, GoBook, GoCommentDiscussion, GoSearch } from 'react-icons/go';

const iconSize = 24;

const renderIconRoutes = messageNotificationCount => {
  const shownBadge =
    messageNotificationCount !== '0' && messageNotificationCount;

  return [
    {
      title: 'Home',
      path: '/',
      icon: <GoHome size={iconSize} />
    },
    {
      title: 'Discover',
      path: '/discover',
      icon: <GoSearch size={iconSize} />
    },
    {
      title: 'My Shelf',
      path: '/my-shelf',
      icon: <GoBook size={iconSize} />
    },
    {
      title: 'Messages',
      path: '/messages',
      icon: (
        <Badge text={shownBadge}>
          <GoCommentDiscussion size={iconSize} />
        </Badge>
      )
    }
  ];
};

class AppTabBar extends Component {
  render() {
    const { pathname, messageNotificationCount, changeRoute } = this.props;

    const iconRoutes = renderIconRoutes(messageNotificationCount);

    return (
      <div
        style={{
          position: 'fixed',
          height: 50,
          width: '100%',
          bottom: 0,
          zIndex: 9
        }}
      >
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#4b4b4b"
          barTintColor="white"
        >
          {iconRoutes.map((icon, index) => (
            <TabBar.Item
              key={icon.path}
              title={icon.title}
              icon={icon.icon}
              selectedIcon={icon.icon}
              selected={pathname === icon.path}
              onPress={() => changeRoute(icon.path)}
            />
          ))}
        </TabBar>
      </div>
    );
  }
}

export default AppTabBar;
