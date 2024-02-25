import { Component } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-management-layout',
  standalone: true,
    imports: [
        RouterLink,
        RouterOutlet
    ],
  templateUrl: './management-layout.component.html',
  styleUrl: './management-layout.component.scss'
})
export class ManagementLayoutComponent {

    date: Date
    user = JSON.parse(localStorage['user'])
    constructor(private router: Router) {
    }

    ngOnInit() {
        // setInterval(()=>this.date = new Date(),100)
    }

    logout(){
        localStorage.clear()
        this.router.navigate(['login'])
    }
}
