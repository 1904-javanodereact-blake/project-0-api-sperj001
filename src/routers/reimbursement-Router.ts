import express from 'express'; 
import { authMiddleware } from '../middleware/auth.middleware';
import { users, RT, RS} from '../state';
import { roleCheck } from '../middleware/roleCheckmiddleware';
import { Reimbursement } from '../model/reimbursement';
import { reinbursements } from '../state';
import { UpdateServerBasis, UpdateReimbursements } from '../DAOs/updaters';
import { UploadNewReimbursement, UploadReimbursementUpdate } from '../DAOs/uploader';
import { ReimbursementStatus } from '../model/ReimbursementStatus';
import { ReimbursementType } from '../model/ReimbursementType';
import { crypt } from '../middleware/ecrypt';


export const reimbursementRouter = express.Router();

reimbursementRouter.get('/home', [
  authMiddleware(users),
  (req, res) => {
    console.log(`Redirecting User To User Homepage`);
    res.redirect(`/reimbursementsmainpage.html`);
  }])

reimbursementRouter.get('', [
  authMiddleware(users),
  async(req, res) => {
    await UpdateServerBasis();
    const index: number = +req.params.startlocation;
    let queryString = "";
    let aIndex = index + 5;
    //let maxIndex = reinbursements.length-1;
    let more = true;
    /*if(maxIndex <= aIndex){
      more = false;
      aIndex = maxIndex;
    }*/
    console.log(reinbursements);
    for(let i = 0; i<reinbursements.length; i++){
        queryString += `ReimbursementID=${reinbursements[i].reimbursementId}&Author=${reinbursements[i].author}&Status=${reinbursements[i].status.status}`
        if(i!=aIndex){
          queryString += '+';
      }
    }
    queryString += `*more&${more}`;
    console.log(queryString);
    res.redirect(`http://localhost:8080/reimbursementsalllistpage.html?:${crypt(queryString)}`);
    console.log(`Sending To Reimbursement All List`);

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
        try{
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
          res.redirect(`/specificreimbursement.html?:${crypt(queryString)}`);
          }
        }
        catch{
          res.status(404);
          res.redirect("http://localhost:8080/usererrorpage.html")
        }
})
reimbursementRouter.post("/specificreimbursement", [
authMiddleware(users),
    roleCheck("employee", 'block', 'reim create do'),
    async (req, res) => {
        try{
          await UpdateReimbursements();
          let id = req.body.searchReimbursement;
          let locator = 0;
          for(let i = 0; i<reinbursements.length; i++){
            if(id == reinbursements[i].reimbursementId){
              locator = i;
            }
          }
          let reburse = reinbursements[locator];
          let {reimbursementId, author, dateSubmitted, dateResolved, resolver, status, type} = reburse;
          console.log(reburse);
          let queryString = `reimbursementId=${reimbursementId}&author=${author}&dateSubmitted=${dateSubmitted}&dateResolved=${dateResolved}&resolver=${resolver}&status=${status.status}&type=${type.type}`;
          console.log("Sending User To Specified Reimbursement Page");
          res.redirect(`/specificreimbursement.html?:${crypt(queryString)}`);
        }
        catch{
          res.status(404);
          res.redirect("http://localhost:8080/usererrorpage.html")
        }
      }])
