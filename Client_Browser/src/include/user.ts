export class User {
  userid: number;
  username: string;
  passkey: string;
  firstname: string;
  lastname: string;
  email: string;
  givenrole: string;
  img: string;

  constructor(userid = 0, username = '', passkey = '', firstname = '', lastname = '', email = '', givenrole: string, img: string) {
    this.userid = userid;
    this.username = username;
    this.passkey = passkey;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.givenrole = givenrole;
    this.img = img;
  }
}