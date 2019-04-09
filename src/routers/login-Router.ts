import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { users } from '../state';

export const loginRouter = express.Router();

loginRouter.post("",[
    authMiddleware(users), 
    (req, res) => {
        res.json(req.session.user);
        console.log(`${req.session.user} has been logged-in successfully.`)
    }])