/*
reimbursementRouter.get('',
//    authMiddleware(users),
//    roleCheck("employee"),
    (req, res) => {
        console.log(`Getting All Reimbursements`);
        res.send(reinbursements);
})
*/
reimbursementRouter.post('/status/:statusId', 
  authMiddleware(users),
  roleCheck("finance-manager", 'block', 'reimburse status get'),
  async (req, res) => {
  await UpdateServerBasis();
    try{
      const index: number = +req.params.startlocation;
      const getAuthor = req.body.searchid;
      let queryString = "";
      let aIndex = index + 5;
      //let maxIndex = reinbursements.length-1;
      let more = true;
      /*if(maxIndex <= aIndex){
        more = false;
        aIndex = maxIndex;
      }*/
      console.log(reinbursements.length);
      for(let i = 0; i<reinbursements.length; i++){
        console.log(reinbursements[i].status.status, getAuthor);
        if(reinbursements[i].status.status == getAuthor){
          queryString += `ReimbursementID=${reinbursements[i].reimbursementId}&Author=${reinbursements[i].author}&Status=${reinbursements[i].status.status}`
          if(i!=aIndex){
            queryString += '+';
          }
        }
      }
      queryString += `*more&${more}`;
      console.log(queryString);
      res.redirect(`http://localhost:8080/reimbursementsstatuspage.html?:${crypt(queryString)}`);
      console.log(`Sending To Reimbursement By Author`);
    }
    catch{
      res.status(404);
      res.redirect("http://localhost:8080/usererrorpage.html")
    }
})
//still need to add the functionality but have added the start for the url
reimbursementRouter.post('/author/:startlocation', 
  authMiddleware(users),
  roleCheck("finance-manager", 'allow', 'reim get user by id'),
  async (req, res) => {
    await UpdateServerBasis();
    try{
      const index: number = +req.params.startlocation;
      const getAuthor = parseFloat(req.body.author);
      let queryString = "";
      let aIndex = index + 5;
      //let maxIndex = reinbursements.length-1;
      let more = true;
      /*if(maxIndex <= aIndex){
        more = false;
        aIndex = maxIndex;
      }*/
      console.log(reinbursements);
      for(let i = 0; i<reinbursements.length; i++){
        if(reinbursements[i].author == getAuthor){
          queryString += `ReimbursementID=${reinbursements[i].reimbursementId}&Author=${reinbursements[i].author}&Status=${reinbursements[i].status.status}`
          if(i!=aIndex){
            queryString += '+';
          }
        }
      }
      queryString += `*more&${more}`;
      console.log(queryString);
      res.redirect(`http://localhost:8080/reimbursementsauthorlistpage.html?:${crypt(queryString)}`);
      console.log(`Sending To Reimbursement By Author`);
    }
    catch{
      res.status(404);
      res.redirect("http://localhost:8080/usererrorpage.html")
    }
})

reimbursementRouter.post('/update',
  authMiddleware(users),
  roleCheck('finance-manager', 'block', 'reimbursemnt update start'),
  async (req, res) => {
    await UpdateServerBasis(); 
    try{
      console.log(req.body);
      const id: number = req.body.searchId * 1;
      console.log(`Retreiving reimbursement with id: ${id}`);
      let reburse: Reimbursement;
      reinbursements.forEach(ele => {
        if(id == ele.reimbursementId){
          reburse = ele;
          console.log(ele);
          return;  
        }
      })
      let queryString = `reimbursementId=${reburse.reimbursementId}&author=${reburse.author}&amount=${reburse.amount}&dateSubmitted=${reburse.dateSubmitted}&dateResolved=${reburse.dateResolved}&description=${reburse.description}&status=${reburse.status.status}&type=${reburse.type.type}&resolver=${reburse.resolver}`;
      console.log(queryString);
      res.redirect(`http://localhost:8080/updatereimbursementpage.html?:${crypt(queryString)}`);
    } 
    catch{
      res.status(404);
      res.redirect("http://localhost:8080/usererrorpage.html")
    }
  })

reimbursementRouter.post('/update/complete', 
  authMiddleware(users),
  roleCheck('finance-manager', 'block', 'reimbursement update'), 
  (req, res) => {
    /*
    reimbursementId: number;
    author: number;
    amount: number;  
    dateSubmitted: number; 
    dateResolved: number;
    description: string; 
    resolver: number; 
    status: ReimbursementStatus;
    type: ReimbursementType;
    */
    const { body } = req; // destructuring
    console.log(`Updating Reimbursements's Info`);
    let selectre = reinbursements.find((ele) => {
      return ele.reimbursementId === body.reimbursementId;
    });
    if (!selectre) {
      res.sendStatus(404);
    } else {
      selectre.reimbursementId = parseFloat(body.reimbursementId);
      selectre.author = body.author;
      selectre.amount = body.amount;
      selectre.dateResolved = body.dateResolved;
      selectre.description = body.description;
      selectre.resolver = body.resolver;
      for(let i = 0; i<RS.length; i++){
        if(RS[i].status == body.status){
          console.log(selectre);
          console.log("Status")
          selectre.status = RS[i];
        }
      }
      for(let i = 0; i<RT.length; i++){
        if(RT[i].type == body.type){
          console.log(selectre);
          console.log("Type");
          selectre.type = RT[i];
        }
      }
      try{
      UploadReimbursementUpdate(selectre, res);
      console.log(`Update Complete`);
      }
      catch{
        res.status(404);
        res.redirect("http://localhost:8080/usererrorpage.html")
      }
    } 
})