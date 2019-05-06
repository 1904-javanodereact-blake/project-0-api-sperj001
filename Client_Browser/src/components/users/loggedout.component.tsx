import React from 'react';
import { $user, updateCurrentUser } from '../../streams/current-user.stream';
import { isNullOrUndefined } from 'util';



export class Logout extends React.Component<any, any> {

  constructor(props){
    super(props);
    this.state = {
      
    }
  }
  
  componentDidMount = async() => {
    try {
        const resp = await fetch('http://localhost:8081/login/out', {
            method: 'GET', 
            credentials: "include"
        });
        console.log(resp);
  
        if (resp.status === 401) {
          this.setState({
            errorMessage: 'Invalid Credentials'
          });
        } else if (resp.status === 200) {
          // redirect to home page
          // const user = await resp.json();
          const currentUserSubscription = $user.subscribe(async user => {
            if (user === null) {
              console.log("I have no user!");
            } else {
              console.log("i have a user");
              this.setState({
                currentUser: user
              });
            }
          });
          this.setState({
            currentUserSubscription
          })
          updateCurrentUser(null);
          this.props.history.push("/");
        } else {
          this.setState({
            errorMessage: 'Cannot Login At This Time'
          });
          this.props.history.push("/");
        }
      } catch (err) {
        console.log(err);
        this.props.history.push("/");
      }
  }

  render() {
    return (
        <div className="App">
            <b>Logged Out Successfully</b>
            <p>------------</p>
        </div>
    )
  }
}