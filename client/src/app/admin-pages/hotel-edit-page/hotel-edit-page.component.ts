import {AfterViewInit, Component, DoCheck, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {HotelsService} from "../../shared/services/hotels.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Floor, Hotel, Room, User} from "../../shared/interfaces";
import {Subscription} from "rxjs";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {RoomsPageComponent} from "../rooms-page/rooms-page.component";
import {RoomsService} from "../../shared/services/rooms.service";
import {MaterialService} from "../../shared/classes/material.service";
import {UsersService} from "../../shared/services/users.service";
import {HotelPageComponent} from "../hotel-page/hotel-page.component";
import {GetDateService} from "../../shared/services/get-date.service";


@Component({
  selector: 'app-hotel-edit-page',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NgOptimizedImage,
    MatSlideToggleModule,
    RoomsPageComponent,
    HotelPageComponent,
    RouterLink
  ],
  templateUrl: './hotel-edit-page.component.html',
  styleUrl: './hotel-edit-page.component.scss'
})
export class HotelEditPageComponent implements OnInit, DoCheck, OnDestroy {
  form: FormGroup
  hotel: Hotel
  image: File
  hotelId: string
  floors: Floor[] = []
  users: User[] = []
  roomsHotel: Room[] = []
  personalList: string[] = []
  personal: string[] = []
  hSub: Subscription
  uSub: Subscription
  rSub: Subscription
  quantityRooms = 0
  isDelete = false
  isEdit = false

  @ViewChild('inputImg') inputImgRef: ElementRef

  constructor(private hotelService: HotelsService,
              private userService: UsersService,
              private roomsService: RoomsService,
              private getDataService: GetDateService,
              private route: ActivatedRoute,
              private router: Router
  ) {
  }

  ngOnInit() {
    this.hotelId = this.route.snapshot.params['id']
    this.getHotelById()
    this.getRooms()
  }

  ngDoCheck() {
    this.isDelete ? this.form.disable() : this.form.enable()
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
    this.isEdit = !this.isEdit
    this.form = new FormGroup({
      title: new FormControl(this.hotel.title),
      users: new FormControl(this.hotel.personal)
    })
  }

  onSubmit() {
    let hotel: Hotel = {
      _id: this.hotelId,
      title: this.form.get('title').value,
      personal: this.form.get('users').value
    }

    this.hSub = this.hotelService.update(hotel, this.image).subscribe({
      next: message => MaterialService.toast(message.message),
      error: error => MaterialService.toast(error.error.message),
    })
    this.router.navigate(['admin-panel/hotels'])
    this.findAndSortUsers(this.form.get('users').value)
  }

  findAndSortUsers(users: string[]) {
    let listUsersForAddHotel: User[] = []

    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < this.users.length; j++) {
        if ((this.users[j].lastName + ' ' + this.users[j].firstName) == users[i]) {

          if (this.users[j].hotels.length == 0) listUsersForAddHotel.push(this.users[j])

          for (let k = 0; k < this.users[j].hotels.length; k++) {
            if (!this.users[j].hotels[k].includes(this.hotel.title)) {
              listUsersForAddHotel.push(this.users[j])
            }
          }
        }
      }
    }
    if (listUsersForAddHotel.length > 0) this.updateUsers(listUsersForAddHotel, users)

    if (listUsersForAddHotel.length == 0 && users.length !== 0) {
      for (let k = 0; k < users.length; k++) {
        for (let i = 0; i < this.users.length; i++) {
          for (let j = 0; j < this.users[i].hotels.length; j++) {

            if (this.users[i].hotels[j] == this.hotel.title && this.users[i].lastName + ' ' + this.users[i].firstName !== users[k]) {
              let user = {
                _id: this.users[i]._id,
                lastName: this.users[i].lastName,
                firstName: this.users[i].firstName,
                post: this.users[i].post,
                hotel: this.form.get('title').value,
                phone: this.users[i].phone,
                login: this.users[i].login
              }

              setTimeout(() => {
                this.uSub = this.userService.update(user).subscribe({
                  next: message => MaterialService.toast(message.message),
                  error: error => MaterialService.toast(error.error.message)
                })
              }, 1000)
            }
          }
        }
      }
    }
  }

  updateUsers(users?: User[], personal?: string[]) {
    for (let i = 0; i < users.length; i++) {
      let user = {
        _id: users[i]._id,
        lastName: users[i].lastName,
        firstName: users[i].firstName,
        post: users[i].post,
        hotel: this.form.get('title').value,
        phone: users[i].phone,
        login: users[i].login
      }

      setTimeout(() => {
        this.uSub = this.userService.update(user).subscribe({
          next: message => MaterialService.toast(message.message),
          error: error => MaterialService.toast(error.error.message)
        })
      }, 1000)
    }

    if (personal.length == 0 ){
      for (let i = 0; i < this.users.length; i++) {
        for (let j = 0; j < this.users[i].hotels.length; j++) {

          if (this.users[i].hotels[j] == this.hotel.title ) {
            let user = {
              _id: this.users[i]._id,
              lastName: this.users[i].lastName,
              firstName: this.users[i].firstName,
              post: this.users[i].post,
              hotel: this.form.get('title').value,
              phone: this.users[i].phone,
              login: this.users[i].login
            }

            setTimeout(() => {
              this.uSub = this.userService.update(user).subscribe({
                next: message => MaterialService.toast(message.message),
                error: error => MaterialService.toast(error.error.message)
              })
            }, 1500)
          }
        }
      }
    }
  }

  getHotelById() {
    this.hSub = this.hotelService.getHotelById(this.hotelId).subscribe({
      next: hotel => {
        for (let k = 0; k < hotel.personal.length; k++) {
          this.personal.push(hotel.personal[k])
        }
        this.hotel = hotel
        this.generateForm()
        this.getUsers()
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

  triggerClick() {
    this.inputImgRef.nativeElement.click()
  }

  uploadImg($event) {
    this.image = $event.target.files[0]
  }

  deleteHotel() {
    this.hSub = this.hotelService.delete(this.hotelId).subscribe({
      next: message => MaterialService.toast(message.message),
      error: error => MaterialService.toast(error.error.message)
    })
    this.router.navigate([`admin-panel/hotels`])

    this.deleteRooms()
    this.deletePersonal()
  }

  deleteRooms() {
    this.getRooms()
    setTimeout(() => {
      this.rSub = this.roomsService.delete(this.roomsHotel[0]).subscribe({
        next: message => MaterialService.toast(message.message),
        error: error => MaterialService.toast(error.error.message)
      })
    }, 2000)
  }

  deletePersonal() {
    let users: User[] = []
    for (let i = 0; i < this.users.length; i++) {
      for (let j = 0; j < this.users[i].hotels.length; j++) {
        if (this.users[i].hotels[j] === this.hotel.title) {
          users.push(this.users[i])
        }
      }
    }

    users.forEach(user => {
      let userNew: User = {
        _id: user._id,
        hotels: user.hotels,
        hotel: this.hotel.title
      }

      setTimeout(() => {
        this.uSub = this.userService.update(userNew).subscribe({
          next: message => MaterialService.toast(message.message),
          error: error => MaterialService.toast(error.error.message)
        })
      }, 2000)
    })
  }

  openHotelsPage() {
    this.router.navigate([`admin-panel/hotels`])
  }
}
