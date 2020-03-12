import React from 'react';
import { Switch, Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Layout from './containers/Layout';

// route components
// import HomeContainer from './HomeContainer';

// import BookingContainer from './bookings/BookingContainer';
// import NewBookSpaceContainer from './bookings/NewBookSpaceContainer';
// import EditBookingContainer from './bookings/EditBookingContainer';

// import ScrollToTop from './ScrollToTop';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Switch>
      <Layout history={browserHistory}>
        {/* <ScrollToTop>
          <Route exact path="/" component={HomeContainer} />
          <Route exact path="/calendar" component={CalendarContainer} />

          <Route exact path="/new-booking" component={NewBookSpaceContainer} />
          <Route path="/event/:id" component={BookingContainer} />
          <Route path="/booking/:id" component={BookingContainer} />
          <Route path="/edit-booking/:id/" component={EditBookingContainer} />
        </ScrollToTop> */}
      </Layout>
    </Switch>
  </Router>
);
