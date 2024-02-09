import {AfterViewInit, Component, DoCheck, OnDestroy, OnInit} from '@angular/core';
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
import {RoomsPageComponent} from "../rooms-page/rooms-page.component";
import {RoomsService} from "../../shared/services/rooms.service";
import {MaterialService} from "../../shared/classes/material.service";

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
export class HotelEditPageComponent implements OnInit, DoCheck {
    hotel: Hotel
    params: string
    floors: Floor[] = []
    personalList: string[] = []
    hSub: Subscription
    quantityRooms = 0

    constructor(private hotelService: HotelsService,
                private roomsService: RoomsService,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.params = params['hotelID']
        })
        this.getHotelById()
    }

    ngDoCheck() {
        this.quantityRooms = this.roomsService.quantityRooms
    }

    getHotelById() {
        this.hSub = this.hotelService.getHotelById(this.params).subscribe({
            next: hotel => {
                for (let k = 0; k < hotel.personal.length; k++) {
                    let position = ++k + '. ' + hotel.personal[--k]
                    this.personalList.push(position)
                }
                this.hotel = hotel
            },
            error: error => MaterialService.toast(error.error.message)
        })
    }

}
