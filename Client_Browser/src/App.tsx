import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import { NavComponent } from './components/nav/nav.component';
import './include/bootstrap';
import { Home } from './components/home.component';
import { Users } from './components/users/users.component';
import { Reimbursements } from './components/reimbursements/reimbursements.component';
import { ReimbursementsAuthor } from './components/reimbursements/reimburesement.author.component';
import { ReimbursementsStatus } from './components/reimbursements/reimburesement.status.component';
import { ReimbursementCreate } from './components/reimbursements/reimbursement.create.component';
import { Login } from './components/users/login.component';
import { Logout } from './components/users/loggedout.component';
import { ReimbursementUpdate } from './components/reimbursements/reimbursement.update.component';
import { CreatedReimbursement } from './components/reimbursements/reimbursement.created.component';
import { UsersViewAll } from './components/users/users.viewall.component';
import { UserGetUpdate } from './components/users/users.getid.component';

export default class App extends React.Component <any, any> {

  render() {
  return (
    <div className="BaseApp">
    <BrowserRouter>
        <NavComponent />
        <Route path="/logout" component={Logout}/>
        <Route path="/login" component={Login}/>
        <Route path="/home" component={Home} />
        <Route path="/users" component={Users} />
        <Route path="/reimbursements" component={Reimbursements} />
        <Route path="/reimbursementAuthor" component={ReimbursementsAuthor}/>
        <Route path="/reimbursementStatus" component={ReimbursementsStatus}/>
        <Route path="/reimbursementCreate" component={ReimbursementCreate}/>
        <Route path="/reimbursementUpdate" component={ReimbursementUpdate}/>
        <Route path='/CreatedReimbursement' component={CreatedReimbursement}/>
        <Route path='/UsersViewAll' component={UsersViewAll}/>
        <Route path='/UserGetUpdate' component={UserGetUpdate}/>
          <Route component={Login}/>
    </BrowserRouter>
    </div>  
  );
}
}