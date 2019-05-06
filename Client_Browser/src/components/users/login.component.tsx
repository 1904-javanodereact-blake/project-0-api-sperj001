import React from 'react';
import { $user } from '../../streams/current-user.stream';
import { updateCurrentUser } from '../../streams/current-user.stream';
import { Subscription } from 'rxjs';
import { User } from '../../include/user';

interface ISignInState {
  username: string;
  password: string;
  errorMessage: string;
  currentUserSubscription?: Subscription;
  currentUser?: User;
}

export class Login extends React.Component<any, ISignInState> {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errorMessage: ''
    };
  }
  componentDidMount = async() => {
    console.log('I am running');
    const currentUserSubscription = $user.subscribe(async user => {
      if (user === null) {
        console.log('I have no user!');
        this.setState({
          currentUser: undefined
        });
        return;
      } else {
        console.log('i have a user');
        this.setState({
          currentUser: user
        });
      }
    });
    this.setState({
      currentUserSubscription
    });
  }
  componentWillUnmount() {
    this.state.currentUserSubscription && this.state.currentUserSubscription.unsubscribe();
  }
  submit = async (event) => {
    event.preventDefault();
    console.log('attempting to login');
    const credentials = {
      username: this.state.username,
      password: this.state.password
    };

    try {
      const resp = await fetch('http://localhost:8081/login', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(credentials),
        headers: {
          'content-type': 'application/json'
        }
      });
      console.log(resp);

      if (resp.status === 401) {
        this.setState({
          errorMessage: 'Invalid Credentials'
        });
      } else if (resp.status === 200) {
        console.log(resp.body);
        const body = await resp.json();
        updateCurrentUser(body);
        this.props.history.push('/home');
      } else if (resp.status === 400) {
        this.setState({
        errorMessage: 'Incorrect Username/Password'
        });
      }
      else {
        this.setState({
          errorMessage: 'Cannot Login At This Time'
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  updateUsername = (event) => {
    this.setState({
      username: event.target.value
    });
  }

  updatePassword = (event) => {
    this.setState({
      password: event.target.value
    });
  }

  render() {
    const { username, password, errorMessage } = this.state;
    return (
      <div>
        {!this.state.currentUser && <>
          <div className='Login'>
              <form className='form-signin' onSubmit={this.submit}>
                  <h1 className='Centered'>Please Sign In</h1>
                  <label htmlFor='inputUsername' className='sr-only'>Username</label>
                  <input type='text' id='inputUsername' name='username'
                  className='form-control' placeholder='Username'
                  required value={username} onChange={this.updateUsername} style={{width: '300px' }}/>
                  <label htmlFor='inputPassword' className='sr-only' >Password</label>
                  <input type='password' id='inputPassword' name='password'
                  className='form-control' placeholder='Password'
                  required value={password} onChange={this.updatePassword} style={{width: '300px' }}/>

                  <button className='btn btn-lg btn-primary btn-block' type='submit' style={{width: '300px' }}>Sign in</button>
                  <p id='login-error'>{errorMessage}</p>
              </form>
          </div>
        </>}
      </div>
    );
  }
}