import {Component, OnInit} from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet} from "@angular/router";
import {UsersPageComponent} from "../../../admin-pages/users-page/users-page.component";
import {CommonModule, } from "@angular/common";
import {HotelsListPageComponent} from "../../../admin-pages/hotels-list-page/hotels-list-page.component";
import {PostsPageComponent} from "../../../admin-pages/posts-page/posts-page.component";
import {HotelCreatePageComponent} from "../../../admin-pages/hotel-create-page/hotel-create-page.component";
import {HousesListComponent} from "../../../admin-pages/houses-list/houses-list.component";

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [
        RouterOutlet,
        RouterLink,
        RouterModule,
        CommonModule,
        HotelsListPageComponent,
        UsersPageComponent,
        PostsPageComponent,
        HotelCreatePageComponent,
        HousesListComponent
    ],
    templateUrl: './admin-layout.component.html',
    styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent implements OnInit {
    date: Date
    user = JSON.parse(localStorage['user'])
    constructor(private router: Router) {
    }

    ngOnInit() {
        // setInterval(()=>this.date = new Date(),100)
    }

    logout(){
        localStorage.clear()
        this.router.navigate(['login']).then()
    }

}
