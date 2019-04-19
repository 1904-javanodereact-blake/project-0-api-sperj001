import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { users } from '../state';

export const loginRouter = express.Router();

loginRouter.post('', [
    authMiddleware(users),
    async (req, res) => {
        console.log(req.session.user);
        res.json(req.session.user);
    }]);

loginRouter.get('/home', [
    authMiddleware(users),
    async (req, res) => {
        console.log(req.session.user);
        res.json(req.session.user);
    }]);