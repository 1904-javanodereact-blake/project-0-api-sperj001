import express from 'express';
import bodyParser from 'body-parser';
import { userRouter } from './routers/user-router';
import { sessionMiddleware } from './middleware/session.middleware';
import { loginRouter } from './routers/login-Router';
import { reimbursementRouter } from './routers/reimbursement-Router';
import { UpdateServerBasis } from './DAOs/updaters';
import path from 'path';

//------------------------------
//Populate the server's arrays based upon database values
UpdateServerBasis();
//-------------------------------   
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'WebContent')))

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
app.listen(8081);

console.log("ERS System Active")