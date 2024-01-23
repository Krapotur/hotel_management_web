import {AfterViewInit, Component, DoCheck, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {User,UserUser} from "../../shared/interfaces";
import {MatButtonModule} from "@angular/material/button";
import {NgForOf, NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {PostsPageComponent} from "../posts-page/posts-page.component";
import {StateService} from "../../shared/services/state.service";
import {UsersService} from "../../shared/services/users.service";



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
    PostsPageComponent
  ],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss'
})
export class UsersPageComponent implements OnInit, DoCheck, AfterViewInit {
  form: FormGroup
  post = new FormControl('');

  showTemplate = ''

  constructor(private stateService: StateService,
              private userService: UsersService) {
  }

  posts: string [] = ['Руководитель', 'Супервайзер', 'Администратор', 'Горничная']
  hotelsList: string [] = ['Восточная Азия', 'Шри-ланка', 'Гималайский дом', 'Центральная Азия']

  ELEMENT_DATA: User[] = [
    {
      position: 1,
      name: 'Заливина Анна',
      post: 'Руководитель',
      phone: '79895423544',
      hotel: '',
      edit: 'Изменить/удалить',
      login: '',
      password: ''
    },
    {
      position: 2,
      name: 'Администратор',
      post: 'Администратор',
      phone: '79895423544',
      hotel: '',
      edit: 'Изменить/удалить',
      login: '',
      password: ''
    },
    {
      position: 3,
      name: 'Гафарова Хабиба',
      post: 'Горничная',
      phone: '79895423544',
      hotel: 'Восточная Азия',
      edit: 'Изменить/удалить',
      login: '',
      password: ''
    },
    {
      position: 4,
      name: 'Рахмонова Оля',
      post: 'Горничная',
      phone: '79895423544',
      hotel: 'Центральная Азия,',
      edit: 'Изменить/удалить',
      login: '',
      password: ''
    },
    {
      position: 5,
      name: 'Аметова Замира',
      post: 'Горничная',
      phone: '79895423544',
      hotel: 'Центральная Азия, "Шри-Ланка',
      edit: 'Изменить/удалить',
      login: '',
      password: ''
    },
    {
      position: 6,
      name: 'Толибова Феруза',
      post: 'Горничная',
      phone: '79895423544',
      hotel: 'Гималайский дом',
      edit: 'Изменить/удалить',
      login: '',
      password: ''
    },
  ];


  displayedColumns: string[] = ['#', 'name', 'post', 'phone', 'hotel', 'edit'];
  dataSource = new MatTableDataSource<User>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.generateForm()
  }

  ngDoCheck() {
    this.checkStatusShowTemplate();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  generateForm() {
    this.form = new FormGroup({
      lastName: new FormControl(null, [Validators.required]),
      firstName: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required]),
      post: new FormControl(null, [Validators.required]),
      hotels: new FormControl(null, [Validators.required]),
      login: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    })
  }

  openTemplate(newUser: string) {
    this.stateService.changeTemplate(newUser);
    this.showTemplate = this.stateService.showTemplate
    this.form.reset()
  }

  checkStatusShowTemplate() {
    this.showTemplate = this.stateService.showTemplate
  }

  onSubmit() {
    const newUser: UserUser = {
      lastName: this.form.get('lastName').value,
      firstName: this.form.get('firstName').value,
      phone: this.form.get('phone').value,
      post: this.form.get('post').value,
      hotels: this.form.get('hotels').value,
      login: this.form.get('login').value,
      password: this.form.get('password').value,
    }



    this.userService.create(newUser).subscribe(message=> {
      console.log(message)
    }, error => console.log(error.error.message))
  }
}
