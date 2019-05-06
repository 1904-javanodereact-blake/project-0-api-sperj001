import express from 'express';
import bodyParser from 'body-parser';
import { userRouter } from './routers/user-router';
import { sessionMiddleware } from './middleware/session.middleware';
import { loginRouter } from './routers/login-Router';
import { reimbursementRouter } from './routers/reimbursement-Router';
import path from 'path';

const app = express();


app.use((req, res, next) => {
  console.log(`Method: ${req.method}, URL: ${req.url}`);
  next();
});

app.use((req, resp, next) => {
  console.log(req.get('host'));
  (process.env.SHIP_API_STAGE === 'prod')
    ? resp.header('Access-Control-Allow-Origin')
    : resp.header('Access-Control-Allow-Origin', `${req.headers.origin}`);
  resp.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  resp.header('Access-Control-Allow-Credentials', 'true');
  resp.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, PUT, PATCH');
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'WebContent')));

app.use((req, res, next) => {
  console.log('User connecting to Expense Reimbursement System, ERS system.');
  next();
});
// allow conversion of req.body to be avaiable
app.use(bodyParser.json());
// allow the attachment of req.session to be avaiable
app.use(sessionMiddleware);

/*
 * Register Routers
*/
app.use('/users', userRouter);
app.use('/login', loginRouter);
app.use(`/reimbursements`, reimbursementRouter);
// start up application
app.listen(8081);

console.log('ERS System Active');