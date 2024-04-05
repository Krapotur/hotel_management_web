import {Component, DoCheck} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {NgIf} from "@angular/common";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {AuthService} from "../../services/auth.service";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MaterialService} from "../../classes/material.service";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-management-layout',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    NgIf,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatButtonModule
  ],
  templateUrl: './management-layout.component.html',
  styleUrl: './management-layout.component.scss'
})
export class ManagementLayoutComponent implements DoCheck {
  title = 'Гостиницы'
  isErrorHttpStatus = false
  user = JSON.parse(localStorage['user'])
  post = localStorage.getItem('post')

  constructor(private router: Router,
              private auth: AuthService) {
  }

  ngDoCheck() {
    this.isErrorHttpStatus = this.auth.getStatus() == 500;
  }

  logout() {
    this.auth.logout()
    this.router.navigate(['login']).then()
  }

  setTitle(title: string) {
    this.title = title
  }

  selectMode() {
    if (this.auth.getStatus() == 500) MaterialService.toast('Связь с сервером прервана...')

    this.user.post = localStorage.getItem('post')
    localStorage['user'] = JSON.stringify(this.user)
    this.user = JSON.parse(localStorage['user'])
    this.router.navigate(['admin-panel/hotels']).then()
  }

  refreshPage() {
    this.router.navigateByUrl('/').then(() => {
      this.router.navigate([`/management/hotels`]).then()
    })
  }
}
