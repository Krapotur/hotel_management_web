import {Component, DoCheck} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-management-layout',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    NgIf
  ],
  templateUrl: './management-layout.component.html',
  styleUrl: './management-layout.component.scss'
})
export class ManagementLayoutComponent implements DoCheck {
  title = 'Гостиницы'
  isParams = false
  date: Date
  user = JSON.parse(localStorage['user'])

  constructor(private router: Router,
              private route: ActivatedRoute) {
  }

  ngDoCheck() {
  }

  logout() {
    localStorage.clear()
    this.router.navigate(['login']).then()
  }

  setTitle(title: string) {
    this.title = title
  }
}
