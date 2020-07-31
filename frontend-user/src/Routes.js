import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import BookingReview from './containers/BookingReview';
import BookingPayment from './containers/BookingPayment';

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/payments">
        <BookingReview />
      </Route>
      <Route exact path="/payments/checkout">
        <BookingPayment />
      </Route>
    </Switch>
  );
}
