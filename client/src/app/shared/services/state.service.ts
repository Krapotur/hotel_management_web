import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  showTemplate = false
  quantityFloors = 0

  constructor() {
  }

}
