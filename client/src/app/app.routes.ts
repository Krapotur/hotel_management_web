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
import {UserCreatePageComponent} from "./admin-pages/user-create-page/user-create-page.component";
import {HouseEditPageComponent} from "./admin-pages/house-edit-page/house-edit-page.component";
import {HotelEditPageComponent} from "./admin-pages/hotel-edit-page/hotel-edit-page.component";
import {isAuthGuard} from "./shared/classes/auth.guard";

export const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      {path: '', redirectTo: '/login', pathMatch: "full"},
      {path: 'login', component: LoginPageComponent},
      {path: 'login?admin=true', component: LoginPageComponent},
    ]
  },
  {
    path: 'admin-panel', component: AdminLayoutComponent, canActivate: [isAuthGuard], children: [
      {path: '', redirectTo: '/admin-panel/users', pathMatch: "full"},
      {path: 'users', component: UsersPageComponent},
      {path: 'user-create', component: UserCreatePageComponent},
      {path: 'groups', component: PostsPageComponent},
      {path: 'hotels', component: HotelsListPageComponent},
      {path: 'hotel-create', component: HotelCreatePageComponent},
      {path: 'hotel-edit/:id', component: HotelEditPageComponent},
      {path: 'house-edit', component: HouseEditPageComponent},
      {path: 'house-edit/:id', component: HouseEditPageComponent},
      {path: 'houses', component: HousesListComponent},
    ]
  },
  {
    path: 'management', component: ManagementLayoutComponent, canActivate: [isAuthGuard], children: [
      {path: '', redirectTo: '/management/hotels', pathMatch: "full"},
      {path: 'management', component: ManagementLayoutComponent},
      {path: 'hotels', component: HotelsListPageComponent},
      {path: 'hotel/:id', component: HotelPageComponent},
      {path: 'houses', component: HousesListComponent},
      {path: 'houses/:id', component: HousesListComponent},
    ]
  }
];
