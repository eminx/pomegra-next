import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

// Import F7 Bundle
import Framework7 from 'framework7/framework7-lite.esm.bundle.js';
// Import F7-React Plugin
import Framework7React from 'framework7-react';
// Init F7-React Plugin
Framework7.use(Framework7React);

import 'framework7/css/framework7.bundle.min.css';
import './main.css';
import 'framework7-icons';

import F7App from './containers/App';

Meteor.startup(() => {
  render(React.createElement(F7App), document.getElementById('react-target'));
});
