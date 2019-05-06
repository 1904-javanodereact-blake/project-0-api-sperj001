import React from "react";
import { Reimbursement } from "../../include/reimbursement";

interface IReimburseCardProps
 {
    TheReimbursement: Reimbursement;
  }
  
  export class ReimbursementCardComponent extends React.PureComponent<IReimburseCardProps> {
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
          <li className="list-group-item">Amount: {(reburse.amount).toString()}</li>
            <li className="list-group-item">Author: {reburse.author}</li>
            <li className="list-group-item">Description: {reburse.description}</li>
            <li className="list-group-item">Type: {reburse.type}</li>
            <li className="list-group-item2">Date Submitted: {reburse.dateSubmitted}</li>
            <li className="list-group-item2">Date Resolved: {reburse.dateResolved}</li>
            <li className="list-group-item">Status: {reburse.status}</li>
            <li className="list-group-item">Resolver: {reburse.resolver}</li>
            <br></br>
          </ul>
          <br></br>
        </div>
      )
    }
  }