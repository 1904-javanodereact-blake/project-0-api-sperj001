import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { users } from '../state';
import { crypt } from '../middleware/ecrypt';
import { UpdateUsers } from '../DAOs/updaters';

export const loginRouter = express.Router();

loginRouter.post('', [
    authMiddleware(users),
    async (req, res) => {
        console.log('attempting to log in');
        await UpdateUsers();
        console.log(`${req.session.user.username} has been logged-in successfully.`);
        console.log(`Sending user to logged in home page`);
        const {userId, username, password, firstname, lastname, email, role} = req.session.user;
        const queryString = `userID=${userId}&username=${username}&password=${password}&firstname=${firstname}&lastname=${lastname}&email=${email}&role=${role.role}`;
        res.redirect(`/loggedinpage.html?:${crypt(queryString)}`);
    }]);

loginRouter.get('/home', [
    authMiddleware(users),
    async (req, res) => {
        await UpdateUsers();
        console.log(`Sending user to logged in home page`);
        const {userId, username, password, firstname, lastname, email, role} = req.session.user;
        const queryString = `userID=${userId}&username=${username}&password=${password}&firstname=${firstname}&lastname=${lastname}&email=${email}&role=${role.role}`;
        res.redirect(`/loggedinpage.html?:${crypt(queryString)}`);
    }]);

