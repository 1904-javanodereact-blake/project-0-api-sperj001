import { BehaviorSubject } from 'rxjs';
import { User } from '../include/user';

// tslint:disable-next-line:no-null-keyword
const userStream = new BehaviorSubject<User | null>(null);

export const $user = userStream.asObservable();

export function updateCurrentUser(user: User | null) {
    userStream.next(user);
}