import { Component, DoCheck, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {User} from "../../shared/interfaces";
import {MatButtonModule} from "@angular/material/button";
import {NgForOf, NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule,} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {PostsPageComponent} from "../posts-page/posts-page.component";
import {StateService} from "../../shared/services/state.service";
import {Router, RouterLink} from "@angular/router";
import {UsersService} from "../../shared/services/users.service";
import {Subscription} from "rxjs";
import {HotelsService} from "../../shared/services/hotels.service";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MaterialService} from "../../shared/classes/material.service";


@Component({
  selector: 'app-users-page',
  standalone: true,
    imports: [
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        NgIf,
        NgForOf,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        PostsPageComponent,
        RouterLink,
        MatSlideToggleModule
    ],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss'
})
export class UsersPageComponent implements OnInit, DoCheck, OnDestroy {
  form: FormGroup
  post = new FormControl('')
  users: User[]
  uSub: Subscription
  hSub: Subscription
  isShowTemplate = false

  dataSource: MatTableDataSource<User>

  constructor(private stateService: StateService,
              private usersService: UsersService,
              private hotelService: HotelsService,
              private router: Router) {
  }

  displayedColumns: string[] = ['#', 'name', 'post', 'phone', 'hotel', 'login', 'edit', 'status'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.getUsers()
  }

  ngDoCheck() {
    this.isShowTemplate = this.stateService.showTemplate
  }

  ngOnDestroy() {
    if (this.uSub) {
      this.uSub.unsubscribe()
    }
    if (this.hSub) {
      this.hSub.unsubscribe()
    }
  }

  getUsers() {
    let position = 1
    this.uSub = this.usersService.getUsers().subscribe({
      next: users => {
        this.users = users.filter(user => user.post != 'admin')
        this.users.map(user => user.position = position++)
        this.checkAndAddHotelForUser()
        this.dataSource = new MatTableDataSource<User>(this.users)
        this.dataSource.paginator = this.paginator;
      },
      error: error => MaterialService.toast(error.error.message)
    })
  }

  openCreateUserPage(user?: User) {
    if (user) {
      this.router.navigate(["admin-panel/user-create"], {
        queryParams: {
          userID: user._id
        }
      }).then()
    } else {
      this.router.navigate(['admin-panel/user-create']).then()
    }
  }

  checkAndAddHotelForUser(){
    this.hSub = this.hotelService.getAll().subscribe({
      next: hotels => {
        hotels.forEach(hotel => {
          hotel.personal.forEach(personal => {
            this.users.map(user => {
              if (personal == user._id) user.hotels.push(hotel.title)
            })
          })
        })
      }
    })
  }

  changeStatus(u: User){
      let user = {
        _id: u._id,
        status: !u.status
      }

      this.uSub = this.usersService.update(user).subscribe({
        next: message => MaterialService.toast(message.message),
        error: error => MaterialService.toast(error.error.message)
      })
  }

}
