import React from 'react';
import { User } from '../include/user';
import { UserCardComponent } from './externals/user-card.component';

interface IState{
  myUser: any
}

export class Home extends React.Component<any, IState> {

  constructor(props){
    super(props);
    this.state = {
      myUser: User
    }
  }

  componentDidMount = async() => {
    try {
        const resp = await fetch(`http://localhost:8081/login/check`, {
          credentials: "include"
        });
        const res = await resp.json();
        console.log(res);
        this.setState({
          myUser: res
        })
    } 
    catch {
      console.log("User is not logged in");
      this.setState ({
        myUser: User
      })
    }
  }

  render() {
    return (
      <div className="App">
        <h1 className="App-title">
          ~Welcome~
        </h1>
        <div className="Centered">
          {this.state.myUser.firstname && <UserCardComponent key={this.state.myUser.userid} TheUser={this.state.myUser}></UserCardComponent>}
        </div>
    </div>
    )
  }
}