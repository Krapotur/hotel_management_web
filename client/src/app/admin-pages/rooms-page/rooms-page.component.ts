import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {NgForOf, NgIf} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {Floor, Hotel, Room} from "../../shared/interfaces";
import {RoomsService} from "../../shared/services/rooms.service";
import {MaterialService} from "../../shared/classes/material.service";
import {MatSelectModule} from "@angular/material/select";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-rooms-page',
  standalone: true,
  imports: [
    NgForOf,
    MatButtonModule,
    NgIf,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './rooms-page.component.html',
  styleUrl: './rooms-page.component.scss'
})
export class RoomsPageComponent implements OnInit, OnDestroy {

  @Input('hotelId') hotelId: string
  form: FormGroup
  rSub: Subscription
  hotel: Hotel
  room: Room
  floors: Floor[] = []
  isEdit = true
  quantityRooms = 0
  statuses = ['Готов', 'На уборке', 'Не готов']

  constructor(private roomsService: RoomsService) {
  }

  ngOnInit() {
    this.getRooms()
  }

  ngOnDestroy() {
    if (this.rSub) {
      this.rSub.unsubscribe()
    }
  }

  getRooms() {
    let floors = []
    this.rSub = this.roomsService.getAll().subscribe({
      next: rooms => {

        let roomsHotel = rooms.filter(room => room.hotel == this.hotelId)
        this.quantityRooms = roomsHotel.length
        for (let i = 0; i < roomsHotel.length; i++) {
          if (!floors.includes(roomsHotel[i].floor)) {
            floors.push(roomsHotel[i].floor)
          }
        }

        floors.sort((a, b) => a - b)

        for (let i = 0; i < floors.length; i++) {
          let floor: Floor = {
            numberFloor: floors[i],
            rooms: []
          }

          for (let j = 0; j < roomsHotel.length; j++) {
            if (roomsHotel[j].floor == floors[i]) {
              floor.rooms.push(roomsHotel[j])
              floor.rooms.sort((a, b) => a.numberRoom - b.numberRoom)
            }
          }
          this.floors.push(floor)
        }
      },
      error: error => MaterialService.toast(error.error.message)
    })
  }

  addRoom() {
    let room: Room = {
      numberRoom: 7,
      floor: 2,
      status: 'isDirty',
      comments: ['Застелить постель'],
      hotel: this.hotelId
    }
    this.rSub = this.roomsService.create(room).subscribe({
      next: message => MaterialService.toast(message.message)
    })
  }

  selectRoom(room: Room) {
    this.room = room
    this.isEdit = !this.isEdit
    this.generateForm()
  }

  generateForm(){
    this.form = new FormGroup({
      status: new FormControl(this.room.status),
      comment: new FormControl(this.room.comments)
    })
  }

  onSubmit(){
    let room = {
      _id: this.room._id,
      status: this.form.get('status').value,
      comments: this.form.get('comment').value
    }
    this.rSub = this.roomsService.update(room).subscribe({
      next: message => MaterialService.toast(message.message),
      error: error => MaterialService.toast(error.error.message)
    })
    this.isEdit = !this.isEdit
  }

  deleteRoom(room: Room) {
    this.rSub = this.roomsService.delete(room).subscribe({
      next: message => MaterialService.toast(message.message)
    })
  }
}

