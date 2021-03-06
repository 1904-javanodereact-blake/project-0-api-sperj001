import { ReimbursementType } from '../model/ReimbursementType';
import { ReimbursementStatus } from '../model/ReimbursementStatus';
import { RT, roles, RS, users } from '../state';
import { role } from '../model/role';
import { User } from '../model/user';
import { mypool } from '../middleware/DAOmiddleware';

// need to add server function to get most recents from the database
export async function UpdateServerBasis() {
  // populate the user array at start
  await UpdateRoles();
  await UpdateUsers();
  await UpdateReimbursementTypes();
  await UpdateReimbursementStatus();
  console.log('All Arrays Have Been Updated Based Upon Database Values');
}

export async function UpdateUser() {
  // populate the Users Array
  const myclient = mypool;
  // console.log(users); //see old users array
  try {
    users.splice(0, users.length);
    const result = await myclient.query({
      rowMode: `array`,
      text: `SET SCHEMA 'ERS'; SELECT * FROM users`
    });
    const holdusers = result[1].rows;
    holdusers.forEach(element => {
      users.push(new User(element[0], element[1], element[2], element[3], element[4], element[5], element[6]));
    });
    // console.log(users); //see new users array
  }
  catch {
    console.log(myclient);
  }
}

export async function UpdateRoles() {
  // populate the Roles Array
  const myclient = mypool;
  // console.log(roles); //see old roles array
  roles.splice(0, roles.length);
  const result = await myclient.query({
    rowMode: `array`,
    text: `SET SCHEMA 'ERS'; SELECT * FROM roles`
  });
  const holdroles = result[1].rows;
  holdroles.forEach(element => {
    roles.push(new role(element[0], element[1]));
  });
  // console.log(roles); //see new roles array
}

export async function UpdateReimbursementTypes() {
  // populate the Reimbursement Types Array
  const myclient = mypool;
  // console.log(RT); //see old roles array
  RT.splice(0, RT.length);
  const result = await myclient.query({
    rowMode: `array`,
    text: `SET SCHEMA 'ERS'; SELECT * FROM reimbursementtype`
  });
  const holdRT = result[1].rows;
  holdRT.forEach(element => {
    RT.push(new ReimbursementType(element[0], element[1]));
  });
  // console.log(RT); //see new roles array
}

export async function UpdateReimbursementStatus() {
  // populate the Reimbursement Status Array
  const myclient = mypool;
  // console.log(ReimbursementStatus); //see old roles array
  RS.splice(0, RS.length);
  const result = await myclient.query({
    rowMode: `array`,
    text: `SET SCHEMA 'ERS'; SELECT * FROM reimbursementstatus`
  });
  const holdRS = result[1].rows;
  holdRS.forEach(element => {
    RS.push(new ReimbursementStatus(element[0], element[1]));
  });
  // console.log(RS); //see new roles array
}

export async function UpdateUsers() {
  await UpdateRoles();
  // populate the users array
  const myclient = mypool;
  // console.log(ReimbursementStatus); //see old roles array
  users.splice(0, RS.length);
  const result = await myclient.query({
    rowMode: `array`,
    text: `SET SCHEMA 'ERS'; SELECT * FROM users`
  });
  const holdR = result[1].rows;
  const userRoles: any[] = new Array();
  for (let i = 0; i < holdR.length; i++) {
    for (let x = 0; x < roles.length; x++) {
      if (holdR[i][6] == roles[x].roleId) {
        userRoles.push(new role(roles[x].roleId, roles[x].role));
      }
    }
  }
  // console.log(userRoles);
  // console.log('Updated user roles');
  for (let i = 0; i < holdR.length; i++) {
    users.push(new User(holdR[i][0], holdR[i][1], holdR[i][2], holdR[i][3], holdR[i][4], holdR[i][5], userRoles[i]));
  }
}