import React from 'react';
import { NavBar, Icon } from 'antd-mobile';

class Layout extends React.Component {
  render() {
    const { children, currentUser } = this.props;

    return <div>{children}</div>;
  }
}

export default Layout;
