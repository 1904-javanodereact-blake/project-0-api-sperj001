import React from 'react';
import { Reimbursement } from '../../include/reimbursement';
import { ReimbursementCardComponent } from '../externals/reimbursement-card.component';
import { ReimbursementEditCardComponent } from '../externals/reimbursement-card.edit.component';


interface IState{
  TheReimbursement: any
  InquireOn: number
  errorMessage: string
}

export class ReimbursementUpdate extends React.Component<any, IState> {

  constructor(props){
    super(props);
    this.state = {
      TheReimbursement: Reimbursement,
      InquireOn: 1,
      errorMessage: ""
    }
    this.findReimbursement = this.findReimbursement.bind(this);
    this.childUseFind = this.childUseFind.bind(this);
  }
  childUseFind = async () => {
    console.log("I WORKED");
    await this.findReimbursement();
  }
  findReimbursement = async() => {
    try{
      this.setState({errorMessage: "" });
      const resp = await fetch(`http://localhost:8081/reimbursements/specific/${this.state.InquireOn}`, {
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
      if(setRay[0] != undefined){
        this.setState({
          TheReimbursement: setRay[0]
        })
      }
      else{
        this.setState({
          TheReimbursement: "Not found",
          errorMessage: "Unable To Find Reimbursement"
        })
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
              <b className="App-title">Update Reimbursement</b>
              <br/> 
              <input ref="authorToGet" type="text" value={this.state.InquireOn} onChange={this.handleChange.bind(this)}></input>
              <button onClick={() => this.findReimbursement()}>Get Specific Reimbursement With ID</button>     
              <br></br>
              <p className="App-subtitle" id="login-error">{this.state.errorMessage}</p>
              <br></br>  
              <div className="row">
                {this.state.TheReimbursement.reimbursementId && <ReimbursementCardComponent key={this.state.TheReimbursement.reimbursementId} TheReimbursement={this.state.TheReimbursement}/>}
                {this.state.TheReimbursement.reimbursementId && <ReimbursementEditCardComponent key={this.state.TheReimbursement.reimbursementId + "-2"} TheReimbursement={this.state.TheReimbursement} childUseFind={this.findReimbursement}/>}
              </div>
          </div>
    )
  }
}