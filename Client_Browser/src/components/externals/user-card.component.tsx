import React from "react";
import { User } from "../../include/user";

interface IUserCardProps
 {
    TheUser: User;
  }
  
  export class UserCardComponent extends React.PureComponent<IUserCardProps> {
    render() {
      const myuser = this.props.TheUser;
      return (
        <div key={'User-' + myuser.userid} className="card col-md-4 col-sm-6 col-xs-12">
          <div className="card-body">
            <h5 className="card-title">Name: {myuser.firstname + " " + myuser.lastname}</h5>
          </div>
          <div>
            {console.log(this.props.TheUser)}
          <img src={this.props.TheUser.img}
            className="card-img-top"
            alt="..." />
            </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">User ID: {myuser.userid}</li>
            <li className="list-group-item">First Name: {myuser.firstname}</li>
            <li className="list-group-item">Last Name: {myuser.lastname}</li>
            <li className="list-group-item">User Name: {myuser.username}</li>
            <li className="list-group-item">Password: {myuser.passkey}</li>
            <li className="list-group-item">Email: {myuser.email}</li>
            <li className="list-group-item">Role: {myuser.givenrole}</li>
            
          </ul>
          <br>
          </br>
          
        </div>
        
      )
    }
  }