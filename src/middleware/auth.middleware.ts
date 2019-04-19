import { User } from '../model/user';
import { mypool } from './DAOmiddleware';

// middle ware to require username and password to be sent over to validate ability of user to gain access to other features
export function authMiddleware (users: User[]) {
  return async (req, res, next) => {
    let isAuthorized = false;
    if (!req.session.loggedIn) {
      const username = req.body.username;
      const password = req.body.password;
      const myclient = await mypool.connect();
      try {
        await  myclient.query(`SET SCHEMA 'ERS';`);
        const query = `SELECT * FROM users WHERE username = $1 AND passkey = $2;`;
        const resp = await myclient.query(query, [username, password]);
        console.log(resp.rows[0]);
        const user = resp.rows[0];
        console.log(user);
            if (user) {
              isAuthorized = true;
              req.session.user = user;
          }
      }
      catch {
        res.status(400);
        res.send('Connection Issues');
        console.log('Invalid Credentials');
      }
      myclient.release();
    }
    else {
      isAuthorized = true;
    }
    if (isAuthorized) {
      console.log(`User Logged In Successfully`);
      req.session.loggedIn = true;
      next();
    } else {
      res.status(400);
      res.redirect(`/loginfailurepage.html`);
      console.log('Invalid Credentials');
    }
  };
}
