import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from './routes';
import { App, View } from 'framework7-react';

// Import F7 Bundle
import Framework7 from 'framework7/framework7-lite.esm.bundle.js';
// Import F7-React Plugin
import Framework7React from 'framework7-react';
// Init F7-React Plugin
Framework7.use(Framework7React);

import 'framework7/css/framework7.bundle.min.css';

Meteor.startup(() => {
  render(
    <App params={{ theme: 'auto', name: 'Pomegra', id: 'com.pomegra.test' }}>
      <View main>{renderRoutes()}</View>
    </App>,
    document.getElementById('react-target')
  );
});
