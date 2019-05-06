import React from 'react';
import { Reimbursement } from '../../include/reimbursement';

interface IReimburseCardProps {
  TheReimbursement: Reimbursement;
  History;
}
interface IState {
  MyType: string;
  MyDescription: string;
  MyAmount: number;
}

  export class ReimbursementCreateCardComponent extends React.Component<IReimburseCardProps, IState> {
    constructor(props) {
      super(props);
      this.state = {
        MyType: 'Other',
        MyDescription:  ' ',
        MyAmount: 0
      };
    }
    handleTypeChange(event) {
      this.setState({MyType: event.target.value});
    }
    handleDescChange(event) {
      this.setState({MyDescription: event.target.value});
    }
    handleAmountChange(event) {
      this.setState({MyAmount: event.target.value});
    }
    updateReimbursement = async() => {
      const aReburse = {
        amount: this.state.MyAmount,
        description: this.state.MyDescription,
        type: this.state.MyType
      };
      const resp = await fetch(`http://localhost:8081/reimbursements/create`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(aReburse),
      headers: {
        'content-type': 'application/json'
      }
      });
      const results = await resp;
      console.log(results.status);
      if (results.status == 200) {
        this.props.History.push('/CreatedReimbursement');
      }
      else {
        console.log('Failure');
      }
    }
    render() {
      const reburse = this.props.TheReimbursement;
      return (
        <div key={'Reimbursement-' + reburse.reimbursementId} className='card col-md-4 col-sm-6 col-xs-12'>
          <div className='card-body'>
            <h5 className='card-title'>Reimbursement Number: {reburse.reimbursementId}</h5>
          </div>
          <div>
          <img src='https://media.giphy.com/media/ko/giphy.gif'
            className='card-img-top'
            alt='...' />
          </div>
            <ul className='list-group list-group-flush'>
            <li className='list-group-item'>Amount: <input defaultValue={(this.state.MyAmount).toString()} type='number' onChange={this.handleAmountChange.bind(this)}></input></li>
              <li className='list-group-item'>Description: <input defaultValue={this.state.MyDescription} onChange={this.handleDescChange.bind(this)}></input></li>
              <li className='list-group-item'>Type: <select value={this.state.MyType} onChange={this.handleTypeChange.bind(this)}>
                  <option value='City/Castle'>City/Castle</option>
                  <option value='War Efforts'>War Efforts</option>
                  <option value='Religious'>Religious</option>
                  <option value='Other'>Other</option>
                </select></li>
            </ul>
            <br></br>
            <button className='btn btn-danger' onClick={this.updateReimbursement}>Create</button>
            <br>
          </br>
        </div>
      )
    }
  }