import { Pipe, PipeTransform } from '@angular/core';
import {Hotel, User} from "../interfaces";

@Pipe({
  name: 'filterUsers',
  standalone: true
})
export class FilterUsersPipe implements PipeTransform {

  transform(users: User[], hotel: Hotel): User[] {
    return users.filter(user =>         user.hotels.includes(hotel.title));
  }

}
