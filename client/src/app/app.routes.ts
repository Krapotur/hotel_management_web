import {Routes} from '@angular/router';
import {AuthLayoutComponent} from "./shared/layouts/auth-layout/auth-layout.component";
import {LoginPageComponent} from "./login-page/login-page.component";
import {AdminLayoutComponent} from "./shared/layouts/admin-layout/admin-layout.component";
import {ManagementLayoutComponent} from "./shared/layouts/management-layout/management-layout.component";
import {AdminPageComponent} from "./admin-page/admin-page.component";
export const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      {path: '', redirectTo: '/login', pathMatch: "full"},
      {path: 'login', component: LoginPageComponent}
    ]
  },
  {
    path: 'admins', component: AdminLayoutComponent,  children: [
      {path: 'admins', redirectTo: '/admin', pathMatch:"full"},
      {path: 'admin', component: AdminPageComponent}
    ]
  },
  {
    path: 'management', component: ManagementLayoutComponent, children: [
      {path: 'management', redirectTo: '/management', pathMatch: "full"},
      {path: 'management', component: ManagementLayoutComponent}
    ]
  }
];
