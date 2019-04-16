import express from 'express'; 
import { authMiddleware } from '../middleware/auth.middleware';
import { users, RT, RS} from '../state';
import { roleCheck } from '../middleware/roleCheckmiddleware';
import { Reimbursement } from '../model/reimbursement';
import { reinbursements } from '../state';
import { UpdateServerBasis } from '../DAOs/updaters';
import { UploadNewReimbursement, UploadReimbursementUpdate } from '../DAOs/uploader';
import { ReimbursementStatus } from '../model/ReimbursementStatus';
import { ReimbursementType } from '../model/ReimbursementType';
import { cryptROT13 } from '../middleware/ROT13';


export const reimbursementRouter = express.Router();

reimbursementRouter.get('/home', [
  authMiddleware(users),
  (req, res) => {
    console.log(`Redirecting User To User Homepage`);
    res.redirect(`/reimbursementsmainpage.html`);
  }])

reimbursementRouter.get('', [
  authMiddleware(users),
  (req, res) => {
    console.log('hello');

  }])
reimbursementRouter.get('/create',
  authMiddleware(users),
  roleCheck("employee", 'block', 'reim create send'),
  (req, res) => {
    res.redirect("http://localhost:8080/createreimbursementpage.html");
    console.log('Sending User To Create Reimbursement Page');
})

reimbursementRouter.post('',
    authMiddleware(users),
    roleCheck("employee", 'block', 'reim create do'),
    (req, res) => {
        UpdateServerBasis();
        console.log(`Creating New Reimbursement`);
        console.log(req.body);
        for(let i = 0; i < RT.length; i++){
          if(req.body.type ==RT[i].type){
            var newType = new ReimbursementType(RT[i].typeId, RT[i].type);
            console.log(newType);
          }
        }
        for(let i = 0; i < RS.length; i++){
          if(0 == RS[i].statusId){
            var newStatus = new ReimbursementStatus(RS[i].statusId, RS[i].status);
            console.log(newStatus);
            
          }
        }
        
        if(!ReimbursementType){
          res.status(404);
          res.redirect("http://localhost:8080/usererrorpage.html")
        }
        else{
          console.log(req.body.dateSubmitted);
        let reburse = new Reimbursement((reinbursements.length +1), req.session.user.userId, parseFloat(req.body.amount), parseFloat(req.body.dateSubmitted), null, req.body.description, null, newStatus, newType);
        reinbursements.push(reburse);
        UploadNewReimbursement(reburse, res);
        let {reimbursementId, author, dateSubmitted, dateResolved, resolver, status, type} = reburse;
        console.log(reburse);
        let queryString = `reimbursementId=${reimbursementId}&author=${author}&dateSubmitted=${dateSubmitted}&dateResolved=${dateResolved}&resolver=${resolver}&status=${status.status}&type=${type.type}`;
        console.log("Sending User To Specified Reimbursement Page");
        res.redirect(`/specificreimbursement.html?:${cryptROT13(queryString)}`);
        }
})
/*
reimbursementRouter.get('',
//    authMiddleware(users),
//    roleCheck("employee"),
    (req, res) => {
        console.log(`Getting All Reimbursements`);
        res.send(reinbursements);
})
*/
reimbursementRouter.get('/status/:statusId', 
  //authMiddleware(users),
  //roleCheck("finance-manager", 'allow'),
  (req, res) => {
  const id: number = +req.params.statusId;
  console.log(`Retreiving Reinbursement With Status ID: ${id}`);
  let rebuse = reinbursements.filter(ele => ele.status.statusId == id);
  for(let p = 0; p< rebuse.length; p++){
      for(let x = 0; x < rebuse.length-1; x++){
          if(rebuse[x].dateSubmitted > rebuse[x+1].dateSubmitted){
              let t = rebuse[x+1];
              rebuse[x+1] = rebuse[x];
              rebuse[x] = t;
          }
      }
  }
  if (rebuse) {
    res.json(rebuse);
  } else {
    res.status(404);
    res.send(`Reinbursement with Status ID number: ${id} does not exist`)
  }
})
//still need to add the functionality but have added the start for the url
reimbursementRouter.get('/author/userID/:userId', 
  authMiddleware(users),
  roleCheck("finance-manager", 'block', 'reim get user by id'),
  (req, res) => {
  const id: number = +req.params.userId;
  console.log(`Retreiving Reinbursement For User ID: ${id}`);
  let rebuse = reinbursements.filter(ele => ele.author == id);
  for(let p = 0; p< rebuse.length; p++){
      for(let x = 0; x < rebuse.length-1; x++){
          if(rebuse[x].dateSubmitted > rebuse[x+1].dateSubmitted){
              let t = rebuse[x+1];
              rebuse[x+1] = rebuse[x];
              rebuse[x] = t;
          }
      }
  }
  if (rebuse) {
    res.json(rebuse);
  } else {
    res.status(404);
    res.send(`Reimbursement with User ID number: ${id} does not exist`)
  }
})

reimbursementRouter.patch('', 
  authMiddleware(users),
  roleCheck('finance-manager', 'block', 'reimbursement update'), 
  (req, res) => {
    const { body } = req; // destructuring
    console.log(`Updating Reimbursements's Info`);
    const selectre = reinbursements.find((ele) => {
      return ele.reimbursementId === body.reimbursementId;
    });
    if (!selectre) {
      res.sendStatus(404);
    } else {
      for (let field in selectre) {
        if (body[field] !== undefined) {
          selectre[field] = body[field];
        }
      }
      UploadReimbursementUpdate(selectre, res);
      console.log(`Update Complete`);
    } 
})
  
