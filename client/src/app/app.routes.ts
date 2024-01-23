import {Routes} from '@angular/router';
import {AuthLayoutComponent} from "./shared/layouts/auth-layout/auth-layout.component";
import {LoginPageComponent} from "./login-page/login-page.component";
import {AdminLayoutComponent} from "./shared/layouts/admin-layout/admin-layout.component";
import {ManagementLayoutComponent} from "./shared/layouts/management-layout/management-layout.component";
import {UsersPageComponent} from "./admin-pages/users-page/users-page.component";
import {PostsPageComponent} from "./admin-pages/posts-page/posts-page.component";
import {HotelsListPageComponent} from "./admin-pages/hotels-list-page/hotels-list-page.component";
import {HotelPageComponent} from "./admin-pages/hotel-page/hotel-page.component";
import {HotelCreatePageComponent} from "./admin-pages/hotel-create-page/hotel-create-page.component";
import {HousesListComponent} from "./admin-pages/houses-list/houses-list.component";
export const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      {path: '', redirectTo: '/login', pathMatch: "full"},
      {path: 'login', component: LoginPageComponent}
    ]
  },
  {
    path: 'admin', component: AdminLayoutComponent,  children: [
      {path: 'users', component: UsersPageComponent},
      {path: 'groups', component: PostsPageComponent},
      {path: 'hotels', component: HotelsListPageComponent},
      {path: 'hotel', component: HotelPageComponent},
      {path: 'hotel-create', component: HotelCreatePageComponent},
      {path: 'houses', component:HousesListComponent},
    ]
  },
  {
    path: 'management', component: ManagementLayoutComponent, children: [
      {path: 'management', redirectTo: '/management', pathMatch: "full"},
      {path: 'management', component: ManagementLayoutComponent}
    ]
  }
];
