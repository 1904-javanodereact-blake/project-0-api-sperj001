import { User } from "../model/user";

export function authMiddleware (users: User[]) {
  return (req, res, next) => {
    const { username, password } = req.body
    console.log("i am called")
    let isAuthorized = false;
    for(let i = 0; i < users.length; i++)
    {
      console.log(`Checked Username: ${username} Checked Stored: ${users[i].username} Checked Password: ${password} Checked Stored: ${users[i].password}`)
      if(users[i].username === username && users[i].password === password){
        console.log(`true values found`);
        isAuthorized = true;
        break;
      }
    }
    if(isAuthorized) {
      console.log("I happen");
      next();
    } else {
      res.sendStatus(400);
    }
  }
} 
