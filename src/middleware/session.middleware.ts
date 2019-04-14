import session from 'express-session';
import { User } from '../model/user';
const sess = {
  secret: '42',
  cookie: { secure: false },
  resave: false,
  saveUninitialized: false,
  loggedIn : false,
  user: User
};

export const sessionMiddleware = session(sess);
