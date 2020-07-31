import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { withRouter, Switch, Redirect } from "react-router-dom";
import AdminLayout from "layouts/Admin.jsx";
import Login from 'views/login/Login';
import AuthenticatedRoute from "components/Routes/AuthenticatedRoute";
import UnauthenticatedRoute from "components/Routes/UnauthenticatedRoute";
import { onError } from 'libs/errorLib';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    };
  }

  async componentDidMount() {
    try {
      if (await Auth.currentSession()) {
        this.userHasAuthenticated(true);
      }
    }
    catch(e) {
      if (e !== 'No current user') {
        onError(e);
      }
    }

    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };

    return (
      !this.state.isAuthenticating &&
      <div className="App">
        <Switch>
          <AuthenticatedRoute path="/admin" component={AdminLayout} props={childProps} />
          <UnauthenticatedRoute exact path="/login" component={Login} props={childProps} />
          <Redirect from="/" to="/admin/dashboard" />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
