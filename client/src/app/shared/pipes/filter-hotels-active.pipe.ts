import { Pipe, PipeTransform } from '@angular/core';
import {Hotel, User} from "../interfaces";

@Pipe({
  name: 'filterHotelsActive',
  standalone: true
})
export class FilterHotelsActivePipe implements PipeTransform {

  transform(hotels: Hotel[]): Hotel[] {
    return hotels.filter(hotel => hotel.status)
  }

}
