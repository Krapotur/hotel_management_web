import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
        ReactiveFormsModule
    ],
    templateUrl: './house-page.component.html',
    styleUrl: './house-page.component.scss'
})
export class HousePageComponent implements OnInit, OnDestroy {
    form: FormGroup
    title = 'Новый дом'
    image: File
    isEdit = false
    houseID = ''
    uSub: Subscription
    hSub: Subscription
    house: House
    houses: Hotel [] = []
    users: User[] = []
    personal: string[] = []
    personalList: string[] = []

    @ViewChild('inputImg') inputImgRef: ElementRef

    constructor(private usersService: UsersService,
                private houseService: HousesService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.houseID = this.route.snapshot.params['id']
        this.getHouseById()
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
        if (this.houseID) {
            this.hSub = this.houseService.getHouseById(this.houseID).subscribe({
                next: house => {
                    this.house = house
                    this.getUsers()
                    this.generateForm()
                },
                error: error => MaterialService.toast(error.error.message)
            })
        } else this.generateForm()
    }

    generateForm() {
        if (!this.houseID) {
            this.getUsers()
            this.form = new FormGroup({
                title: new FormControl(null, [Validators.required]),
                floors: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
                users: new FormControl('')
            })
        } else {
            this.title = this.house.title
            this.form = new FormGroup({
                title: new FormControl(this.house.title, [Validators.required]),
                floors: new FormControl(this.house.floors, [Validators.required, Validators.min(1), Validators.max(4)]),
                users: new FormControl(this.house.personal)
            })
        }
    }

    getUsers() {
        this.uSub = this.usersService.getUsers().subscribe({
            next: users => {
                this.users = users
                users.forEach(user => {
                    if (this.house.personal.includes(user._id)) this.personal.push(user.lastName + ' ' + user.firstName)
                    if (user.post == 'Горничная') this.personalList.push(user.lastName + ' ' + user.firstName)
                })
            },
            error: error => MaterialService.toast(error.error.message)
        })
    }
    onSubmit() {
        let house = {
            title: this.form.get('title').value,
            floors: this.form.get('floors').value,
            personal: this.form.get('users').value
        }

        this.hSub = this.houseService.create(house, this.image).subscribe({
            next: message => MaterialService.toast(message.message),
            error: error => MaterialService.toast(error.error.message)
        })
    }

    uploadImg($event: any) {
        this.image = $event.target.files[0]
    }

    triggerClick() {
        this.inputImgRef.nativeElement.click()
    }



    openEditHousePage(house: House) {
        this.getUsers()
        this.isEdit = !this.isEdit
        this.title = house.title

    }

    openHousesPage() {
        this.router.navigate(['admin-panel/houses'])
    }
}
