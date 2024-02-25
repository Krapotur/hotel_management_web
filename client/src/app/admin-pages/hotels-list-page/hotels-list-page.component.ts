import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {Hotel, User} from "../../shared/interfaces";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {PostsPageComponent} from "../posts-page/posts-page.component";
import {ReactiveFormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {Subscription} from "rxjs";
import {HotelsService} from "../../shared/services/hotels.service";
import {UsersService} from "../../shared/services/users.service";
import {FilterUsersPipe} from "../../shared/pipes/filter-users.pipe";
import {MaterialService} from "../../shared/classes/material.service";
import {HousesListComponent} from "../houses-list/houses-list.component";
import {RoomsService} from "../../shared/services/rooms.service";

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
    NgOptimizedImage
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

  constructor(private router: Router,
              private hotelService: HotelsService,
              private roomService: RoomsService,
              private userService: UsersService) {

  }

  displayedColumns: string[] = ['#', 'title', 'floors', 'quantityRooms', 'personal', 'edit'];

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
          let roomsHotel = rooms.filter( room => hotel._id == room.hotel)

          hotel.quantityRooms = roomsHotel.length
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
        })
      }else this.router.navigate([`management/hotel/${hotel._id}`])
    } else {
      this.router.navigate(['admin-panel/hotel-create'])
    }
  }
}
