import '../imports/startup/client/serviceWorker.js';

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import 'bulma/css/bulma.css';

import { renderRoutes } from './routes';

import './main.css';
import 'antd-mobile/dist/antd-mobile.css';

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('react-target'));
});
