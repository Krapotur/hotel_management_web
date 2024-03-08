import {Component, DoCheck, OnInit} from '@angular/core';
import { Router, RouterLink, RouterOutlet} from "@angular/router";
import {NgIf} from "@angular/common";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {AuthService} from "../../services/auth.service";
import {MatProgressBarModule} from "@angular/material/progress-bar";

@Component({
  selector: 'app-management-layout',
  standalone: true,
    imports: [
        RouterLink,
        RouterOutlet,
        NgIf,
        MatSlideToggleModule,
        MatProgressBarModule
    ],
  templateUrl: './management-layout.component.html',
  styleUrl: './management-layout.component.scss'
})
export class ManagementLayoutComponent implements DoCheck{
  title = 'Гостиницы'
  isErrorHttpStatus = false
  user = JSON.parse(localStorage['user'])
  post = localStorage.getItem('post')

  constructor(private router: Router,
              private auth: AuthService) {
  }

  ngDoCheck() {
    this.auth.getStatus() == 500 ? this.isErrorHttpStatus = true : this.isErrorHttpStatus = false
  }

  logout() {
    this.auth.logout()
    this.router.navigate(['login']).then()
  }

  setTitle(title: string) {
    this.title = title
  }

  selectMode() {
    this.user.post = localStorage.getItem('post')
    localStorage['user'] = JSON.stringify(this.user)
    this.user = JSON.parse(localStorage['user'])
    this.router.navigate(['admin-panel/hotels'])
  }
}
