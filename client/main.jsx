import '../imports/startup/client/serviceWorker.js';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import 'bulma/css/bulma.css';

import App from './App';

import './main.css';
import 'antd-mobile/dist/antd-mobile.css';

Meteor.startup(() => {
  render(<App />, document.getElementById('react-target'));
});
