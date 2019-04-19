import { User } from '../model/user';

// middle ware to require username and password to be sent over to validate ability of user to gain access to other features
export function authMiddleware (users: User[]) {
  return async (req, res, next) => {
    console.log(`running auth & ${req.session.loggedIn}`);
    let isAuthorized = false;
    if (!req.session.loggedIn) {
      const username = req.body.username;
      const password = req.body.password;
        for (let i = 0; i < users.length; i++) {
          if (users[i].username === username && users[i].password === password) {
            isAuthorized = true;
            req.session.user = users[i];
            break;
          }
        }
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
