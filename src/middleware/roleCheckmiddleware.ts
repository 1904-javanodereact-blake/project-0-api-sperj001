export function roleCheck(requiredRole:string){
    return (req, res, next) => {
        console.log(`Checking Authorization of ${req.session.user.role.role} again ${requiredRole}`);
    if(req.session.user.role.role == requiredRole){
        console.log('Users Authorized');
        next();
      }
      else{
        console.log(`User Not Authorized with This Functionality`);
        res.sendStatus(401);
      }
    }
}