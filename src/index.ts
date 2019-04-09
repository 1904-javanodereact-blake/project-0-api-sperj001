import express from 'express';
import bodyParser from 'body-parser';
import { userRouter } from './routers/user-router';
import { sessionMiddleware } from './middleware/session.middleware';
import { loginRouter } from './routers/login-Router';
import { reimbursementRouter } from './routers/reimbursement-Router';

const app = express();

app.use((req, res, next) => {
  console.log("User connecting to Expense Reimbursement System, ERS system.");
  next();
});
//allow conversion of req.body to be avaiable
app.use(bodyParser.json());
//allow the attachment of req.session to be avaiable
app.use(sessionMiddleware);

/**
 * Register Routers
 */
app.use('/users', userRouter);
app.use('/login', loginRouter);
app.use(`/reimbursements`, reimbursementRouter);
//start up application
app.listen(8080);