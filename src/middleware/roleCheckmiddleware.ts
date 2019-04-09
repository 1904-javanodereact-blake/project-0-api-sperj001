import { users } from "../state";

export function roleCheck(requiredRole:string, optionalRole = 'block'){
    return (req, res, next) => {
        console.log(`Checking Authorization of ${req.session.user.role.role} against ${requiredRole}`);
        if(optionalRole != 'block'){
            console.log(`Also Checking Authorization Of Second Optional Allowed User With ID${optionalRole}`)
        }
    if(req.session.user.role.role == requiredRole){
        console.log('User Authorized');
        next();
      }
    else if(optionalRole != 'block'){
        const id: number = +req.params.id;
        console.log(`Testing If User ID Matches Requested ID`);
        const user = users.find(u => u.userId === id);
        if(user.userId == req.session.user.userId){
            console.log('User Authorized');
            next();
        }
        else{
            console.log(`User Not Authorized To Utilize This Functionality`);
            res.status(401);
            res.send("You are not authorized to access this functionality/area. Please contact your local administrator.")
          }
    }
    else{
        console.log(`User Not Authorized To Utilize This Functionality`);
        res.status(401);
        res.send("You are not authorized to access this functionality/area. Please contact your local administrator.")
      }
    }
}