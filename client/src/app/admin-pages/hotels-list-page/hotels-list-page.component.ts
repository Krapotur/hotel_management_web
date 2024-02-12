import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {Hotel, User} from "../../shared/interfaces";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {PostsPageComponent} from "../posts-page/posts-page.component";
import {ReactiveFormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {Subscription} from "rxjs";
import {HotelsService} from "../../shared/services/hotels.service";
import {UsersService} from "../../shared/services/users.service";
import {FilterUsersPipe} from "../../shared/pipes/filter-users.pipe";
import {MaterialService} from "../../shared/classes/material.service";
import {HousesListComponent} from "../houses-list/houses-list.component";

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
    HousesListComponent
  ],
  templateUrl: './hotels-list-page.component.html',
  styleUrl: './hotels-list-page.component.scss'
})
export class HotelsListPageComponent implements OnInit, AfterViewInit, OnDestroy {
  showTemplate = false
  dataSource: MatTableDataSource<Hotel>
  hSub: Subscription
  uSub: Subscription
  hotels: Hotel[] =[]

  constructor(private router: Router,
              private hotelService: HotelsService,
              private userService: UsersService) {

  }

  displayedColumns: string[] = ['#', 'title', 'floors',  'personal', 'edit'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.getHotels()
    this.getUsers()
  }

  ngAfterViewInit() {
    this.getHotels()
  }

  ngOnDestroy() {
    if (this.hSub) {
      this.hSub.unsubscribe()
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
        this.hotels.map(hotel => hotel.position = position++)
        this.dataSource = new MatTableDataSource<Hotel>(this.hotels)
        this.dataSource.paginator = this.paginator
      }
    })
  }

  getUsers() {
    this.uSub = this.userService.getUsers().subscribe({
      next: users => {
        this.hotels.forEach(hotel => hotel.personal = [])

        for (let i = 0; i < this.hotels.length; i++) {
          for (let k = 0; k < users.length; k++) {
            for (let j = 0; j < users[k].hotels.length; j++) {
              if (this.hotels[i].title === users[k].hotels[j]) {
                this.hotels[i].personal.push(users[k].lastName + ' ' + users[k].firstName)
              }
            }
          }
        }
      },
      error: error => MaterialService.toast(error.error.message)
    })
  }

  openCreateHotelPage(hotel?: Hotel){
    if(hotel){
      this.router.navigate([`admin-panel/hotel-edit/${hotel._id}`])
    } else {
      this.router.navigate(['admin-panel/hotel-create'])
    }
  }
}
