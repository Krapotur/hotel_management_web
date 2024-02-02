import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {HotelsService} from "../../shared/services/hotels.service";
import {ActivatedRoute} from "@angular/router";
import {Floor, Hotel} from "../../shared/interfaces";
import {Subscription} from "rxjs";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

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
    MatSlideToggleModule
  ],
  templateUrl: './hotel-edit-page.component.html',
  styleUrl: './hotel-edit-page.component.scss'
})
export class HotelEditPageComponent implements OnInit {
  hotel: Hotel
  params: string
  floors: Floor[] =[]
  personalList: string[] = []
  hSub: Subscription

  constructor(private hotelService: HotelsService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.params = params['hotelID']
      this.getHotelById(this.params)
    })

    console.log(this.hotel)
  }

  getHotelById(id: string) {
    this.hSub = this.hotelService.getHotelById(this.params).subscribe({
      next: hotel => {

        for (let k = 0; k < hotel.personal.length; k++) {
          let position = ++k + '. ' + hotel.personal[--k]
          this.personalList.push(position)
        }

        for (let i = 0; i < hotel.floors; i++) {
          let arr = hotel.roomsStr[i].split('-')
          let floor: Floor = {
            numberFloor: '0',
            rooms: []
          }
          floor.numberFloor = arr[0]

          for (let j = 0; j < hotel.rooms.length; j++) {
            if (hotel.rooms[j].floor == Number(arr[0])){
              floor.rooms.push(hotel.rooms[j])
            }
          }
          this.floors.push(floor)
        }
        console.log(this.floors)
        this.hotel = hotel
      },
      error: error => console.log(error.error.message)
    })
  }

}
