import React from 'react';
import { Link } from 'react-router-dom';

export class Users extends React.Component {

  render() {
    return (
      <div className="App">
            <b className="App-title">Users Page</b>
            <p>------------</p>            
            <button><Link to="/UsersViewAll">View All Users</Link></button> 
            <p>------------</p>
            <button><Link to="/UserGetUpdate">Get/Update A User By ID</Link></button>
        </div>
    )
  }
}