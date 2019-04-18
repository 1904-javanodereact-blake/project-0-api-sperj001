import express from 'express';
import { users, roles} from '../state';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleCheck } from '../middleware/roleCheckmiddleware';
import { UploadUserUpdate } from '../DAOs/uploader';
import { UpdateUsers } from '../DAOs/updaters';
import { crypt } from '../middleware/ecrypt';
import { User } from '../model/user';

/**
 * User router will handle all requests starting with
 *  /users
 */
export const userRouter = express.Router();


/**
 * find all users
 * endpoint: /users
 */
userRouter.get('/home', [
  authMiddleware(users),
  (req, res) => {
    console.log(`Redirecting User To User Homepage`);
    res.redirect(`/usersmainpage.html`);
  }])

userRouter.get('', [
  authMiddleware(users),
  roleCheck("finance-manager", 'block', 'user update call'),
  (req, res) => {
    console.log('Retreiving All Users');
    res.json(users);
  }])

userRouter.get('/list/:startlocation', 
  authMiddleware(users),
  roleCheck("finance-manager", 'block', 'user list'),
  async (req, res) => {
      await UpdateUsers();
      const index: number = +req.params.startlocation;
      let queryString = "";
      let aIndex = index + 5;
      //let maxIndex = users.length-1;
      let more = true;
      /*if(maxIndex <= aIndex){
        more = false;
        aIndex = maxIndex;
      }*/
      for(let i = 0; i<users.length; i++){
        queryString += `userID=${users[i].userId}&username=${users[i].username}&role=${users[i].role.role}`
        if(i!=aIndex){
          queryString += '+';
        }
      }
      queryString += `*more&${more}`;
      res.redirect(`/userslistpage.html?:${crypt(queryString)}`);
      console.log(`Sending To Get Users List Page Index ${index} through ${aIndex}`);
    })
/**
 * find user by id
 * endpoint: /users/:id
 */
userRouter.post('/getuser', 
  authMiddleware(users),
  roleCheck("finance-manager", 'allow', 'user id'),
  async (req, res) => {
  await UpdateUsers();
  console.log(req.body);
  const id: number = req.body.searchUser;
  console.log(`Retreiving user with id: ${id}`);
  let user:User;
  users.forEach(ele => {
    if(id == ele.userId){
      user = ele;
      return;  
    }
  })
  if (user) {
    let {userId, username, password, firstname, lastname, email, role} = user;
    let queryString = `userID=${userId}&username=${username}&password=${password}&firstname=${firstname}&lastname=${lastname}&email=${email}&role=${role.role}`;
    console.log("Sending User To Specified User Page");
    res.redirect(`/specificuserpage.html?:${crypt(queryString)}`);
  } else {
    res.status(404);
    res.redirect("/usererrorpage.html")
  }
})

/*
userRouter.post('', (req, res) => {
  console.log(`creating user`, req.body);
  const user: User = req.body;
  user.userId = Math.floor(Math.random() * 10000000);
  users.push(user);
  res.status(201);
  res.send(user);
})
*/
userRouter.post('/update', 
  authMiddleware(users),
  roleCheck("admin", 'block', 'user update entry'),  
  async (req, res) => {
  await UpdateUsers(); 
  console.log(req.body);
  const id: number = req.body.searchUser * 1;
  console.log(`Retreiving User with id: ${id}`);
  let user:User;;
  users.forEach(ele => {
    if(id == ele.userId){
      user = ele;
      console.log(ele);
      return;  
    }
  })
  console.log(user);
  if (!user) {
    res.status(404);
    res.redirect("/usererrorpage.html");
  } 
  else {
    let {userId, username, password, firstname, lastname, email, role} = user;
    let queryString = `userID=${userId}&username=${username}&password=${password}&firstname=${firstname}&lastname=${lastname}&email=${email}&role=${role.role}`;
    res.redirect(`/updateuserpage.html?:${crypt(queryString)}`); 
  } 
})

userRouter.post(`/update/complete`,
  authMiddleware(users),
  roleCheck("admin", 'block', 'user update'),
  async(req, res) => {
    await UpdateUsers(); 
    console.log(req.body);
    const id: number = req.body.userId;
    console.log(`Retreiving Updated User With ID: ${id}`);
    let user:User;
    users.forEach(ele => {
      if(id == ele.userId){
        user = ele;
        return;  
      }
    })
    if (!user) {
      res.status(404);
      res.redirect("/usererrorpage.html")
    } 
    else {
      user.username = req.body.username;
      user.firstname = req.body.firstname;
      user.lastname = req.body.lastname;
      user.password = req.body.password;
      let rolePass = false;
      user.role.role = req.body.role;
      for(let i = 0; i < roles.length; i++){
        if(roles[i].role == user.role.role){
          user.role.roleId = roles[i].roleId;
          rolePass = true;
        }
      }
      if(rolePass == true){
        if(user.userId == req.session.user.userId){
        req.session.user = user;}
        await UploadUserUpdate(user, res);
        let {userId, username, password, firstname, lastname, email, role} = user;
        let queryString = `userID=${userId}&username=${username}&password=${password}&firstname=${firstname}&lastname=${lastname}&email=${email}&role=${role.role}`;
        res.redirect(`/updateuserpage.html?:${crypt(queryString)}`); 
      }
      else{
        res.status(404);
        res.redirect("/usererrorpage.html");
      }
    } 
  })