import {Component, DoCheck, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {Hotel, Room, User} from "../../shared/interfaces";
import {StateService} from "../../shared/services/state.service";
import {HotelsService} from "../../shared/services/hotels.service";
import {Subscription} from "rxjs";
import { Router} from "@angular/router";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {UsersService} from "../../shared/services/users.service";
import {RoomsService} from "../../shared/services/rooms.service";
import {MaterialService} from "../../shared/classes/material.service";
import {FilterUsersPipe} from "../../shared/pipes/filter-users.pipe";

@Component({
  selector: 'app-hotel-create-page',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    JsonPipe,
    FilterUsersPipe
  ],
  templateUrl: './hotel-create-page.component.html',
  styleUrl: './hotel-create-page.component.scss'
})
export class HotelCreatePageComponent implements OnInit, DoCheck, OnDestroy {
  form: FormGroup
  title = ''
  quantityFloors = 0
  floors = []
  isErrorRequired = false
  image: File
  hotel: Hotel
  user: User
  personal: User
  users: User[] = []
  personalList: User[] = []
  params: string
  hSub: Subscription
  rSub: Subscription
  uSub: Subscription

  constructor(private router: Router,
              private stateService: StateService,
              private hotelService: HotelsService,
              private roomsService: RoomsService,
              private usersService: UsersService) {
  }

  @ViewChild('inputImg') inputImgRef: ElementRef
  @ViewChild('matOption') matOption: MatOptionModule

  ngOnInit() {
    this.generateForm()
    this.getUsers()
  }

  ngDoCheck() {
    this.createArrForFloors()
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

  generateForm() {
    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      floors: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      floor1: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      floor2: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      floor3: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      floor4: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      startRoom1: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      startRoom2: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      startRoom3: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      startRoom4: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      endRoom1: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      endRoom2: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      endRoom3: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      endRoom4: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      users: new FormControl('')
    })
  }

  getUsers() {
    this.uSub = this.usersService.getUsers().subscribe({
      next: users => {
        this.users = users.filter(user => user.post == "Горничная")

        for (let i = 0; i < this.users.length; i++) {
          for (let j = 0; j < users[i].hotels.length; j++) {
            if (users[i].hotels[j] == this.form.get('title').value) {
              this.personalList.push(users[i])
            }
          }
        }
      },
      error: error => console.log(error.error.message)
    })
    this.checkQuantityFloors(this.form.get('floors').value)
  }

  createArrForFloors() {
    this.floors = []
    if (this.form.get('floors').value > 4) {
      setTimeout(() => {
        this.form.get('floors').reset()
      }, 5000)
    }

    if (this.floors.length < 1) {
      for (let i = 1; i <= this.quantityFloors && i < 5; i++) {
        this.floors.push(i)
      }
    }
  }

  setValueInInputFloors() {
    let startFloor = this.form.get('floor1').value

    if (startFloor > 0) {

      for (let i = 1; i <= this.floors.length; i++) {
        this.form.controls['floor' + i].setValue(startFloor++)
      }

      for (let i = 1; i <= this.floors.length; i++) {
        this.form.controls['floor' + i].disable()
      }
    }
  }

  checkQuantityFloors(numberFloors: number) {
    this.quantityFloors = numberFloors
    this.isErrorRequired = false
    if (this.quantityFloors != this.stateService.quantityFloors) {
      for (let i = 1; i <= this.floors.length; i++) {
        this.form.controls['floor' + i].reset()
        this.form.controls['floor' + i].enable()
        this.form.get('startRoom' + i).reset()
        this.form.get('endRoom' + i).reset()
      }
    }
    this.stateService.quantityFloors = this.quantityFloors
    this.title = this.form.get('title').value
  }


  checkRooms(start: string, end: string, floor: string) {
    let floorRequired = this.form.get(floor).hasError('required')
    let startRoomRequired = this.form.get(start).hasError('required')
    let endRoomRequired = this.form.get(end).hasError('required')

    let floorTouched = this.form.get(floor).touched
    let startRoomTouched = this.form.get(start).touched
    let endRoomTouched = this.form.get(end).touched

    if (this.form.get(start).value > this.form.get(end).value) {
      setTimeout(() => {
        this.form.get(start).reset()
        this.form.get(end).reset()
      }, 5000)
    }
    this.isErrorRequired = floorRequired && floorTouched;
    this.isErrorRequired = startRoomRequired && startRoomTouched;
    this.isErrorRequired = endRoomRequired && endRoomTouched;
  }

  uploadImg($event: any) {
    this.image = $event.target.files[0]
  }

  triggerClick() {
    this.inputImgRef.nativeElement.click()
  }

  onSubmit() {
    if (this.form.get('startRoom1').value) {
      let title = this.form.get('title').value
      let hotel: Hotel = {
        title:  title.toLowerCase().charAt(0).toUpperCase() + title.slice(1),
        floors: this.quantityFloors,
        personal: this.form.get('users').value
      }

      this.hSub = this.hotelService.create(hotel, this.image).subscribe({
        next: hotel => {
          if (hotel) {
            this.createRooms(hotel)
            this.openHotelsPage()
          } else MaterialService.toast(`Гостиница "${this.form.get('title').value}" уже существует`)
        },
        error: error => MaterialService.toast(error.error.message),
      })
      this.image = null
    }
  }

  createRooms(hotel: Hotel) {
    let room: Room = {
      hotelTitle: hotel.title,
      roomsStr: []
    }

    for (let i = 1; i <= this.floors.length; i++) {
      room.roomsStr.push(this.form.get('floor' + i).value + '-' + this.form.get('startRoom' + i).value + '-' + this.form.get('endRoom' + i).value)
    }

    setTimeout(() => {
      this.rSub = this.roomsService.create(room).subscribe({
        next: message => MaterialService.toast(message.message),
        error: error => MaterialService.toast(error.error.message)
      })
    }, 2000)
  }

  openHotelsPage() {
    this.router.navigate(['admin-panel/hotels']).then()
  }

  protected readonly Number = Number;
}
