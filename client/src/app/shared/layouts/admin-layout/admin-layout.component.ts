import {Component} from '@angular/core';
import {Router, RouterLink, RouterModule, RouterOutlet} from "@angular/router";
import {UsersPageComponent} from "../../../admin-pages/users-page/users-page.component";
import {CommonModule,} from "@angular/common";
import {HotelsListPageComponent} from "../../../admin-pages/hotels-list-page/hotels-list-page.component";
import {PostsPageComponent} from "../../../admin-pages/posts-page/posts-page.component";
import {HotelCreatePageComponent} from "../../../admin-pages/hotel-create-page/hotel-create-page.component";
import {HousesListComponent} from "../../../admin-pages/houses-list/houses-list.component";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

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
    MatSlideToggleModule
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  date: Date
  user = JSON.parse(localStorage['user'])
  post = localStorage.getItem('post')

  constructor(private router: Router) {
  }


  logout() {
    localStorage.clear()
    this.router.navigate(['login']).then()
  }

  selectMode() {
    this.user.post !== 'Администратор' ? this.user.post = 'Администратор' : this.user.post = localStorage.getItem('post')
    localStorage['user'] = JSON.stringify(this.user)
    this.user = JSON.parse(localStorage['user'])
    this.router.navigate(['management/hotels'])
  }
}
