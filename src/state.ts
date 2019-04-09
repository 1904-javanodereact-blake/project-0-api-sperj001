import { User } from "./model/user";
import { role } from "./model/role";

export let roles: role[] = [
  new role(1, 'admin'),
  new role(2, 'associate'),
  new role(3, "guest"),
];

export let users: User[] = [
  new User(roles[0].roleId, "User1", "Allow1Man2Access", "Joseph", "Sperduto", "josephsperduto@gmail.com", roles[0]),
  new User(roles[1].roleId, "User2", "OpenSesame", "Lauren", "Smith", "ididntask@gmail.com", roles[1]),
  new User(roles[2].roleId, "User3", "password", "Guest", "Guest", "default@default.com", roles[3])
];