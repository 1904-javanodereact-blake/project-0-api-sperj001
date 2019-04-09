import express from 'express'; 
import { authMiddleware } from '../middleware/auth.middleware';
import { users} from '../state';
import { roleCheck } from '../middleware/roleCheckmiddleware';
import { Reimbursement } from '../model/reimbursement';
import { reinbursements } from '../state';

export const reimbursementRouter = express.Router();

reimbursementRouter.post('',
    authMiddleware(users),
    roleCheck("employee"),
    (req, res) => {
        console.log(`Creating New Reimbursement`);
        console.log(req.body);
        const reburse:Reimbursement = req.body.entry;
        reburse.reimbursementId = reinbursements.length +1;
        reinbursements.push(reburse);
        res.status(201);
        res.send(reburse);
        console.log(`Pending Reimbursement Added`);
})

reimbursementRouter.get('',
    authMiddleware(users),
    roleCheck("employee"),
    (req, res) => {
        console.log(`Getting All Reimbursements`);
        res.send(reinbursements);
})

reimbursementRouter.get('/status/:statusId', 
  authMiddleware(users),
  roleCheck("finance-manager", 'allow'),
  (req, res) => {
  const id: number = +req.params.statusId;
  console.log(`Retreiving Reinbursement With ID: ${id}`);
  const rebuse = reinbursements.find(u => u.reimbursementId === id);
  if (rebuse) {
    res.json(rebuse);
  } else {
    res.status(404);
    res.send(`Reinbursement with ID number: ${id} does not exist`)
  }
})