import React from 'react';
import { Switch, Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import BooksContainer from '../imports/containers/BooksContainer';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => {
  return (
    <Router history={browserHistory}>
      <Switch>
        <Route path="/" component={BooksContainer} />
      </Switch>
    </Router>
  );
};
