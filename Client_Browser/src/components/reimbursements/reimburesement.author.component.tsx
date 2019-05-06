import React from 'react';
import { Reimbursement } from '../../include/reimbursement';
import { ReimbursementCardComponent } from '../externals/reimbursement-card.component';


interface IState{
  TheReimbursements: any
  InquireOn: number
  errorMessage: string
}

export class ReimbursementsAuthor extends React.Component<any, IState> {

  constructor(props){
    super(props);
    this.state = {
      TheReimbursements: [],
      InquireOn: 1,
      errorMessage: ""
    }
  }

  findReimbursement = (react:string) => async() => {
    try{
      this.setState({errorMessage: ""});
      const resp = await fetch(`http://localhost:8081/reimbursements/author/${this.state.InquireOn}`, {
        credentials: "include"
      });
      const body = await resp.json();
      let setRay = new Array();
      for(let i = 0; i < body.length; i++){
        setRay[i] = (new Reimbursement(parseFloat(body[i].reimbursementid), (`${body[i].authorfirst} ${body[i].authorlast}`), body[i].amount, (new Date(body[i].datesubmitted * 1)).toString(), (new Date(body[i].dateresolved * 1)).toString(), body[i].description, body[i].resolver, body[i].status, body[i].type, body[i].img))
        if(body[i].dateresolved == undefined || body[i].dateresolved == null){
          setRay[i].dateResolved = "N/A";
        }
      }
      console.log(setRay);  
      console.log(setRay.length);
      if(setRay[0] != undefined){
        this.setState({
          TheReimbursements: setRay
        })
      }
      else{
        this.setState({
          TheReimbursements: null
        })
        this.setState({errorMessage: "Unable To Find Reimbursements For Specified Author"});
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
            <b className="App-title">Reimbursements By Author Page</b>
            <br/> 
            <input ref="authorToGet" type="text" value={this.state.InquireOn} onChange={this.handleChange.bind(this)}></input>
            <button onClick={this.findReimbursement("duh")}>Find Reimbursements</button>      
            <br></br>
            <p className="App-subtitle" id="login-error">{this.state.errorMessage}</p>
              <br></br>  
            <div className="row">
              {this.state.TheReimbursements  && this.state.TheReimbursements[0] && this.state.TheReimbursements.map(TheReimbursement => (
                <ReimbursementCardComponent key={TheReimbursement.reimbursementId} TheReimbursement={TheReimbursement}/>
              ))}
            </div>
        </div>
    )
  }
}