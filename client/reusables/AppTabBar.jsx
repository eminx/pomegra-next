import React, { Component } from 'react';
import { TabBar, Icon } from 'antd-mobile';
import { withRouter } from 'react-router-dom';
import { AiOutlineMessage, AiFillMessage } from 'react-icons/ai';
import { FaRegUser, FaUserAlt } from 'react-icons/fa';
import { GiBookshelf } from 'react-icons/gi';
import { IoIosSearch } from 'react-icons/io';

class AppTabBar extends Component {
  changeRoute = route => {
    this.props.history.push(route);
  };

  render() {
    const { history } = this.props;
    const pathname = history && location.pathname;

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
            icon={<GiBookshelf />}
            selectedIcon={<GiBookshelf />}
            selected={pathname === '/my-books'}
            onPress={() => this.changeRoute('/my-books')}
          ></TabBar.Item>

          <TabBar.Item
            key="search"
            title="Search"
            icon={<IoIosSearch />}
            selectedIcon={<IoIosSearch />}
            selected={pathname === '/search'}
            onPress={() => this.changeRoute('/search')}
          ></TabBar.Item>

          <TabBar.Item
            key="messages"
            title="Messages"
            icon={<AiOutlineMessage />}
            selectedIcon={<AiFillMessage />}
            selected={pathname === '/requests'}
            onPress={() => this.changeRoute('/requests')}
          ></TabBar.Item>

          <TabBar.Item
            key="my-profile"
            title="My Profile"
            icon={<FaRegUser />}
            selectedIcon={<FaUserAlt />}
            selected={pathname === '/my-profile'}
            onPress={() => this.changeRoute('/my-profile')}
          ></TabBar.Item>
        </TabBar>
      </div>
    );
  }
}

export default withRouter(AppTabBar);
