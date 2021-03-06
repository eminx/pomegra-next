import React from 'react';
import { Switch, Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Grommet } from 'grommet';

import Layout from './containers/Layout';
import Home from './containers/Home';
import AddBook from './containers/AddBook';
import MyBooks from './containers/MyBooks';
import MyBook from './containers/MyBook';
import Discover from './containers/Discover';
import BookDetailTobeRequested from './containers/BookDetailTobeRequested';
import RequestsList from './containers/RequestsList';
import RequestContainer from './containers/RequestContainer';
import Profile from './containers/Profile';
import Intro from './containers/Intro';
import ResetPasswordPage from './containers/auth/ResetPasswordPage';
import ForgotPasswordPage from './containers/auth/ForgotPasswordPage';

const browserHistory = createBrowserHistory();

function Routes() {
  return (
    <Router history={browserHistory}>
      <Switch>
        <Layout history={browserHistory}>
          <Route exact path="/" component={Home} />
          <Route exact path="/add" component={AddBook} />
          <Route exact path="/my-shelf" component={MyBooks} />
          <Route exact path="/my-book/:id" component={MyBook} />
          <Route exact path="/discover" component={Discover} />
          <Route exact path="/messages" component={RequestsList} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/intro" component={Intro} />

          <Route
            exact
            path="/forgot-password"
            component={ForgotPasswordPage}
          />
          <Route
            path="/reset-password/:token"
            component={ResetPasswordPage}
          />

          <Route
            exact
            path="/book/:id"
            component={BookDetailTobeRequested}
          />
          <Route
            exact
            path="/request/:id"
            component={RequestContainer}
          />
        </Layout>
      </Switch>
    </Router>
  );
}

export default function App() {
  return (
    <Grommet plain>
      <Routes />
    </Grommet>
  );
}
