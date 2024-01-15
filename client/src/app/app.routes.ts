import {Routes} from '@angular/router';
import {AuthLayoutComponent} from "./shared/layouts/auth-layout/auth-layout.component";
import {LoginPageComponent} from "./login-page/login-page.component";
import {AdminLayoutComponent} from "./shared/layouts/admin-layout/admin-layout.component";
import {UserLayoutComponent} from "./shared/layouts/user-layout/user-layout.component";

export const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      {path: '', redirectTo: '/login', pathMatch: "full"},
      {path: 'login', component: LoginPageComponent}
    ]
  },
  {
    path: 'admin', component: AdminLayoutComponent,  children: [

    ]
  },
  {
    path: 'user', component: UserLayoutComponent, children: [

    ]
  }
];
