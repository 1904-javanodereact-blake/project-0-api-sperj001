import express from 'express';
import { users} from '../state';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleCheck } from '../middleware/roleCheckmiddleware';
import { UploadUserUpdate } from '../DAOs/uploader';

/**
 * User router will handle all requests starting with
 *  /users
 */
export const userRouter = express.Router();


/**
 * find all users
 * endpoint: /users
 */
userRouter.get('', [
  authMiddleware(users),
  roleCheck("finance-manager"),
  (req, res) => {
    console.log('Retreiving All Users');
    res.json(users);
  }])

/**
 * find user by id
 * endpoint: /users/:id
 */
userRouter.get('/:id', 
  authMiddleware(users),
  roleCheck("finance-manager", 'allow'),
  (req, res) => {
  const id: number = +req.params.id;
  console.log(`retreiving user with id: ${id}`);
  const user = users.find(u => u.userId === id);
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    res.send(`User with ID number: ${id}`)
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
userRouter.patch('', 
  authMiddleware(users),
  roleCheck("admin"),  
  (req, res) => {
  const { body } = req; // destructuring
  console.log(`Updating User's Info`);
  const user = users.find((u) => {
    return u.userId === body.userId;
  });
  if (!user) {
    res.status(404);
    res.send('User ID Not Found');
  } 
  else {
    for (let field in user) {
      if (body[field] !== undefined) {
        user[field] = body[field];
      }
    }
    UploadUserUpdate(body.userID, user, res);
  } 
})