import * as React from 'react'
import Auth from '../auth/Auth'

interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <div className="row m-auto">
        <div className="col-4"></div>
        <div className="col-4">
          <div className="card text-center">
            <div className="card-header">
              {' '}
              <h1>AMS</h1>
              Automobile Management System
            </div>
            <div className="card-body"></div>
            <button
              type="button"
              className="btn btn-danger m-4 max-width-100"
              onClick={this.onLogin}
            >
              Log in
            </button>
          </div>
        </div>
        <div className="col-4"></div>
      </div>
    )
  }
}
