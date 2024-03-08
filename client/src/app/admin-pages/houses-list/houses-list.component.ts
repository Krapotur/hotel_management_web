import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {House, User} from "../../shared/interfaces";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {UsersService} from "../../shared/services/users.service";
import {Subscription} from "rxjs";
import {HousesService} from "../../shared/services/houses.service";
import {MaterialService} from "../../shared/classes/material.service";
import {Router} from "@angular/router";
import {StatusPipe} from "../../shared/pipes/status.pipe";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FilterStatusActivePipe} from "../../shared/pipes/filter-status-active.pipe";
import {FindPipe} from "../../shared/pipes/find.pipe";
import {AuthService} from "../../shared/services/auth.service";
import {MatProgressBarModule} from "@angular/material/progress-bar";

@Component({
  selector: 'app-houses-list',
  standalone: true,
  imports: [
    MatButtonModule,
    MatPaginatorModule,
    MatTableModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    NgOptimizedImage,
    StatusPipe,
    MatSlideToggleModule,
    FilterStatusActivePipe,
    FindPipe,
    MatProgressBarModule,
  ],
  templateUrl: './houses-list.component.html',
  styleUrl: './houses-list.component.scss'
})
export class HousesListComponent implements OnInit, OnDestroy {
  showTemplate = false
  isAdmin = false
  isEdit = false
  dataSource: MatTableDataSource<House>
  form: FormGroup
  house: House
  houses: House [] = []
  users: User[] = []
  personal: string[] = []
  uSub: Subscription
  hSub: Subscription
  search = '';


  statuses = ['Готов', 'Не готов']
  displayedColumns: string[] = ['#', 'name', 'floors', 'personal', 'edit', 'status'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private usersService: UsersService,
              private auth: AuthService,
              private houseService: HousesService,
              private router: Router) {
  }

  ngOnInit() {
    this.getHouses()
    if (JSON.parse(localStorage['user']).post !== 'Администратор') this.isAdmin = true
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
    this.uSub = this.usersService.getUsers().subscribe({
      next: users => {
        this.users = users.filter(user => user.post == 'Горничная')

        this.houses.forEach(house => {
          let arr = house.personal
          house.personal = []
          for (const user of this.users) {
            if (arr.includes(user._id)) {
              house.personal.push(user.lastName + ' ' + user.firstName)
            }
          }
        })
      },
      error: error => MaterialService.toast(error.error.message)
    })
  }

  getHouses() {
    this.hSub = this.houseService.getAll().subscribe({
      next: houses => {
        this.houses = houses
        let position = 1
        this.getUsers()
        this.houses.map(house => house.position = position++)
        this.dataSource = new MatTableDataSource<House>(this.houses);
        this.dataSource.paginator = this.paginator
      },
      error: error => MaterialService.toast(error.error.message)
    })
  }

  openHousePage(house?: House) {
    if (house && this.isAdmin) {
      this.router.navigate([`admin-panel/house-edit/${house._id}`]).then()
    } else this.router.navigate([`admin-panel/house-edit`], {
      queryParams: {
        new: true
      }
    }).then()
  }

  openTemplateEditStatus(house: House) {
    this.isEdit = true
    this.house = house
    this.generateForm(house)
  }

  generateForm(house: House) {
    let status = ''
    switch (house.statusReady) {
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
      comment: new FormControl(house.comments)
    })
  }

  onSubmit() {
    let status = ''
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

    let house = {
      _id: this.house._id,
      statusReady: status,
      comments: status === 'isReady' ? '' : this.form.get('comment').value
    }

    this.hSub = this.houseService.update(house).subscribe({
      next: message => MaterialService.toast(message.message),
      error: error => MaterialService.toast(error.error.message)
    })

    this.isEdit = !this.isEdit
    this.router.navigateByUrl('/').then(() => {
      this.router.navigate([`management/houses`]).then()
    })

  }

  changeStatus(house: House) {
    let fd = new FormData()
    fd.set('status', (!house.status).toString())

    this.hSub = this.houseService.update(house, fd).subscribe({
      next: message => MaterialService.toast(message.message),
      error: error => MaterialService.toast(error.error.message)
    })
  }
}
