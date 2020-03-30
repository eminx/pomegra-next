import React from 'react';
import { Switch, Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import Layout from './containers/Layout';
import AccountManagerContainer from './containers/AccountManagerContainer';
import AddBookContainer from './containers/AddBookContainer';
import MyBooksContainer from './containers/MyBooksContainer';
import MyBookContainer from './containers/MyBookContainer';
import FindContainer from './containers/FindContainer';
import BookDetailTobeRequested from './containers/BookDetailTobeRequested';
import RequestsList from './containers/RequestsList';
import RequestContainer from './containers/RequestContainer';
import ProfileContainer from './containers/ProfileContainer';
import IntroContainer from './IntroContainer';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Switch>
      <Layout history={browserHistory}>
        <Route exact path="/" component={AccountManagerContainer} />
        <Route exact path="/add" component={AddBookContainer} />
        <Route exact path="/my-shelf" component={MyBooksContainer} />
        <Route exact path="/my-book/:id" component={MyBookContainer} />

        <Route exact path="/discover" component={FindContainer} />
        <Route exact path="/book/:id" component={BookDetailTobeRequested} />

        <Route exact path="/messages" component={RequestsList} />
        <Route exact path="/request/:id" component={RequestContainer} />

        <Route exact path="/profile" component={ProfileContainer} />
        <Route exact path="/intro" component={IntroContainer} />
      </Layout>
    </Switch>
  </Router>
);
