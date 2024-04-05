import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {NgForOf, NgIf} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {Floor, Hotel, Room} from "../../shared/interfaces";
import {RoomsService} from "../../shared/services/rooms.service";
import {MaterialService} from "../../shared/classes/material.service";
import {MatSelectModule} from "@angular/material/select";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

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
  addForm: FormGroup
  rSub: Subscription
  isParams = false
  hotel: Hotel
  room: Room
  title = ''
  floors: Floor[] = []
  isEdit = true
  isDelete = false
  isAddRoom = false
  quantityRooms = 0
  statuses = ['Готов', 'Не готов']

  constructor(private roomsService: RoomsService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.getRooms()
    this.route.queryParams.subscribe(params => {
      if (params['edit']) this.isParams = true
    })

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

  selectRoom(room?: Room) {
    if (room) {
      this.room = room
      this.isEdit = !this.isEdit
      this.generateForm()
    } else {
      this.isAddRoom = !this.isAddRoom
      this.generateAddForm()
    }
  }

  generateForm() {
    let status = ''
    switch (this.room.status) {
      case 'isReady': {
        status = 'Готов'
      }
        break;
      case 'notReady': {
        status = 'Не готов'
      }
        break;
    }

    this.form = new FormGroup({
      status: new FormControl(status),
      task: new FormControl(this.room.tasks),
    })
  }

  generateAddForm() {
    this.addForm = new FormGroup({
      numberRoom: new FormControl(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(4000)]),
      floor: new FormControl(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(5)]),
    })
  }

  onSubmit() {
    let status = 'isReady'

    let room: Room = {
    }

    if (this.room) {
      switch (this.form.get('status').value) {
        case 'Готов': {
          status = 'isReady'
        }
          break;
        case 'Не готов': {
          status = 'notReady'
        }
          break;
      }

      room._id = this.room._id
      room.numberRoom = this.room.numberRoom
      room.status = status
      room.tasks = this.form.get('task').value
      room.hotel = this.room.hotel

      this.rSub = this.roomsService.update(room).subscribe({
        next: message => MaterialService.toast(message.message),
        error: error => MaterialService.toast(error.error.message)
      })

      setTimeout(()=>{
        this.router.navigateByUrl('/').then(() => {
          this.router.navigate([`management/hotel/${this.hotelId}`]).then()
        })
      },600)

      this.isEdit = !this.isEdit
    }

    if (this.isAddRoom) {
      let room: Room = {
        numberRoom: this.addForm.get('numberRoom').value,
        floor: this.addForm.get('floor').value,
        hotel:this.hotelId
      }

      this.rSub = this.roomsService.create(room).subscribe({
        next: message => MaterialService.toast(message.message),
        error: error => MaterialService.toast(error.error.message)
      })

      setTimeout(()=>{
        this.router.navigateByUrl('/').then(() => {
          this.router.navigate([`admin-panel/hotel-edit/${this.hotelId}`], {queryParams: {
              edit: true}
          }).then()
        })
      },600)
      this.isAddRoom = !this.isAddRoom
    }
  }

  openTemplateDelete(room: Room) {
    this.isDelete = !this.isDelete
    this.room = room
  }

  deleteRoom() {
    this.rSub = this.roomsService.delete(this.room).subscribe({
      next: message => {
        MaterialService.toast(message.message)
        this.isDelete = !this.isDelete
      }
    })

    setTimeout(()=>{
      this.router.navigateByUrl('/').then(() => {
        this.router.navigate([`admin-panel/hotel-edit/${this.hotelId}`], {queryParams: {
            edit: true}
        }).then()
      })
    },600)
  }
}

