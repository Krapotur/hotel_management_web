import {AfterViewInit, Component, DoCheck, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {Hotel, User} from "../../shared/interfaces";
import {StateService} from "../../shared/services/state.service";
import {HotelsService} from "../../shared/services/hotels.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {UsersService} from "../../shared/services/users.service";

@Component({
  selector: 'app-hotel-create-page',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    JsonPipe
  ],
  templateUrl: './hotel-create-page.component.html',
  styleUrl: './hotel-create-page.component.scss'
})
export class HotelCreatePageComponent implements OnInit, DoCheck, OnDestroy, AfterViewInit {
  form: FormGroup
  title = ''
  titleForm = ''
  quantityFloors = 0
  floors = []
  isErrorRequired = false
  isEdit = false
  isDelete = false
  image: File
  hotel: Hotel
  user: User
  personal: User
  users: User[] = []
  personalList: User[] = []
  params: string
  hSub: Subscription
  uSub: Subscription

  constructor(private router: Router,
              private route: ActivatedRoute,
              private stateService: StateService,
              private hotelService: HotelsService,
              private usersService: UsersService) {
  }

  @ViewChild('inputImg') inputImgRef: ElementRef
  @ViewChild('matOption') matOption: MatOptionModule

  ngOnInit() {
    this.getParams()
    this.generateForm()
    this.getUsers()
  }

  ngDoCheck() {
    this.createArrForFloors()
    this.isDelete ? this.form.disable() : this.form.enable()
  }

  ngOnDestroy() {
    if (this.hSub) {
      this.hSub.unsubscribe()
    }
    if (this.uSub) {
      this.uSub.unsubscribe()
    }
  }

  ngAfterViewInit() {

  }

  generateForm() {
    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      floors: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      floor1: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      floor2: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      floor3: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      floor4: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      startRoom1: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      startRoom2: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      startRoom3: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      startRoom4: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      endRoom1: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      endRoom2: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      endRoom3: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      endRoom4: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      users: new FormControl('')
    })
    this.getHotelById(this.params)

  }

  getParams() {
    this.route.queryParams.subscribe(params => {
      this.params = params['hotelID']
    })
    this.params ? this.isEdit = true : this.isEdit = false
  }

  getHotelById(id: string) {
    if (id) {
      this.uSub = this.hotelService.getHotelById(id).subscribe({
        next: hotel => {
          this.form.get('title').setValue(hotel.title)
          this.form.get('floors').setValue(hotel.floors)
          this.form.get('users').setValue(hotel.personal)
          this.titleForm = hotel.title

          this.checkQuantityFloors(hotel.floors)
          for (let i = 0; i < hotel.roomsStr.length; i++) {
            let arr = hotel.roomsStr[i].split('-')
            console.log(arr)
            this.form.get('floor' + ++i).setValue(arr[0])
            this.form.get('startRoom' + i).setValue(arr[1])
            this.form.get('endRoom' +  i).setValue(arr[2])
            i--
          }
          this.hotel = hotel
        },
        error: error => console.log(error.error.message),
      })
    } else {
      this.titleForm = 'Новая гостиница'
    }
  }

  getUsers() {
    this.uSub = this.usersService.getUsers().subscribe({
      next: users => {
        this.users = users.filter(user => user.post == "Горничная")

        for (let i = 0; i < this.users.length; i++) {
          for (let j = 0; j < users[i].hotels.length; j++) {
            if (users[i].hotels[j] == this.form.get('title').value) {
              this.personalList.push(users[i])
            }
          }
        }
      },
      error: error => console.log(error.error.message)
    })
    this.checkQuantityFloors(this.form.get('floors').value)
  }

  createArrForFloors() {
    this.floors = []
    if (this.form.get('floors').value > 4) {
      setTimeout(() => {
        this.form.get('floors').reset()
      }, 5000)
    }

    if (this.floors.length < 1) {
      for (let i = 1; i <= this.quantityFloors && i < 5; i++) {
        this.floors.push(i)
      }
    }
  }

  setValueInInputFloors() {
    let startFloor = this.form.get('floor1').value

    if (startFloor > 0) {

      for (let i = 1; i <= this.floors.length; i++) {
        this.form.controls['floor' + i].setValue(startFloor++)
      }

      for (let i = 1; i <= this.floors.length; i++) {
        this.form.controls['floor' + i].disable()
      }

      this.title = this.form.get('title').value
    }
  }

  checkQuantityFloors(numberFloors: number) {
    this.quantityFloors = numberFloors
    this.isErrorRequired = false
    if (this.quantityFloors != this.stateService.quantityFloors) {
      for (let i = 1; i <= this.floors.length; i++) {
        this.form.controls['floor' + i].reset()
        this.form.controls['floor' + i].enable()
        this.form.get('startRoom' + i).reset()
        this.form.get('endRoom' + i).reset()
      }
    }
    this.stateService.quantityFloors = this.quantityFloors
  }

  protected readonly Number = Number;

  checkRooms(start: string, end: string, floor: string) {
    let floorRequired = this.form.get(floor).hasError('required')
    let startRoomRequired = this.form.get(start).hasError('required')
    let endRoomRequired = this.form.get(end).hasError('required')

    let floorTouched = this.form.get(floor).touched
    let startRoomTouched = this.form.get(start).touched
    let endRoomTouched = this.form.get(end).touched

    if (this.form.get(start).value > this.form.get(end).value) {
      setTimeout(() => {
        this.form.get(start).reset()
        this.form.get(end).reset()
      }, 5000)
    }
    this.isErrorRequired = floorRequired && floorTouched;
    this.isErrorRequired = startRoomRequired && startRoomTouched;
    this.isErrorRequired = endRoomRequired && endRoomTouched;
  }

  uploadImg($event: any) {
    this.image = $event.target.files[0]
  }

  triggerClick() {
    this.inputImgRef.nativeElement.click()
  }

  onSubmit() {
    if (!this.isEdit) {
      if (this.form.get('startRoom1').value) {
        let hotel: Hotel = {
          title: this.form.get('title').value,
          floors: this.quantityFloors,
          roomsStr: [],
          rooms: [],
          personal: this.form.get('users').value
        }

        for (let i = 1; i <= this.floors.length; i++) {
          hotel.roomsStr.push(this.form.get('floor' + i).value + '-' + this.form.get('startRoom' + i).value + '-' + this.form.get('endRoom' + i).value)
        }

        this.hSub = this.hotelService.create(hotel, this.image).subscribe({
          next: message => console.log(message.message),
          error: error => console.log(error.error.error)
        })
        this.image = null
      }
      this.openHotelsPage()
    } else this.updateUser(this.form.get('users').value)
    this.openHotelsPage()

  }

  updateUser(users: string[]) {
    let arr = []
    for (let i = 0; i < this.users.length; i++) {
      if ((this.users[i].lastName + ' ' + this.users[i].firstName) == users[i]) {
        arr.push(this.users[i])
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
      this.uSub = this.usersService.update(user).subscribe({
        next: message => console.log(message),
        error: error => console.log(error.error.message)
      })
    }

    let hotel: Hotel = {
      title: this.form.get('title').value,
      floors: this.quantityFloors,
      rooms: [],
      personal: this.form.get('users').value
    }
  }

  delete() {
    this.hSub = this.hotelService.delete(this.hotel).subscribe({
      next: message => console.log(message.message),
      error: error => console.log(error.error.message)
    })
    this.openHotelsPage()
  }

  openHotelsPage() {
    this.router.navigate(['admin-panel/hotels'])
  }
}
