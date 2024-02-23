import {Component, DoCheck, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
  isHotel = false
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
      users: new FormControl(this.personal)
    })
  }

  checkHotel() {
    this.hotelService.getAll().subscribe({
      next: hotels => {
        hotels.forEach(hotel => {
          if (hotel.title == this.form.get('title').value) {
            this.isHotel = true
            MaterialService.toast(`Гостиница "${hotel.title}" уже есть!`)
          } else {
            this.isHotel = false
          }
        })
      }
    })
  }

  onSubmit() {
    let isHotel = false
    let personal = []
    let title = this.form.get('title').value

    this.users.forEach(user => {
      if (this.form.get('users').value.includes(user.lastName + ' ' + user.firstName)) {
        personal.push(user._id)
      }
    })

    let hotel: Hotel = {
      _id: this.hotelId,
      title: title.toLowerCase().charAt(0).toUpperCase() + title.slice(1),
      personal: personal
    }

    if (!isHotel) {
      const fd = new FormData()
      fd.append('title', hotel.title)
      if (hotel.floors) {
        fd.append('floors', hotel.floors.toString())
      }

      for (let i = 0; i < hotel.personal.length; i++) {
        fd.append('personal', hotel.personal[i])
      }

      if (this.image) {
        fd.append('image', this.image, this.image.name)
      }
      this.hSub = this.hotelService.update(hotel._id, fd).subscribe({
        next: message => MaterialService.toast(message.message),
        error: error => MaterialService.toast(error.error.message),
      })
      this.router.navigate(['admin-panel/hotels'])
    }
  }

  getHotelById() {
    this.hSub = this.hotelService.getHotelById(this.hotelId).subscribe({
      next: hotel => {
        this.hotel = hotel
        this.getUsers()
        this.generateForm()
      },
      error: error => MaterialService.toast(error.error.message)
    })
  }

  getUsers() {
    this.uSub = this.userService.getUsers().subscribe({
      next: users => {
        this.users = users
        users.forEach(user => {
          if (this.hotel.personal.includes(user._id)) this.personal.push(user.lastName + ' ' + user.firstName)
          if (user.post == 'Горничная') this.personalList.push(user.lastName + ' ' + user.firstName)
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
      error: error => MaterialService.toast(error.error.message),
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

  openHotelsPage() {
    this.router.navigate([`admin-panel/hotels`])
  }
}
