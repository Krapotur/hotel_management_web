import {Component, DoCheck, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {HotelsService} from "../../shared/services/hotels.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Floor, Hotel, Room, User} from "../../shared/interfaces";
import {Subscription} from "rxjs";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {RoomsPageComponent} from "../rooms-page/rooms-page.component";
import {RoomsService} from "../../shared/services/rooms.service";
import {MaterialService} from "../../shared/classes/material.service";
import {UsersService} from "../../shared/services/users.service";


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
    RoomsPageComponent
  ],
  templateUrl: './hotel-edit-page.component.html',
  styleUrl: './hotel-edit-page.component.scss'
})
export class HotelEditPageComponent implements OnInit, DoCheck, OnDestroy {
  form: FormGroup
  hotel: Hotel
  title = ''
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
  @ViewChild('modal') modalRef: ElementRef

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

  generateForm() {
    this.isEdit = !this.isEdit
    this.form = new FormGroup({
      title: new FormControl(this.hotel.title),
      users: new FormControl(this.hotel.personal)
    })
  }

  onSubmit() {
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
    this.deleteRooms()
    this.deletePersonal()

    this.router.navigate([`admin-panel/hotels`])
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
    console.log(users)
    let user: User = {
        _id: users[0]._id,
        hotels: users[0].hotels,
        hotel: users[0].hotel
    }

    console.log(user)
    setTimeout(() => {
      this.uSub = this.userService.update(user).subscribe({
        next: message => MaterialService.toast(message.message),
        error: error => MaterialService.toast(error.error.message)
      })
    }, 2000)
  }

  openHotelsPage() {
    this.router.navigate([`admin-panel/hotel-edit/${this.hotelId}`])
  }
}
