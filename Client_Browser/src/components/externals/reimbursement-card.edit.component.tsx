import React from "react";
import { Reimbursement } from "../../include/reimbursement";

interface IReimburseCardProps
{
  TheReimbursement: Reimbursement;
  childUseFind
}
interface IState{
  MyStatus: string
  MyType: string
  MyDescription: string
  MyAmount: number
}

  export class ReimbursementEditCardComponent extends React.Component<IReimburseCardProps, IState> {
    constructor(props){
      super(props);
      this.state = {
        MyStatus: this.props.TheReimbursement.status,
        MyType: this.props.TheReimbursement.type,
        MyDescription:  this.props.TheReimbursement.description,
        MyAmount: this.props.TheReimbursement.amount
      }
    }
    callParentFunctionality = () => {
      console.log("Calling parent functionality");
      this.props.childUseFind();
    }
    handleStatusChange(event) {
      this.setState({MyStatus: event.target.value});
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
    updateReimbursement= async() => {
      let aReburse = new Reimbursement(this.props.TheReimbursement.reimbursementId, this.props.TheReimbursement.author, this.state.MyAmount, this.props.TheReimbursement.dateSubmitted, (new Date().getTime()).toString(), this.state.MyDescription, this.props.TheReimbursement.resolver, this.state.MyStatus, this.state.MyType, this.props.TheReimbursement.img);
      const resp = await fetch(`http://localhost:8081/reimbursements/update`, {
      method: "PATCH", 
      credentials: "include",
      body: JSON.stringify(aReburse),
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
      const reburse = this.props.TheReimbursement;
      return (
        <div key={'Reimbursement-' + reburse.reimbursementId} className="card col-md-4 col-sm-6 col-xs-12">
          <div className="card-body">
            <h5 className="card-title">Reimbursement Number: {reburse.reimbursementId}</h5>
          </div>
          <div>
          <img src={this.props.TheReimbursement.img}
            className="card-img-top"
            alt="..." />
          </div>
            <ul className="list-group list-group-flush">
            <li className="list-group-item">Amount: <input defaultValue={(this.props.TheReimbursement.amount).toString()} type="number" onChange={this.handleAmountChange.bind(this)}></input></li>
              <li className="list-group-item">Author: {reburse.author}</li>
              <li className="list-group-item">Description: <input defaultValue={this.state.MyDescription} onChange={this.handleDescChange.bind(this)}></input></li>
              <li className="list-group-item">Type: <select value={this.state.MyType} onChange={this.handleTypeChange.bind(this)}>
                  <option value="City/Castle">City/Castle</option>
                  <option value="War Efforts">War Efforts</option>
                  <option value="Religious">Religious</option>
                  <option value="Other">Other</option>
                </select></li>
              <li className="list-group-item2">Date Submitted: {reburse.dateSubmitted}</li>
              <li className="list-group-item2">Date Resolved: {reburse.dateResolved}</li>
              <li className="list-group-item">Status: <select value={this.state.MyStatus} onChange={this.handleStatusChange.bind(this)}>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Denied">Denied</option>
                </select>
              </li>
              <li className="list-group-item">Resolver: {reburse.resolver}</li>

                

            </ul>
            <br></br>
            <button className="btn btn-danger" onClick={this.updateReimbursement}>Update</button>
            <br></br>
        </div>
      )
    }
  }