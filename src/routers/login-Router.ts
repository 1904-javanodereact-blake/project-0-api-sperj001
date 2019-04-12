import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { users } from '../state';

export const loginRouter = express.Router();

loginRouter.post("",[
    authMiddleware(users), 
    (req, res) => {
        console.log(`${req.session.user.username} has been logged-in successfully.`);
        console.log(`Sending user to logged in page`);
        //res.writeHead(301, {Location: `localhost:8080/loggedinpage.html`});
        res.redirect(`/loggedinpage.html`);
        //res.end();
    }])

