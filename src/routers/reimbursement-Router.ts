import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { users } from '../state';
import { roleCheck } from '../middleware/roleCheckmiddleware';
import { Reimbursement } from '../model/reimbursement';
import { ReimbursementStatus } from '../model/ReimbursementStatus';
import { ReimbursementType } from '../model/ReimbursementType';
import { mypool } from '../middleware/DAOmiddleware';


export const reimbursementRouter = express.Router();

reimbursementRouter.post('/create',
    authMiddleware(users),
    roleCheck('employee', 'block', 'reim create do'),
    async (req, res) => {
      console.log(`Creating New Reimbursement`);
      const myclient = await mypool.connect();
      try {
        // get id for new reimbursement
        await  myclient.query(`SET SCHEMA 'ERS';`);
        const q1 = 'Select Count(reimbursementid) from reimbursements';
        const resp1 = await myclient.query(q1);
        const id = resp1.rows[0].count;
        // get type for new reimbursement
        await  myclient.query(`SET SCHEMA 'ERS';`);
        const q2 = `Select typeid from reimbursementtype where type = '${req.body.type}'`;
        const resp2 = await myclient.query(q2);
        const tid = resp2.rows[0].typeid;
        const setStat = new ReimbursementStatus(0, 'Pending');
        const setType = new ReimbursementType(parseFloat(tid), req.body.type);
        const subReb = new Reimbursement((parseFloat(id) + 1), req.session.user.userid, parseFloat(req.body.amount), new Date().getTime(), undefined, req.body.description, undefined, setStat, setType);
        console.log(subReb);
        const query = `INSERT INTO reimbursements(reimbursementid, author, amount, datesubmitted, description, statusid, typeid)
        VALUES (${subReb.reimbursementId},${subReb.author},${subReb.amount},${subReb.dateSubmitted},'${subReb.description}', ${subReb.status.statusId},${subReb.type.typeId});`;
        console.log(query);
        const resp = await myclient.query(query);
        const reimbursement = (resp.rows);
        console.log(reimbursement);
        res.send('Success');
        console.log(`Created Reimbursement`);
      }
      catch {
        console.log(`ERROR`);
        res.status(404);
      }
      myclient.release();
});
// to be deleted
reimbursementRouter.get('/specific/:id', [
authMiddleware(users),
    roleCheck('employee', 'block', 'reim create do'),
    async (req, res) => {
      const myclient = await mypool.connect();
      try {
        const getID = +req.params.id * 1;
        await  myclient.query(`SET SCHEMA 'ERS';`);
        const query = `Select reimbursements.reimbursementid, a.firstname as  authorfirst, a.lastname as authorlast, reimbursements.amount, reimbursements.datesubmitted, reimbursements.dateresolved, reimbursements.description, rt.type, rs.status, b.firstname as resolverfirst, b.lastname as resolverlast
        From reimbursements
        Left join users a
        ON reimbursements.author = a.userid
        Left join users b
        On reimbursements.resolver = b.userid
        Left join reimbursementstatus rs
        On reimbursements.statusid = rs.statusid
        Left join reimbursementtype rt
        On reimbursements.typeid = rt.typeid
        where reimbursements.reimbursementid = '${getID}';`;
        console.log(query);
        const resp = await myclient.query(query);
        const reimbursement = (resp.rows);
        console.log(reimbursement);
        res.json(reimbursement);
        console.log(`Sending Reimbursement By ID ${getID}`);
      }
      catch {
        console.log(`ERROR`);
        res.status(404);
      }
      myclient.release();
    }]);

