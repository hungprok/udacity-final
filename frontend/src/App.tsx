import React, { Component } from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { EditItem } from './components/EditItem'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { ListItem } from './components/ListItem'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div className="main-content">
        <Router history={this.props.history}>
          {this.generateMenu()}
          {this.generateCurrentPage()}
        </Router>
      </div>
    )
  }

  generateMenu() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <div className="row justify-content-end mx-1">
          <div className="col-1">
            <div className="row justify-content-end">
              <button
                className="btn btn-primary mb-2 br-2"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseExample"
                aria-expanded="false"
                aria-controls="collapseExample"
              >
                Add new item
              </button>
            </div>
          </div>
          <div className="col-10"></div>
          <div className="col-1">
            <div className="row justify-content-end">
              <button
                className="btn btn-danger mb-2"
                name="logout"
                onClick={this.handleLogout}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return (
        <div className="login-card">
          <LogIn auth={this.props.auth} />{' '}
        </div>
      )
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={(props) => {
            return <ListItem {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/item/:itemId/edit"
          exact
          render={(props) => {
            return <EditItem {...props} auth={this.props.auth} />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}
