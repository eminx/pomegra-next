import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TabBar, Badge } from 'antd-mobile';
import { GoHome, GoBook, GoCommentDiscussion, GoSearch } from 'react-icons/go';
import { FaRegUser } from 'react-icons/fa';

import { notificationsCounter } from '../../api/_utils/functions';
import { UserContext } from '../Layout';

const iconSize = 24;

const renderIconRoutes = (messageNotificationCount) => {
  const shownBadge = messageNotificationCount !== '0' && messageNotificationCount;

  return [
    {
      title: 'Home',
      path: '/',
      icon: <GoHome size={iconSize} />,
    },
    {
      title: 'Lend',
      path: '/lend',
      icon: <GoSearch size={iconSize} />,
    },
    {
      title: 'My Shelf',
      path: '/my-shelf',
      icon: <GoBook size={iconSize} />,
    },
    {
      title: 'Messages',
      path: '/messages',
      icon: (
        <Badge text={shownBadge}>
          <GoCommentDiscussion size={iconSize} />
        </Badge>
      ),
    },
    {
      title: 'My Account',
      path: '/profile',
      icon: <FaRegUser size={iconSize} />,
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
  const iconRoutes = renderIconRoutes(messageNotificationCount);

  return (
    <div
      style={{
        position: 'fixed',
        height: 50,
        width: '100%',
        bottom: 0,
        zIndex: 9,
        backgroundColor: '#fff',
      }}
    >
      <TabBar activeKey={pathname} onChange={(elem) => navigate(elem)}>
        {iconRoutes.map((icon, index) => (
          <TabBar.Item key={icon.path} title={icon.title} icon={icon.icon} />
        ))}
      </TabBar>
    </div>
  );
}

export default AppTabBar;
