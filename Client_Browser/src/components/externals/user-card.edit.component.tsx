import React from "react";
import { User } from "../../include/user";

interface IUserCardProps
 {
    TheUser: User;
    childUseFind
  }
interface IState{
  MyUserName: string
  MyPassword: string
  MyEmail: string
  MyRole: string
  MyFirstName: string
  MyLastName: string
}
  export class UserEditCardComponent extends React.Component<IUserCardProps, IState> {
    constructor(props){
      super(props);
      this.state = {
        MyUserName: this.props.TheUser.username,
        MyPassword: this.props.TheUser.passkey,
        MyEmail: this.props.TheUser.email,
        MyRole: this.props.TheUser.givenrole,
        MyFirstName: this.props.TheUser.firstname,
        MyLastName: this.props.TheUser.lastname
      }
    }
    callParentFunctionality = () => {
      console.log("Calling parent functionality");
      this.props.childUseFind();
    }
    handleUserNameChange(event){
      this.setState({MyUserName: event.target.value});
    }
    handlePasswordChange(event){
      this.setState({MyPassword: event.target.value});
    }
    handleEmailChange(event){
      this.setState({MyEmail: event.target.value});
    }
    handleRoleChange(event){
      this.setState({MyRole: event.target.value});
    }
    handleFirstNameChange(event){
      this.setState({MyFirstName: event.target.value});
    }
    handleLastNameChange(event){
      this.setState({MyLastName: event.target.value});
    }
    updateUser = async() => {
      console.log("Printing the user to view");
      let aUser = new User(this.props.TheUser.userid, this.state.MyUserName, this.state.MyPassword, this.state.MyFirstName, this.state.MyLastName, this.state.MyEmail, this.state.MyRole, this.props.TheUser.img);
      console.log(aUser);
      const resp = await fetch(`http://localhost:8081/users/update`, {
      method: "PATCH", 
      credentials: "include",
      body: JSON.stringify(aUser),
      headers: {
        'content-type': 'application/json'
      }
      });
      const results = await resp;
      console.log(results);
      console.log('attempting to reload');
      await this.callParentFunctionality();
    }
    render() {
      const myuser = this.props.TheUser;
      return (
        <div key={'User-' + myuser.userid} className="card col-md-4 col-sm-6 col-xs-12">
          <div className="card-body">
            <h5 className="card-title">Name: {myuser.firstname + " " + myuser.lastname}</h5>
          </div>
          <div>
          <img src={this.props.TheUser.img}
            className="card-img-top"
            alt="..." />
            </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">User ID: {myuser.userid}</li>
            <li className="list-group-item">First Name: <input defaultValue={this.state.MyFirstName} onChange={this.handleFirstNameChange.bind(this)}></input></li>
            <li className="list-group-item">Last Name: <input defaultValue={this.state.MyLastName} onChange={this.handleLastNameChange.bind(this)}></input></li>
            <li className="list-group-item">User Name: <input defaultValue={this.state.MyUserName} onChange={this.handleUserNameChange.bind(this)}></input></li>
            <li className="list-group-item">Password: <input defaultValue={this.state.MyPassword} onChange={this.handlePasswordChange.bind(this)}></input></li>
            <li className="list-group-item">Email: <input defaultValue={this.state.MyEmail} onChange={this.handleEmailChange.bind(this)}></input></li>
            <li className="list-group-item">Role: <select value={this.state.MyRole} onChange={this.handleRoleChange.bind(this)}>
                  <option value="admin">admin</option>
                  <option value="finance-manager">finance-manager</option>
                  <option value="employee">employee</option>
                  <option value="guest">guest</option>
                </select>
              </li>
          </ul>
          <button className="btn btn-danger" onClick={this.updateUser}>Update</button>
          <br>
          
          </br>
        </div>
      )
    }
  }