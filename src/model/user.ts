import { role } from './role';

export class User {
  userId: number;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  role: role;

  constructor(userId = 0, username = '', password = '', firstname = '', lastname = '', email = '', role: role) {
    this.userId = userId;
    this.username = username;
    this.password = password;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.role = role;
  }
}