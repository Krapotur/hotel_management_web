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
      next: message =>MaterialService.toast(message.message),
      error: error => MaterialService.toast(error.error.message),
    })
    this.router.navigate(['admin-panel/hotels'])
    this.updateUser(this.form.get('users').value)
  }


  updateUser(users: string[]) {
    let arr = []
    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < this.users.length; j++) {
        if ((this.users[j].lastName + ' ' + this.users[j].firstName) == users[i]) {
          arr.push(this.users[j])
        }
      }
    }

    for (let i = 0; i < arr.length; i++) {
      let user = {
        _id: arr[i]._id,
        lastName: arr[i].lastName,
        firstName: arr[i].firstName,
        post: arr[i].post,
        hotel: this.form.get('title').value,
        phone: arr[i].phone,
        login: arr[i].login
      }

      setTimeout(() => {
        this.uSub = this.userService.update(user).subscribe({
          next: message => MaterialService.toast(message.message),
          error: error => MaterialService.toast(error.error.message)
        })
      }, 1000)
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
    this.uSub = this.userService.getUsers().subscribe({
      next: users => {
        this.users = users
        users.filter(user => {
          if (user.post === 'Горничная') {
            if (!this.personalList.includes(user.lastName + ' ' + user.firstName)) {
              this.personalList.push(user.lastName + ' ' + user.firstName)
            }
          }
        })
      },
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
          if (this.users[i].hotels[j] === this.hotel.title){
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
