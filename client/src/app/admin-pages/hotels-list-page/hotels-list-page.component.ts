import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {Hotel, Room} from "../../shared/interfaces";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {PostsPageComponent} from "../posts-page/posts-page.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {find, Subscription} from "rxjs";
import {HotelsService} from "../../shared/services/hotels.service";
import {UsersService} from "../../shared/services/users.service";
import {FilterUsersPipe} from "../../shared/pipes/filter-users.pipe";
import {MaterialService} from "../../shared/classes/material.service";
import {HousesListComponent} from "../houses-list/houses-list.component";
import {RoomsService} from "../../shared/services/rooms.service";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FilterStatusActivePipe} from "../../shared/pipes/filter-status-active.pipe";
import {MatIconModule} from "@angular/material/icon";
import {FindPipe} from "../../shared/pipes/find.pipe";

@Component({
  selector: 'app-hotels-list-page',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    PostsPageComponent,
    MatInputModule,
    RouterLink,
    FilterUsersPipe,
    HousesListComponent,
    NgOptimizedImage,
    MatSlideToggleModule,
    FilterStatusActivePipe,
    FormsModule,
    MatIconModule,
    FindPipe
  ],
  templateUrl: './hotels-list-page.component.html',
  styleUrl: './hotels-list-page.component.scss'
})
export class HotelsListPageComponent implements OnInit, AfterViewInit, OnDestroy {
  showTemplate = false
  dataSource: MatTableDataSource<Hotel>

  hSub: Subscription
  rSub: Subscription
  uSub: Subscription
  hotels: Hotel[] = []
  isAdmin = false
  search = ''

  constructor(private router: Router,
              private hotelService: HotelsService,
              private roomService: RoomsService,
              private userService: UsersService) {

  }

  displayedColumns: string[] = ['#', 'title', 'floors', 'quantityRooms', 'personal', 'edit', 'status'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.getHotels()
    if(JSON.parse(localStorage['user']).post !== 'Администратор') this.isAdmin = true
  }

  ngAfterViewInit() {
    this.getHotels()
  }

  ngOnDestroy() {
    if (this.hSub) {
      this.hSub.unsubscribe()
    }
    if (this.rSub) {
      this.rSub.unsubscribe()
    }
    if (this.uSub) {
      this.uSub.unsubscribe()
    }
  }

  getHotels() {
    this.hSub = this.hotelService.getAll().subscribe({
      next: hotels => {
        let position = 1
        this.hotels = hotels
        this.getUsers(this.hotels)
        this.getQuantityRoomsInHotel(this.hotels)
        this.hotels.map(hotel => hotel.position = position++)
        this.dataSource = new MatTableDataSource<Hotel>(this.hotels)
        this.dataSource.paginator = this.paginator
      }
    })
  }

  getPercentReadyRooms(rooms: Room[]){
    let quantityRooms = rooms.length
    let readyRooms = 0
    let percent: number

    rooms.forEach(room=> {
      if (room.status == 'isReady') readyRooms++
    })

    percent = (readyRooms / quantityRooms) * 100

    return Math.round(percent)
  }

  getUsers(hotels: Hotel[]) {
    this.uSub = this.userService.getUsers().subscribe({
      next: users => {
       hotels.forEach(hotel => {
          let arr = hotel.personal
          hotel.personal = []

          for (const user of users) {
            if (arr.includes(user._id)) hotel.personal.push(user.lastName + ' ' + user.firstName)
          }
        })
      },
      error: error => MaterialService.toast(error.error.message)
    })
  }

  getQuantityRoomsInHotel(hotels: Hotel[]) {
    this.rSub = this.roomService.getAll().subscribe({
      next: rooms => {

        hotels.map(hotel => {
          let notReadyRooms = 0
          let inProcessRooms = 0
          let roomsHotel = rooms.filter( room => hotel._id == room.hotel)
          hotel.percentReadyRooms = this.getPercentReadyRooms(roomsHotel)
          hotel.quantityRooms = roomsHotel.length

          roomsHotel.forEach(room => {
            if (room.status == 'notReady') notReadyRooms++
            if (room.status == 'inProcess') inProcessRooms++
          })
          hotel.notReadyRooms = notReadyRooms
          hotel.inProcessRooms = inProcessRooms
        })
      }
    })
  }

  openCreateHotelPage(hotel?: Hotel) {
    if (hotel) {
      if(this.isAdmin) {
        this.router.navigate([`admin-panel/hotel-edit/${hotel._id}`], {
          queryParams: {
            edit: true
          }
        }).then()
      }else this.router.navigate([`management/hotel/${hotel._id}`]).then()
    } else {
      this.router.navigate(['admin-panel/hotel-create']).then()
    }
  }

  changeStatus(hotel: Hotel){
    let fd = new FormData()
    fd.set('status', (!hotel.status).toString())

    this.hSub = this.hotelService.update(hotel._id, fd).subscribe({
      next: message => MaterialService.toast(message.message),
      error: error => MaterialService.toast(error.error.message)
    })
  }

  protected readonly find = find;
}
