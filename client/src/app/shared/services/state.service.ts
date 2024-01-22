import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  showTemplate = ''
  quantityFloors = 0

  constructor() {
  }

  changeTemplate(name: string) {
    switch (name) {
      case 'newUser': {
        this.showTemplate = 'newUser'
      }
        break;
      case 'newPost': {
        this.showTemplate = 'newPost'
      }
        break;
      default: {
        this.showTemplate = ''
      }
    }
  }
}
