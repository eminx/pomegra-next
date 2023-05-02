import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge, Divider, TabBar } from 'antd-mobile';

import { notificationsCounter } from '../../api/_utils/functions';
import { UserContext } from '../Layout';
import Home from './icons/Home';
import Discover from './icons/Discover';
import Shelf from './icons/Shelf';
import Messages from './icons/Messages';
import Profile from './icons/Profile';

const iconSize = 24;

const renderIconRoutes = (messageNotificationCount, username) => {
  const shownBadge = messageNotificationCount !== '0' && messageNotificationCount;

  return [
    {
      title: 'Home',
      path: '/',
      icon: <Home />,
    },
    {
      title: 'Discover',
      path: '/discover',
      icon: <Discover />,
    },
    {
      title: 'My Shelf',
      path: '/my-shelf',
      icon: <Shelf />,
    },
    {
      title: 'Messages',
      path: '/messages',
      icon: <Messages />,
    },
    {
      title: 'My Profile',
      path: `/${username}`,
      icon: <Profile />,
    },
  ];
};

function AppTabBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useContext(UserContext);

  const { pathname } = location;

  const messageNotificationCount = currentUser?.notifications
    ? notificationsCounter(currentUser?.notifications)?.toString()
    : 0;
  const iconRoutes = renderIconRoutes(messageNotificationCount, currentUser?.username);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          height: 48,
          width: '100%',
          maxWidth: 768,
          bottom: 0,
          zIndex: 9,
          backgroundColor: '#fff',
        }}
      >
        <Divider style={{ marginBottom: 0, marginTop: 0 }} />
        <TabBar activeKey={pathname} onChange={(elem) => navigate(elem)}>
          {iconRoutes.map((icon, index) => (
            <TabBar.Item key={icon.path} icon={icon.icon} title={icon.title} />
          ))}
        </TabBar>
      </div>
    </>
  );
}

export default AppTabBar;
