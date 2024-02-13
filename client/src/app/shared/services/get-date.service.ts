import {Injectable, OnDestroy} from '@angular/core';
import {RoomsService} from "./rooms.service";
import {UsersService} from "./users.service";
import {HotelsService} from "./hotels.service";
import {MaterialService} from "../classes/material.service";
import {Subscription} from "rxjs";
import {Hotel, Personal, User} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class GetDateService implements OnDestroy {

  uSub: Subscription
  rSub: Subscription

  constructor(private hotelsService: HotelsService,
              private roomsService: RoomsService,
              private usersService: UsersService) {
  }

  ngOnDestroy() {
    if (this.uSub) {
      this.uSub.unsubscribe()
    }
    if (this.rSub) {
      this.rSub.unsubscribe()
    }
  }

  getPersonal(hotel: Hotel): Personal {
    console.log(hotel)
    let personal: Personal = {}

    this.uSub = this.usersService.getUsers().subscribe({
      next: users => {

        users.forEach(user => {
          if (hotel.personal.includes(user._id)) {
            console.log(user)
            personal.personalHotel.push(user.lastName + ' ' + user.firstName)
          }
        })
      },
      error: error => MaterialService.toast(error.error.message)
    })
    return personal
  }

}
