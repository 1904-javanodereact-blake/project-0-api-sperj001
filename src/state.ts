import { User } from './model/user';
import { role } from './model/role';
import { ReimbursementStatus } from './model/ReimbursementStatus';
import { ReimbursementType } from './model/ReimbursementType';

export let roles: role[] = [
  new role(1, 'finance-manager'),
  new role(2, 'employee'),
  new role(3, 'admin'),
];

export let users: User[] = [
  new User(1, 'User1', 'Allow1Man2Access', 'Joseph', 'Sperduto', 'josephsperduto@gmail.com', roles[0]),
  new User(2, 'User2', 'OpenSesame', 'Lauren', 'Smith', 'ididntask@gmail.com', roles[1]),
  new User(3, 'User3', 'password', 'Guest', 'Guest', 'default@default.com', roles[2])
];

export let RS: ReimbursementStatus[] = [
  new ReimbursementStatus(0, 'Pending'),
  new ReimbursementStatus(1, 'Approved'),
  new ReimbursementStatus(2, 'Denied')
];

export let RT: ReimbursementType[] = [
  new ReimbursementType(0, 'Travel'),
  new ReimbursementType(1, 'Meeting'),
  new ReimbursementType(2, 'Other')
];

