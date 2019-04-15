import { User } from "../model/user";
import { establishDBconnection } from "../middleware/DAOmiddleware";
import { Reimbursement } from "../model/reimbursement";

export async function UploadUserUpdate(user:User, res:any){
    //Update the database entry for the user at the specified ID with the new given user's data
    const myclient = establishDBconnection();
    try{
        try{
            const result = await myclient.query({
                rowMode: `array`,
                text: `SET SCHEMA 'ERS';
                UPDATE users 
                SET userid = ${user.userId}, username = '${user.username}', passkey = '${user.password}', firstname = '${user.firstname}', lastname = '${user.lastname}', email = '${user.email}', givenrole = ${user.role.roleId}
                WHERE userid = ${user.userId};`
            });
            console.log(`Result returned: ${result.rows}`);
            console.log(`Update Complete`);
           
        }catch{
            res.status(504);
            res.send('V1 Identifier: Service Unaviable At This Time, Please Contact Your System Admin');
            console.log(`Update Failure`);
        }
    }
    catch{
        res.status(504);
        res.send('V2 Identifier: Service Unaviable At This Time, Please Contact Your System Admin');
        console.log(`Update Failure`);
        
    }
}

export async function UploadNewReimbursement(reburse:Reimbursement, res:any){
    //Update the database table to include a new reimbursement
    const myclient = establishDBconnection();
    try{
        try{
            await myclient.query(`SET SCHEMA 'ERS';
                INSERT INTO reimbursements
                VALUES (${reburse.reimbursementId}, ${reburse.author}, ${reburse.amount}, ${reburse.amount}, ${reburse.dateResolved}, '${reburse.description}', ${reburse.resolver}, ${reburse.status.statusId}, ${reburse.type.typeId});`
            );
            res.status(201);
            console.log(`Pending Reimbursement Added`);
            
        }catch{
            res.status(504);
            res.send('V1 Identifier: Service Unaviable At This Time, Please Contact Your System Admin');
            console.log(`Update Failure V1`);
            
        }
    }
    catch{
        res.status(504);
        res.send('V2 Identifier: Service Unaviable At This Time, Please Contact Your System Admin');
        console.log(`Update Failure`);
        
    }
}

export async function UploadReimbursementUpdate(reburse:Reimbursement, res:any){
    //Update the database entry for the user at the specified ID with the new given user's data
    const myclient = establishDBconnection();
    try{
        try{
            const result = await myclient.query({
                rowMode: `array`,
                text: `SET SCHEMA 'ERS';
                UPDATE riembursements 
                SET reimbursementid = ${reburse.reimbursementId}, author = ${reburse.author}, amount = ${reburse.amount}, datesubmitted = ${reburse.amount}, dateresolved = ${reburse.dateResolved}, description = '${reburse.description}', resolver = ${reburse.resolver}, statusid = ${reburse.status.statusId}, typeid = ${reburse.type.typeId}
                WHERE userid = ${reburse.reimbursementId};`
            });
            console.log(`Result returned: ${result.rows}`);
            console.log(`Update Complete`);
            
        }catch{
            res.status(504);
            res.send('V1 Identifier: Service Unaviable At This Time, Please Contact Your System Admin');
            console.log(`Update Failure`);
            
        }
    }
    catch{
        res.status(504);
        res.send('V2 Identifier: Service Unaviable At This Time, Please Contact Your System Admin');
        console.log(`Update Failure`);
        
    }
}