import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { users } from '../state';

export const loginRouter = express.Router();

loginRouter.get('/out',
    async (req, res) => {
        req.session.destroy(() => {});
        res.send('User Logged Out');
});

loginRouter.post('', [
    authMiddleware(users),
    async (req, res) => {
        console.log('Made it into the login router and passing back this user');
        console.log(req.session.user);
        res.json(req.session.user);
    }]);

loginRouter.get('/check', [
    async (req, res) => {
        console.log(req.session.user);
        res.json(req.session.user);
    }]);