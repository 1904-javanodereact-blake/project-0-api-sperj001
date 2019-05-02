import express from 'express';
import { users } from '../state';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleCheck } from '../middleware/roleCheckmiddleware';
import { User } from '../model/user';
import { mypool } from '../middleware/DAOmiddleware';
import { role } from '../model/role';

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
  roleCheck('finance-manager', 'block', 'user update call'),
  async (req, res) => {
    console.log('Retreiving All Users');
    const myclient = await mypool.connect();
    try {
      await  myclient.query(`SET SCHEMA 'ERS';`);
        const q1 = `Select * from users Left join roles a ON users.givenrole = a.roleid;`;
        const resp1 = await myclient.query(q1);
        console.log(resp1.rows);
        res.json(resp1.rows);
        console.log('Sending List Of Users');
    }
    catch {
      console.log('ERROR');
      res.send('ERROR');
    }
    myclient.release();
  }]);
/**
 * find user by id
 * endpoint: /users/:id
 */
userRouter.get('/:id',
  authMiddleware(users),
  roleCheck('finance-manager', 'allow', 'user id'),
  async (req, res) => {
    const id: number = +req.params.id;
    console.log(`Retreiving user with id: ${id}`);
    let user;
    const myclient = await mypool.connect();
    await  myclient.query(`SET SCHEMA 'ERS';`);
    const query = `SELECT * FROM users Left join roles a ON users.givenrole = a.roleid WHERE userid = ${id}`;
    console.log('getting user from server');
    const resp = await myclient.query(query);
    user = resp.rows[0];
    console.log(user);

    if (user) {
      console.log('Sending Speified User Information');
      res.json(user);
    } else {
      res.status(404);
      console.log('Unable To Speified User Information');
      res.send('ERROR');
    }
    myclient.release();
});
/**
 * update user by id
 * endpoint: /users/update/:id
 */
userRouter.patch('/update',
  authMiddleware(users),
  roleCheck('admin', 'block', 'user update entry'),
  async (req, res) => {
    console.log(req.body);
    const body = req.body;
    let user = new User(body.userid, body.username, body.passkey, body.firstname, body.lastname, body.email, new role(0, body.givenrole));
    const myclient = await mypool.connect();
    await  myclient.query(`SET SCHEMA 'ERS';`);
    // update the text of the user's role to a number
    const q1 = `Select roleid from roles where roledesc = '${user.role.role}';`;
    const resp1 = await myclient.query(q1);
    user.role.roleId = resp1.rows[0].roleid;
    // update the user entry
    const query = `Update users
    SET username = '${user.username}', passkey = '${user.password}', firstname = '${user.firstname}', lastname = '${user.lastname}', email = '${user.email}', givenrole = ${user.role.roleId}
    WHERE userid = ${user.userId}`;
    console.log(query);
    const resp = await myclient.query(query);
    user = resp.rows[0];
    console.log(user);
    if (!user) {
      res.status(404);
      console.log('ERROR UPDATING USER');
      res.send('ERROR');
    }
    else {
      res.json(user);
    }
    myclient.release();
});