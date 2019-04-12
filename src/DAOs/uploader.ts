import { User } from "../model/user";
import { establishDBconnection } from "../middleware/DAOmiddleware";

export async function UploadUserUpdate(userID, user:User, res:any){
    //Update the database entry for the user at the specified ID with the new given user's data
    const myclient = establishDBconnection();
    try{
        try{
            const result = await myclient.query({
                rowMode: `array`,
                text: `SET SCHEMA 'ERS';
                UPDATE users 
                SET userid = ${user.userId}, username = ${user.username}, passkey = ${user.password}, firstname = ${user.firstname}, lastname = ${user.lastname}, email = ${user.email}, ${user.role.roleId}
                WHERE userid = ${user.userId};`
            });
            console.log(`Result returned: ${result.rows}`);
            res.json(user);
            console.log(`Update Complete`);
            myclient.end();
        }catch{
            res.status(504);
            res.send('V1 Identifier: Service Unaviable At This Time, Please Contact Your System Admin');
            console.log(`Update Failure`);
            myclient.end();
        }
    }
    catch{
        res.status(504);
        res.send('V2 Identifier: Service Unaviable At This Time, Please Contact Your System Admin');
        console.log(`Update Failure`);
        myclient.end();
    }
}