import React from 'react';
import { Link } from 'react-router-dom';
import { Subscription } from 'rxjs';
import RevLogo from '../../assets/rev-logo.png';
import { $user } from '../../streams/current-user.stream';
import { User } from '../../include/user';


interface IState {
  InquireOn: boolean,
  currentUserSubscription?: Subscription,
  currentUser?: User
}
export class NavComponent extends React.Component<any, IState> {

  constructor(props) {
    super(props);
    this.state = {
      InquireOn: true
    }
    this.changeVisibility = this.changeVisibility.bind(this);
  }
  changeVisibility = () => {
    let toBe: boolean;
    toBe = !this.state.InquireOn;
    this.state = {
      InquireOn: toBe
    }
  }
  componentDidMount = () => {
    const currentUserSubscription = $user.subscribe(user => {
      if (user === null) {
        this.setState({
          currentUser: undefined
        })
        return;
      } else {
        this.setState({
          currentUser: user
        })
      }
    });
    this.setState({
      currentUserSubscription
    })
  }

  componentWillUnmount() {
    this.state.currentUserSubscription && this.state.currentUserSubscription.unsubscribe();
  }

  render() {
    return (
      <nav className="navbar navbar-toggleable-md navbar-expand-lg navbar-light bg-light display-front nav-pad">
        
        <div className="navbar-header c-pointer shift-left">
          <Link to="/home" className="unset-anchor">
            <img className="img-adjust-position rev-logo" src={RevLogo} alt="revature" /> 
          </Link>
          {this.state.currentUser && this.state.currentUser.username}
        </div>
        {this.state.currentUser && <>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample04" aria-controls="navbarsExample04" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarsExample04">
            <ul className="navbar-nav ml-auto margin-nav">
              <li className="nav-item active">
                <Link to="/logout" className="unset-anchor nav-link">Logout</Link>
                
              </li>
              <li className="nav-item active">
                <Link to="/home" className="unset-anchor nav-link">Home</Link>
              </li>
              <li className="nav-item active">
                <Link to="/users" className="unset-anchor nav-link">Users</Link>
              </li>
              <li className="nav-item active">
                <Link to="/reimbursements" className="unset-anchor nav-link">Reimbursements</Link>
              </li>
            </ul>
          </div>
        </>}
      </nav>
    );
  }
}