reimbursementRouter.get('/status/:status',
  authMiddleware(users),
  roleCheck('finance-manager', 'block', 'reimburse status get'),
  async (req, res) => {
    const myclient = await mypool.connect();
      try {
        const getStatus = req.params.status;
        console.log(getStatus + 'Status' + req.params.id + 'param');
        await  myclient.query(`SET SCHEMA 'ERS';`);
        const query = `Select reimbursements.reimbursementid, a.firstname as  authorfirst, a.lastname as authorlast, reimbursements.amount, reimbursements.datesubmitted, reimbursements.dateresolved, reimbursements.description, rt.type, rs.status, b.firstname as resolverfirst, b.lastname as resolverlast
        From reimbursements
        Left join users a
        ON reimbursements.author = a.userid
        Left join users b
        On reimbursements.resolver = b.userid
        Left join reimbursementstatus rs
        On reimbursements.statusid = rs.statusid
        Left join reimbursementtype rt
        On reimbursements.typeid = rt.typeid
        where rs.status = '${getStatus}';`;
        console.log(query);
        const resp = await myclient.query(query);
        const reimbursement = (resp.rows);
        console.log(reimbursement);
        res.json(reimbursement);
        console.log(`Sending To Reimbursement By Status`);
      }
      catch {
        console.log(`ERROR`);
        res.status(404);
      }
      myclient.release();
});
// allows for the author to be gotten via either the id or the name of the author
reimbursementRouter.get('/author/:id',
  authMiddleware(users),
  roleCheck('finance-manager', 'allow', 'reim get user by id'),
  async (req, res) => {
    const myclient = await mypool.connect();
    try {
      const getAuthor = req.params.id;
      console.log(getAuthor);
      await  myclient.query(`SET SCHEMA 'ERS';`);
      let query;
      if (isNaN(+getAuthor)) {
      query = `Select reimbursements.reimbursementid, a.firstname as  authorfirst, a.lastname as authorlast, reimbursements.amount, reimbursements.datesubmitted, reimbursements.dateresolved, reimbursements.description, rt.type, rs.status, b.firstname as resolverfirst, b.lastname as resolverlast
      From reimbursements
      Left join users a
      ON reimbursements.author = a.userid
      Left join users b
      On reimbursements.resolver = b.userid
      Left join reimbursementstatus rs
      On reimbursements.statusid = rs.statusid
      Left join reimbursementtype rt
      On reimbursements.typeid = rt.typeid
      where concat(a.firstname, ' ', a.lastname) = '${getAuthor}';`;
      }
      else {
        query = `Select reimbursements.reimbursementid, a.firstname as  authorfirst, a.lastname as authorlast, reimbursements.amount, reimbursements.datesubmitted, reimbursements.dateresolved, reimbursements.description, rt.type, rs.status, b.firstname as resolverfirst, b.lastname as resolverlast
        From reimbursements
        Left join users a
        ON reimbursements.author = a.userid
        Left join users b
        On reimbursements.resolver = b.userid
        Left join reimbursementstatus rs
        On reimbursements.statusid = rs.statusid
        Left join reimbursementtype rt
        On reimbursements.typeid = rt.typeid
        where reimbursements.author = '${getAuthor}';`;
      }
      console.log(query);
      const resp = await myclient.query(query);
      const reimbursement = (resp.rows);
      console.log(reimbursement);
      res.json(reimbursement);
      console.log(`Sending To Reimbursement By Author`);
    }
    catch {
      console.log(`ERROR`);
      res.status(404);
    }
    myclient.release();
});

reimbursementRouter.patch('/update',
  authMiddleware(users),
  roleCheck('finance-manager', 'block', 'reimbursement update'),
  async (req, res) => {
    const { body } = req; // destructuring
    console.log(`Updating Reimbursements's Info`);
    // tslint:disable-next-line:prefer-const;
    if (body) {
      // tslint:disable-next-line:prefer-const
      let selectre = new Reimbursement(body.reimbursementId, body.author, parseFloat(body.amount), body.dateSubmitted, (new Date().getTime()), body.description, req.session.user.userId, new ReimbursementStatus(0, body.status), new ReimbursementType(0, body.type));
      // need to get author, status, and type into ID's
      const myclient = await mypool.connect();
      selectre.resolver = req.session.user.userid;
      console.log(req.session.user);
      console.log(selectre);
      try {
        // set the author for the update
        await  myclient.query(`SET SCHEMA 'ERS';`);
        const q1 = `Select author From reimbursements Where reimbursementid = ${selectre.reimbursementId};`;
        const resp1 = await myclient.query(q1);
        const newAuthor = resp1.rows[0].author;
        selectre.author = newAuthor;
        console.log(selectre);
        // set the status id for the update
        await  myclient.query(`SET SCHEMA 'ERS';`);
        const q2 = `Select statusid From reimbursementstatus Where status = '${selectre.status.status}';`;
        const resp2 = await myclient.query(q2);
        const newStatus = resp2.rows[0].statusid;
        selectre.status.statusId = parseFloat(newStatus);
        console.log(selectre);
        // set the type id for the update
        await  myclient.query(`SET SCHEMA 'ERS';`);
        const q3 = `Select typeid From reimbursementtype Where type = '${selectre.type.type}';`;
        const resp3 = await myclient.query(q3);
        const newType = resp3.rows[0].typeid;
        selectre.type.typeId = parseFloat(newType);
        console.log(selectre);
        try {
          console.log(`Update Complete`);
          let query;
          query = `UPDATE reimbursements
          SET amount = ${selectre.amount}, dateresolved = ${selectre.dateResolved}, description = '${selectre.description}', resolver = ${selectre.resolver}, statusid = ${selectre.status.statusId}, typeid = ${selectre.type.typeId}
          WHERE reimbursementid = ${selectre.reimbursementId};`;
          console.log(query);
          const resp = await myclient.query(query);
          const reimbursement = (resp.rows);
          console.log(reimbursement);
          res.send('Success');
          console.log(`Sending To Reimbursement By Author`);
        }
        catch {
          console.log(`ERROR`);
          res.status(404);
        }
      }
      catch {
        console.log(`EARLY ERROR`);
          res.status(404);
      }
    myclient.release();
    }
    else {
      console.log(`ERROR`);
      res.status(404);
    }
});
/*
`SET SCHEMA 'ERS';
                UPDATE riembursements
                SET reimbursementid = ${reburse.reimbursementId}, author = ${reburse.author}, amount = ${reburse.amount}, datesubmitted = ${reburse.amount}, dateresolved = ${reburse.dateResolved}, description = '${reburse.description}', resolver = ${reburse.resolver}, statusid = ${reburse.status.statusId}, typeid = ${reburse.type.typeId}
                WHERE userid = ${reburse.reimbursementId};`
*/