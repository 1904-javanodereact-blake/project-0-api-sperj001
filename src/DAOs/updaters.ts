import { ReimbursementType } from "../model/ReimbursementType";
import { ReimbursementStatus } from "../model/ReimbursementStatus";
import { RT, roles, RS, users, reinbursements } from "../state";
import { role } from "../model/role";
import { User } from "../model/user";
import { establishDBconnection } from "../middleware/DAOmiddleware";
import { Reimbursement } from "../model/reimbursement";

//need to add server function to get most recents from the database
export async function UpdateServerBasis(){
  //populate the user array at start
  UpdateUser();
  UpdateRoles();
  UpdateReimbursementTypes();
  UpdateReimbursementStatus();

  console.log("All Arrays Have Been Updated Based Upon Database Values");
}

export async function UpdateUser(){
  //populate the Users Array
  const myclient = establishDBconnection();
  //console.log(users); //see old users array
  try{
    users.splice(0, users.length);
    const result = await myclient.query({
      rowMode: `array`,
      text: `SET SCHEMA 'ERS'; SELECT * FROM users`
    });
    let holdusers = result[1].rows;
    holdusers.forEach(element => {
      users.push(new User(element[0], element[1], element[2], element[3], element[4], element[5], element[6]));
    });
    //console.log(users); //see new users array
    myclient.end();
  }
  catch{
    console.log(myclient)
  }
}

export async function UpdateRoles(){
  //populate the Roles Array
  const myclient = establishDBconnection();
  //console.log(roles); //see old roles array
  roles.splice(0,roles.length);
  const result = await myclient.query({
    rowMode: `array`,
    text: `SET SCHEMA 'ERS'; SELECT * FROM roles`
  });
  let holdroles = result[1].rows;
  holdroles.forEach(element => {
    roles.push(new role(element[0], element[1]));
  });
  //console.log(roles); //see new roles array
  myclient.end();
}

export async function UpdateReimbursementTypes(){
  //populate the Reimbursement Types Array
  const myclient = establishDBconnection();
  //console.log(RT); //see old roles array
  RT.splice(0,RT.length);
  const result = await myclient.query({
    rowMode: `array`,
    text: `SET SCHEMA 'ERS'; SELECT * FROM reimbursementtype`
  });
  let holdRT = result[1].rows;
  holdRT.forEach(element => {
    RT.push(new ReimbursementType(element[0], element[1]));
  });
  //console.log(RT); //see new roles array
  myclient.end();
}

export async function UpdateReimbursementStatus(){
  //populate the Reimbursement Status Array
  const myclient = establishDBconnection();
  console.log(ReimbursementStatus); //see old roles array
  RS.splice(0, RS.length);
  const result = await myclient.query({
    rowMode: `array`,
    text: `SET SCHEMA 'ERS'; SELECT * FROM reimbursementtype`
  });
  let holdRS = result[1].rows;
  holdRS.forEach(element => {
    RS.push(new ReimbursementStatus(element[0], element[1]));
  });
  console.log(RS); //see new roles array
  myclient.end();
}
export async function UpdateReimbursements(){
  //populate the Reimbursement Status Array
  const myclient = establishDBconnection();
  console.log(ReimbursementStatus); //see old roles array
  reinbursements.splice(0, RS.length);
  const result = await myclient.query({
    rowMode: `array`,
    text: `SET SCHEMA 'ERS'; SELECT * FROM reimbursementtype`
  });
  let holdR = result[1].rows;
  holdR.forEach(element => {
    reinbursements.push(new Reimbursement(element[0], element[1], element[2], element[3], element[4], element[5], element[6], element[7], element[8]));
  });
  console.log(reinbursements); //see new roles array
  myclient.end();
}