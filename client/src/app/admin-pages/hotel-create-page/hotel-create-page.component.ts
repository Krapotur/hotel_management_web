import {Component, DoCheck, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {NgForOf, NgIf} from "@angular/common";
import {Hotel} from "../../shared/interfaces";
import {StateService} from "../../shared/services/state.service";
import {HotelsService} from "../../shared/services/hotels.service";
import {Subscription} from "rxjs";

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
    ReactiveFormsModule
  ],
  templateUrl: './hotel-create-page.component.html',
  styleUrl: './hotel-create-page.component.scss'
})
export class HotelCreatePageComponent implements OnInit, DoCheck, OnDestroy {
  form: FormGroup
  quantityFloors = 0
  floors = []
  isErrorRequired = false
  image: File
  hSub: Subscription

  constructor(private stateService: StateService,
              private hotelService: HotelsService) {
  }

  @ViewChild('inputImg') inputImgRef: ElementRef

  ngOnInit() {
    this.generateForm()
  }

  ngDoCheck() {
    this.createArrForFloors()
  }

  ngOnDestroy() {
    if (this.hSub) {
      this.hSub.unsubscribe()
    }
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
      endRoom4: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)])
    })
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
    if (this.form.get('startRoom1').value) {
      let hotel: Hotel = {
        title: this.form.get('title').value,
        floors: this.quantityFloors,
        rooms: []
      }

      for (let i = 1; i <= this.floors.length; i++) {
        hotel.rooms.push(i + '-' + this.form.get('startRoom' + i).value + '-' + this.form.get('endRoom' + i).value)
      }

      hotel.floors = this.quantityFloors
      this.hSub = this.hotelService.create(hotel, this.image).subscribe({
        next: message => console.log(message.message),
        error: error => console.log(error.error.error)
      })
    }
  }
}
