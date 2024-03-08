import {Component, OnInit} from '@angular/core';
import { Router, RouterLink, RouterOutlet} from "@angular/router";
import {NgIf} from "@angular/common";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

@Component({
  selector: 'app-management-layout',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    NgIf,
    MatSlideToggleModule
  ],
  templateUrl: './management-layout.component.html',
  styleUrl: './management-layout.component.scss'
})
export class ManagementLayoutComponent{
  title = 'Гостиницы'
  date: Date
  user = JSON.parse(localStorage['user'])
  post = localStorage.getItem('post')

  constructor(private router: Router) {
  }

  logout() {
    localStorage.clear()
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
