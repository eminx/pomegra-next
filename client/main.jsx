import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import '../imports/startup/client/serviceWorker.js';

import 'antd-mobile/dist/antd-mobile.css';
import 'bulma/css/bulma.css';
import './main.css';

import App from './App';

Meteor.startup(() => {
  render(<App />, document.getElementById('react-target'));
});
