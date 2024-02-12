import {Injectable, OnDestroy} from '@angular/core';
import {RoomsService} from "./rooms.service";
import {UsersService} from "./users.service";
import {HotelsService} from "./hotels.service";
import {MaterialService} from "../classes/material.service";
import {Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GetDateService implements OnDestroy{

  uSub: Subscription

  constructor(private hotelsService: HotelsService,
              private roomsService: RoomsService,
              private usersService: UsersService) {
  }

 ngOnDestroy() {
    if (this.uSub){
      this.uSub.unsubscribe()
    }
 }

  getPersonal(): string[]{
    let personalList = []
     this.uSub = this.usersService.getUsers().subscribe({
      next: users => {
        users.filter(user => {
          if (user.post === 'Горничная') {
            if (!personalList.includes(user.lastName + ' ' + user.firstName)) {
              personalList.push(user.lastName + ' ' + user.firstName)
            }
          }
        })
      },
      error: error => MaterialService.toast(error.error.message)
    })
    return personalList
  }
}
