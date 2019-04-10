import { User } from "./model/user";
import { role } from "./model/role";
import { Reimbursement } from "./model/reimbursement";
import { ReimbursementStatus } from "./model/ReimbursementStatus";
import { ReimbursementType } from "./model/ReimbursementType";

export let roles: role[] = [
  new role(1, 'finance-manager'),
  new role(2, 'employee'),
  new role(3, "admin"),
];

export let users: User[] = [
  new User(roles[0].roleId, "User1", "Allow1Man2Access", "Joseph", "Sperduto", "josephsperduto@gmail.com", roles[0]),
  new User(roles[1].roleId, "User2", "OpenSesame", "Lauren", "Smith", "ididntask@gmail.com", roles[1]),
  new User(roles[2].roleId, "User3", "password", "Guest", "Guest", "default@default.com", roles[2])
];

let RS: ReimbursementStatus[] = [
  new ReimbursementStatus(0, "Pending"),
  new ReimbursementStatus(0, "Approved"),
  new ReimbursementStatus(2, "Denied")
]

let RT: ReimbursementType[] = [
  new ReimbursementType(0, "Travel"),
  new ReimbursementType(1, "Meeting"),
  new ReimbursementType(2, "Other")
]
export let reinbursements: Reimbursement[] = [
  new Reimbursement(1, 1, 100, new Date('2012.08.10').getTime() / 1000, 4/9/2017, 'Travel Expendature', 1, RS[0], RT[2]),
  new Reimbursement(2, 2, 200, new Date('2012.07.10').getTime() / 1000, new Date('2013.08.10').getTime() / 1000, 'Lawsuit filed', 1, RS[1], RT[1]),
  new Reimbursement(3, 3, 300, new Date('2018.08.10').getTime() / 1000, null, "Pay me, I'm bored", 1, RS[2], RT[0]),
]
