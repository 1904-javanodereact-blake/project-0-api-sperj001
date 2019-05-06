import React from 'react';
import { Link } from 'react-router-dom';


interface IState{
  Author: number;
}

export class Reimbursements extends React.Component<any, IState> {

  constructor(props){
    super(props);
    this.state = {
      Author: NaN
    }
  }


  render() {
    return (
        <div className="App">
            <b className="App-title">Reimbursements Page</b>
            <p>------------</p>            
            <button><Link to="/reimbursementAuthor">Reimbursements By Author</Link></button> 
            <p>------------</p>
            <button><Link to="/reimbursementStatus">Reimbursements By Status</Link></button>
            <p>------------</p>
            <button><Link to="/reimbursementCreate">Create A Reimbursement</Link></button>
            <p>------------</p>
            <button><Link to="/reimbursementUpdate">Update A Reimbursement</Link></button>
        </div>
    )
  }
}