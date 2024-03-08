import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterModule, RouterOutlet} from "@angular/router";
import {UsersPageComponent} from "../../../admin-pages/users-page/users-page.component";
import {CommonModule,} from "@angular/common";
import {HotelsListPageComponent} from "../../../admin-pages/hotels-list-page/hotels-list-page.component";
import {PostsPageComponent} from "../../../admin-pages/posts-page/posts-page.component";
import {HotelCreatePageComponent} from "../../../admin-pages/hotel-create-page/hotel-create-page.component";
import {HousesListComponent} from "../../../admin-pages/houses-list/houses-list.component";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {AuthService} from "../../services/auth.service";
import {MatProgressBarModule} from "@angular/material/progress-bar";

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
        HousesListComponent,
        MatSlideToggleModule,
        MatProgressBarModule
    ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent implements OnInit{
  user = JSON.parse(localStorage['user'])
  post = localStorage.getItem('post')
  isErrorHttpStatus = false

  constructor(private router: Router,
              private auth: AuthService) {
  }

  ngOnInit() {
    this.auth.getStatus() == 500 ? this.isErrorHttpStatus = true : this.isErrorHttpStatus = false
  }

  logout() {
    this.auth.logout()
    this.router.navigate(['login']).then()
  }

  selectMode() {
    this.user.post !== 'Администратор' ? this.user.post = 'Администратор' : this.user.post = localStorage.getItem('post')
    localStorage['user'] = JSON.stringify(this.user)
    this.user = JSON.parse(localStorage['user'])
    this.router.navigate(['management/hotels'])
  }
}
