import React from 'react';
import { Reimbursement } from '../../include/reimbursement';
import { ReimbursementCreateCardComponent } from '../externals/reimbursement-card.create.component';


interface IState{
  TheReimbursement: any,
}

export class ReimbursementCreate extends React.Component<any, IState> {

  constructor(props){
    super(props);
    this.state = {
        TheReimbursement: Reimbursement
    }
  }

  sendReimbursement = (react:string) => async() => {
    this.render();
  }

  
  render() {
    return (
        <div className="App">
        <b className="App-title">Create A Reimbursements</b>    
            <div className="row">
              {
                (<ReimbursementCreateCardComponent key={this.state.TheReimbursement.reimbursementId} TheReimbursement={this.state.TheReimbursement} History={this.props.history}/>)
              }
            </div>
        </div>
    )
  }
}