import React, { Component } from 'react';
import { TabBar } from 'antd-mobile';
import { withRouter } from 'react-router-dom';
import { GiBookshelf } from 'react-icons/gi';
import { GoHome, GoBook, GoCommentDiscussion, GoSearch } from 'react-icons/go';

const iconSize = 24;

const iconRoutes = [
  {
    title: 'Home',
    path: '/',
    icon: <GoHome size={iconSize} />
  },
  {
    title: 'My Shelf',
    path: '/my-shelf',
    icon: <GoBook size={iconSize} />
  },
  {
    title: 'Discover',
    path: '/discover',
    icon: <GoSearch size={iconSize} />
  },
  {
    title: 'Messages',
    path: '/messages',
    icon: <GoCommentDiscussion size={iconSize} />
  }
];

class AppTabBar extends Component {
  changeRoute = route => {
    this.props.history.push(route);
  };

  render() {
    const { history } = this.props;
    const pathname = history && location.pathname;

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
              onPress={() => this.changeRoute(icon.path)}
            />
          ))}
        </TabBar>
      </div>
    );
  }
}

export default withRouter(AppTabBar);
