import {Component, DoCheck, OnDestroy, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {RoomsPageComponent} from "../rooms-page/rooms-page.component";
import {MaterialService} from "../../shared/classes/material.service";
import {Hotel, Room, User} from "../../shared/interfaces";
import {Subscription} from "rxjs";
import {HotelsService} from "../../shared/services/hotels.service";
import {UsersService} from "../../shared/services/users.service";
import {RoomsService} from "../../shared/services/rooms.service";
import {ActivatedRoute} from "@angular/router";
import {GetDateService} from "../../shared/services/get-date.service";

@Component({
  selector: 'app-hotel-page',
  standalone: true,
    imports: [
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        NgForOf,
        NgIf,
        NgOptimizedImage,
        ReactiveFormsModule,
        RoomsPageComponent
    ],
  templateUrl: './hotel-page.component.html',
  styleUrl: './hotel-page.component.scss'
})
export class HotelPageComponent implements OnInit, DoCheck, OnDestroy{
  hotelId: string
  hotel: Hotel
  users: User[] = []
  roomsHotel: Room[] = []
  personalList: string[] = []
  personal: string[] = []
  hSub: Subscription
  uSub: Subscription
  rSub: Subscription
  quantityRooms = 0

  constructor(private hotelService: HotelsService,
              private userService: UsersService,
              private roomsService: RoomsService,
              private getDataService: GetDateService,
              private route: ActivatedRoute
              ) {
  }


  ngOnInit() {
    this.hotelId = this.route.snapshot.params['id']
    this.getHotelById()
    this.getRooms()
    this.getUsers()
  }

  ngDoCheck() {
  }

  ngOnDestroy() {
    if (this.hSub) {
      this.hSub.unsubscribe()
    }
    if (this.uSub) {
      this.uSub.unsubscribe()
    }
    if (this.rSub) {
      this.rSub.unsubscribe()
    }
  }

  getHotelById() {
    this.hSub = this.hotelService.getHotelById(this.hotelId).subscribe({
      next: hotel => {
        for (let k = 0; k < hotel.personal.length; k++) {
          this.personal.push(hotel.personal[k])
        }
        this.hotel = hotel
      },
      error: error => MaterialService.toast(error.error.message)
    })
  }

  getUsers() {
    this.personalList = this.getDataService.getPersonal()

    this.uSub = this.userService.getUsers().subscribe({
      next: users => this.users = users,
      error: error => MaterialService.toast(error.error.message)
    })
  }

  getRooms() {
    this.rSub = this.roomsService.getAll().subscribe({
      next: rooms => {
        this.roomsHotel = rooms.filter(room => room.hotel === this.hotelId)
        this.quantityRooms = this.roomsHotel.length
      },
      error: error => MaterialService.toast(error.error.message)
    })

  }
}
