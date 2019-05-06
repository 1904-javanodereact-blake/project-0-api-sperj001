import React from 'react';
import { User } from '../../include/user';
import { UserCardComponent } from '../externals/user-card.component';
import { UserEditCardComponent } from '../externals/user-card.edit.component';


interface IState{
  TheUser: any
  InquireOn: number
  errorMessage: string
}

export class UserGetUpdate extends React.Component<any, IState> {

  constructor(props){
    super(props);
    this.state = {
      TheUser: User,
      InquireOn: 1,
      errorMessage: ""
    }
    this.findUser = this.findUser.bind(this);
    this.childUseFind = this.childUseFind.bind(this);
  }
  childUseFind = async () => {
    await this.findUser();
  }
  findUser = async() => {
    try{
      this.setState({errorMessage: ""});
      console.log(`i am ${this.state.InquireOn}`);
      const resp = await fetch(`http://localhost:8081/users/${this.state.InquireOn}`, {
        method: "GET",
        credentials: "include"
      });
      const body = await resp.json();
      let holdUser = (new User(body.userid, body.username, body.passkey, body.firstname, body.lastname, body.email, body.roledesc, body.img));    
      this.setState({
        TheUser: holdUser
      })
    }
    catch{
      this.setState({errorMessage: "Unable To Find User"});
    }
  }

  handleChange(event) {
    this.setState({InquireOn: event.target.value})
  }
  
  render() {
    return (
          <div className="App">
              <b className="App-title">Find/Update User</b>
              <br/> 
              <input ref="authorToGet" type="text" value={this.state.InquireOn} onChange={this.handleChange.bind(this)}></input>
              <button onClick={() => this.findUser()}>Get Specific User With ID</button>   
              <br></br>
              <p className="App-subtitle" id="login-error">{this.state.errorMessage}</p>
              <br></br>   
              <div className="row">
                  {this.state.TheUser.userid && <UserCardComponent key={this.state.TheUser.userid} TheUser={this.state.TheUser}/>}
                  {this.state.TheUser.userid && <UserEditCardComponent key={this.state.TheUser.userid + "-2"} TheUser={this.state.TheUser} childUseFind={this.childUseFind}/>}
              </div>
          </div>
    )
  }
}