import {Component, DoCheck, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {MaterialService} from "../../shared/classes/material.service";
import {Hotel, House, User} from "../../shared/interfaces";
import {Subscription} from "rxjs";
import {UsersService} from "../../shared/services/users.service";
import {HousesService} from "../../shared/services/houses.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FilterUsersPipe} from "../../shared/pipes/filter-users.pipe";

@Component({
  selector: 'app-house-page',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    FilterUsersPipe
  ],
  templateUrl: './house-edit-page.component.html',
  styleUrl: './house-edit-page.component.scss'
})
export class HouseEditPageComponent implements OnInit,DoCheck, OnDestroy {
  form: FormGroup
  title = 'Новый дом'
  image: File
  houseID = ''
  uSub: Subscription
  hSub: Subscription
  house: House
  houses: Hotel [] = []
  users: User[] = []
  isDelete = false

  @ViewChild('inputImg') inputImgRef: ElementRef

  constructor(private usersService: UsersService,
              private houseService: HousesService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.generateForm()
    this.houseID = this.route.snapshot.params['id']
    this.getHouseById()
  }

  ngDoCheck() {
    this.isDelete ? this.form.disable() : this.form.enable()
  }

  ngOnDestroy() {
    if (this.uSub) {
      this.uSub.unsubscribe()
    }

    if (this.hSub) {
      this.hSub.unsubscribe()
    }
  }

  getHouseById() {
    this.getUsers()
    if (this.houseID) {
      this.hSub = this.houseService.getHouseById(this.houseID).subscribe({
        next: house => {
          this.house = house
          this.generateForm(this.house)
        },
        error: error => MaterialService.toast(error.error.message),
      })
    }
  }

  generateForm(house?: House) {
    house ? this.title = house.title : this.title = 'Новый дом'

    this.form = new FormGroup({
      title: new FormControl(house ? house.title : null, [Validators.required, Validators.minLength(3)]),
      floors: new FormControl(house ? house.floors : null, [Validators.required, Validators.min(1), Validators.max(4)]),
      users: new FormControl(house ? house.personal : '')
    })
  }

  getUsers() {
    this.uSub = this.usersService.getUsers().subscribe({
      next: users => {
        this.users = users.filter(user => user.post == "Горничная")
      },
      error: error => console.log(error.error.message)
    })
  }

  onSubmit() {
    let title = this.form.get('title').value
    let house = {
      title: title.toLowerCase().charAt(0).toUpperCase() + title.slice(1),
      floors: this.form.get('floors').value,
      personal: this.form.get('users').value
    }

    if (!this.houseID) {
      this.hSub = this.houseService.create(house, this.image).subscribe({
        next: message => MaterialService.toast(message.message),
        error: error => MaterialService.toast(error.error.message)
      })
      this.router.navigate(['management/houses']).then()
    } else {
      const fd = new FormData()
      fd.append('title', house.title)
      fd.append('floors', house.floors.toString())

      for (let i = 0; i < house.personal.length; i++) {
        fd.append('personal', house.personal[i])
      }

      if (this.image) {
        fd.append('image', this.image, this.image.name)
      }

      this.hSub = this.houseService.update(this.house, fd).subscribe({
        next: message => MaterialService.toast(message.message),
        error: error => MaterialService.toast(error.error.message)
      })
      this.router.navigate(['management/houses']).then()
    }
  }

  uploadImg($event: any) {
    this.image = $event.target.files[0]
  }

  triggerClick() {
    this.inputImgRef.nativeElement.click()
  }

  openHousesPage() {
    this.router.navigate(['admin-panel/houses'])
  }

  deleteHouse() {
    this.hSub = this.houseService.delete(this.houseID).subscribe({
      next: message => MaterialService.toast(message.message),
      error: error => MaterialService.toast(error.error.message)
    })
    this.router.navigate([`admin-panel/houses`])
  }

}
