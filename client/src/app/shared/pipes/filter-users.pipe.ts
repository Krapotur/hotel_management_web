import {Pipe, PipeTransform} from '@angular/core';
import {User} from "../interfaces";

@Pipe({
  name: 'filterUsers',
  standalone: true
})
export class FilterUsersPipe implements PipeTransform {
  transform(userID: string, users: User[]): string {
    let personal = ''

    users.forEach(user => {
      if (userID === user._id) personal = user.lastName + ' ' + user.firstName
    })
    return personal;
  }
}
