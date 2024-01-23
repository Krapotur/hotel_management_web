import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink, RouterModule, RouterOutlet} from "@angular/router";
import {UsersPageComponent} from "../../../admin-pages/users-page/users-page.component";
import {Subscription} from "rxjs";
import {CommonModule, NgIf} from "@angular/common";
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
  title = ''
  pSub: Subscription

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.getParams()
  }

  getParams(): void {
    this.route.queryParams.subscribe(params => {
      this.setTittle(params['page'])
    })
  }

  setTittle(params: string) {
    switch (params) {
      case 'users':
        this.title = 'users';
        break;
      case 'groups':
        this.title = 'Группы';
        break;
      case 'hotels':
        this.title = 'hotels';
        break;
      case 'newHotel':
        this.title = 'new-hotel';
        break;
      case 'houses':
        this.title = 'houses';
        break;
      default:
        this.title = '';
    }
  }

}
