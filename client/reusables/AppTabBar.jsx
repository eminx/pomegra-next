import React, { Component } from 'react';
import { TabBar, Icon } from 'antd-mobile';

class AppTabBar extends Component {
  render() {
    return (
      <div style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
        >
          <TabBar.Item
            key="my-books"
            title="My Books"
            icon={<Icon type="book" />}
          ></TabBar.Item>
          <TabBar.Item
            key="search"
            title="Search"
            icon={<Icon type="search" />}
          ></TabBar.Item>
          <TabBar.Item
            key="messages"
            icon={<Icon type="like" />}
            title="Messages"
          ></TabBar.Item>
          <TabBar.Item
            key="my-profile"
            icon={<Icon type="adduser" />}
            title="My Profile"
          ></TabBar.Item>
        </TabBar>
      </div>
    );
  }
}

export default AppTabBar;
