import express from 'express';
import bodyParser from 'body-parser';
//import { userRouter } from './routers/user-router';
import { sessionMiddleware } from './middleware/session.middleware';
import { loginRouter } from './routers/login-Router';

const app = express();

app.use((req, res, next) => {
  console.log("User connecting to Expense Reimbursement System, ERS system.");
  next();
});

app.use(bodyParser.json());

app.use(sessionMiddleware);

/**
 * Register Routers
 */
//app.use('/users', userRouter);
app.use('/login', loginRouter);

app.listen(8080);