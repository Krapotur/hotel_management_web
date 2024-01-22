import {AfterViewInit, Component, DoCheck, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {User} from "../../shared/interfaces";
import {MatButtonModule} from "@angular/material/button";
import {NgForOf, NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {PostsPageComponent} from "../posts-page/posts-page.component";
import {StateService} from "../../shared/services/state.service";

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

  constructor(private stateService: StateService) {
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
      edit: 'Изменить/удалить'
    },
    {
      position: 2,
      name: 'Администратор',
      post: 'Администратор',
      phone: '79895423544',
      hotel: '',
      edit: 'Изменить/удалить'
    },
    {
      position: 3,
      name: 'Гафарова Хабиба',
      post: 'Горничная',
      phone: '79895423544',
      hotel: 'Восточная Азия',
      edit: 'Изменить/удалить'
    },
    {
      position: 4,
      name: 'Рахмонова Оля',
      post: 'Горничная',
      phone: '79895423544',
      hotel: 'Центральная Азия,',
      edit: 'Изменить/удалить'
    },
    {
      position: 5,
      name: 'Аметова Замира',
      post: 'Горничная',
      phone: '79895423544',
      hotel: 'Центральная Азия, "Шри-Ланка',
      edit: 'Изменить/удалить'
    },
    {
      position: 6,
      name: 'Толибова Феруза',
      post: 'Горничная',
      phone: '79895423544',
      hotel: 'Гималайский дом',
      edit: 'Изменить/удалить'
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
}
