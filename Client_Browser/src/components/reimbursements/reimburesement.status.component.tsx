import React from 'react';
import { Reimbursement } from '../../include/reimbursement';
import { ReimbursementCardComponent } from '../externals/reimbursement-card.component';


interface IState{
  TheReimbursements: Reimbursement[]
  InquireOn: string
  errorMessage: string
}

export class ReimbursementsStatus extends React.Component<any, IState> {

  constructor(props){
    super(props);
    this.state = {
      TheReimbursements: [],
      InquireOn: 'Pending',
      errorMessage: ""
    }
  }

  findReimbursement = (react:string) => async() => {
    try{
      this.setState({errorMessage: ""});
      const resp = await fetch(`http://localhost:8081/reimbursements/status/${this.state.InquireOn}`, {
        credentials: "include"
      });
      const body = await resp.json();
      console.log(body);
      let setRay = new Array();
      for(let i = 0; i < body.length; i++){
        setRay[i] = (new Reimbursement(parseFloat(body[i].reimbursementid), (`${body[i].authorfirst} ${body[i].authorlast}`), body[i].amount, (new Date(body[i].datesubmitted * 1)).toString(), (new Date(body[i].dateresolved * 1)).toString(), body[i].description, body[i].resolver, body[i].status, body[i].type, body[i].img))
        if(body[i].dateresolved == undefined || body[i].dateresolved == null){
          setRay[i].dateResolved = "N/A";
        }
      }
      if(setRay != undefined){
        this.setState({ 
          TheReimbursements: setRay
        })
      }
      else{
        this.setState({errorMessage: "Unable To Find Reimbursement's At This Time"});
      }
    }
    catch{
      this.setState({errorMessage: "A Server Side Error Has Occured"});
    }
  }

  handleChange(event) {
    this.setState({InquireOn: event.target.value})
  }
  
  render() {
    return (
        <div className="App">
            <b className="App-title">Reimbursements By Status Page</b>
            <br/> 
            <select value={this.state.InquireOn} onChange={this.handleChange.bind(this)}>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Denied">Denied</option>
            </select>
            <button onClick={this.findReimbursement("duh")}>Find Reimbursements</button>
            <br></br>
            <p className="App-subtitle" id="login-error">{this.state.errorMessage}</p>
              <br></br>     
            <div className="row">
              {this.state.TheReimbursements.map(TheReimbursement => (
                <ReimbursementCardComponent key={TheReimbursement.reimbursementId} TheReimbursement={TheReimbursement}/>
              ))}
            </div>
        </div>
    )
  }
}