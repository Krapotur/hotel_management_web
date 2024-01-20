import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {User} from "../../shared/interfaces";
import {MatButtonModule} from "@angular/material/button";
import {NgForOf, NgIf} from "@angular/common";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {GroupsPageComponent} from "../groups-page/groups-page.component";

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
    GroupsPageComponent
  ],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss'
})
export class UsersPageComponent implements AfterViewInit {
  hotels = new FormControl('');
  post = new FormControl('');

  showTemplate = false

  posts: string [] = ['Руководитель', 'Супервайзер', 'Админ', 'Горничная']
  hotelsList: string [] = ['Восточная Азия', 'Шри-ланка', 'Гималайский дом', 'Центральная Азия']

  ELEMENT_DATA: User[] = [
    {position: 1, name: 'Заливина Анна', post: 'Руководитель', phone: '79895423544', hotel: '', edit: 'Изменить/удалить'},
    {position: 2, name: 'Администратор гостиниц', post: 'Администратор гостиниц', phone: '79895423544', hotel: '', edit: 'Изменить/удалить'},
    {position: 3, name: 'Администратор системы', post: 'Администратор системы', phone: '79895423544', hotel: '', edit: 'Изменить/удалить'},
    {position: 4, name: 'Рахмонова Оля', post: 'Горничная', phone: '79895423544', hotel: '', edit: 'Изменить/удалить'},
    {position: 5, name: 'Аметова Замира', post: 'Горничная', phone: '79895423544', hotel: 'Центральная Азия', edit: 'Изменить/удалить'},
    {position: 6, name: 'Толибова Феруза', post: 'Горничная', phone: '79895423544', hotel: 'Гималайский дом', edit: 'Изменить/удалить'},
    {position: 7, name: 'Гафарова Хабиба', post: 'Горничная', phone: '79895423544', hotel: 'Шри-Ланка', edit: 'Изменить/удалить'},
  ];


  displayedColumns: string[] = ['#', 'name', 'post', 'phone', 'hotel', 'edit'];
  dataSource = new MatTableDataSource<User>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  toggleBtn() {
    this.showTemplate = !this.showTemplate;
  }
}
