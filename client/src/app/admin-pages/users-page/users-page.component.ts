import {AfterViewInit, Component, DoCheck, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {User} from "../../shared/interfaces";
import {MatButtonModule} from "@angular/material/button";
import {NgForOf, NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, } from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {PostsPageComponent} from "../posts-page/posts-page.component";
import {StateService} from "../../shared/services/state.service";
import {Router, RouterLink} from "@angular/router";
import {UsersService} from "../../shared/services/users.service";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    NgIf,
    NgForOf,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    PostsPageComponent,
    RouterLink
  ],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss'
})
export class UsersPageComponent implements OnInit, DoCheck, AfterViewInit, OnDestroy {
  form: FormGroup
  post = new FormControl('');
  uSub: Subscription
  isShowTemplate = false

  dataSource: MatTableDataSource<User>
  constructor(private stateService: StateService,
              private usersService: UsersService,
              private router: Router) {
  }

  displayedColumns: string[] = ['#', 'name', 'post', 'phone', 'hotel', 'edit'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.getUsers()
  }

  ngDoCheck() {
    this.isShowTemplate = this.stateService.showTemplate
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    if(this.uSub){
      this.uSub.unsubscribe()
    }
  }

  getUsers(){
    let position = 1
   this.uSub = this.usersService.getUsers().subscribe({
      next: users => {
        let usersList = users.filter(user => user.post != 'admin')
        usersList.map(user => user.position = position++)

        this.dataSource = new MatTableDataSource<User>(usersList)
        this.dataSource.paginator = this.paginator;
      },
     error: error => console.log(error.error.message)
    })
  }

  openCreateUserPage(user?: User){
    if(user){
      this.router.navigate(["admin-panel/user-create"], {queryParams:{
        userID: user._id
        }})
    } else {
      this.router.navigate(['admin-panel/user-create'])
    }
  }

}
