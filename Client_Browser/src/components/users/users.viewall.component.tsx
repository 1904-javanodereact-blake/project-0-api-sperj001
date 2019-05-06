import React from 'react';
import { Reimbursement } from '../../include/reimbursement';
import { ReimbursementCardComponent } from '../externals/reimbursement-card.component';
import { User } from '../../include/user';
import { UserCardComponent } from '../externals/user-card.component';


interface IState{
  TheUsers: User[]
}

export class UsersViewAll extends React.Component<any, IState> {

  constructor(props){
    super(props);
    this.state = {
      TheUsers: []
    }
  }

  componentDidMount = async() => {
    const resp = await fetch(`http://localhost:8081/users`, {
        method: "GET",
        credentials: "include"
    });
    const body = await resp.json();
    console.log(body);
    let setRay = new Array();
    for(let i = 0; i < body.length; i++){
      setRay[i] = new User(parseFloat(body[i].userid), body[i].username, body[i].passkey, body[i].firstname, body[i].lastname, body[i].email, body[i].roledesc, body[i].img);
    }
    this.setState({ 
      TheUsers: setRay
      
    })
    console.log(this.state.TheUsers);
    console.log("displaying all users here");
  }

  render() {
    return (
        <div className="App">
            <b className="App-title">View All Users Page</b>
            <br/>
            <div className="row">
            {this.state.TheUsers.map(TheUser => (
                <UserCardComponent key={TheUser.userid} TheUser={TheUser}/>
              ))}
            </div>
        </div>
    )
  }
}