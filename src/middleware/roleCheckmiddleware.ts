import { users } from '../state';
import { UpdateUsers } from '../DAOs/updaters';

export function roleCheck(requiredRole: string, optionalRole = 'block', sender) {
    return async(req, res, next) => {
    await UpdateUsers();
    console.log(optionalRole + ' is optional role setting from ' + sender);
    console.log(`Checking Authorization of ${req.session.user.givenrole} against ${requiredRole}`);
    if (optionalRole != 'block') {
        console.log(`Also Checking Authorization Of Second Optional Allowed User With Setting ${optionalRole}`);
        let id: number;
        if (req.body.searchUser) {
            id = + req.body.searchUser;
        }
        else if (req.body.author) {
            id = + req.body.author;
        }
        else if (req.params.id) {
            id = + req.params.id;
        }
        console.log(id + ' is the set id');
        console.log(`Testing If User ID Matches Requested ID`);
        console.log(req.session.user);
        if (id < users.length) {
            console.log('Checking user equivalent');
            const user = users.find(u => u.userId === id);
            console.log(user);
            if (user.userId == req.session.user.userid || (req.session.user.givenrole == 'admin' || req.session.user.givenrole == 'finance-manager')) {
                console.log('User Authorized for same id access');
                next();
            }
            else {
                sendUnathorized(res);
            }
        }
        else if (requiredRole == 'employee' && (req.session.user.givenrole == 'admin' || req.session.user.givenrole == 'finance-manager')) {
            console.log('User Authorized for great privalege access');
            next();
        }
        else if (req.session.user.givenrole == requiredRole || req.session.user.givenrole == 'admin') {
            console.log( req.session.user.givenrole + ' & ' + requiredRole);
            console.log('User Authorized for same role access');
            next();
          }
        else {
            sendUnathorized(res);
        }
    }
    else if (requiredRole == 'employee' && (req.session.user.givenrole == 'admin' || req.session.user.givenrole == 'finance-manager')) {
        console.log('User Authorized for great privalege access');
        next();
    }
    else if (req.session.user.givenrole == requiredRole || req.session.user.givenrole == 'admin') {
        console.log( req.session.user.givenrole + ' & ' + requiredRole);
        console.log('User Authorized for same role access');
        next();
      }
    else {
       sendUnathorized(res);
      }
    };
}
function sendUnathorized(res: any) {
    console.log(`User Not Authorized To Utilize This Functionality`);
    res.status(401);
}