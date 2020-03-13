import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import { renderRoutes } from './routes';

import './main.css';
import 'antd-mobile/dist/antd-mobile.css';

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('react-target'));
});
