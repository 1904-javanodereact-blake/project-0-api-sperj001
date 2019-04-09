import { User } from "../model/user";
//middle ware to require username and password to be sent over to validate ability of user to gain access to other features
export function authMiddleware (users: User[]) {
  return (req, res, next) => {
    let isAuthorized = false;
    if(!req.session.loggedIn){
      const { username, password } = req.body
      for(let i = 0; i < users.length; i++)
      {
        console.log(`Checked Username: ${username} Checked Stored: ${users[i].username} Checked Password: ${password} Checked Stored: ${users[i].password}`)
        if(users[i].username === username && users[i].password === password){
          isAuthorized = true;
          req.session.user = users[i];
          break;
        }
      }
    }
    else{
      isAuthorized = true;
    }
    if(isAuthorized) {
      req.session.loggedIn = true;
      next();
    } else {
      res.sendStatus(400);
    }
  }
} 
