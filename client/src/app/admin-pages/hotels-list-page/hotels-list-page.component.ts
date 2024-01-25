import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {Group} from "../../shared/interfaces";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {PostsPageComponent} from "../posts-page/posts-page.component";
import {ReactiveFormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-hotels-list-page',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    PostsPageComponent,
    MatInputModule,
    RouterLink
  ],
  templateUrl: './hotels-list-page.component.html',
  styleUrl: './hotels-list-page.component.scss'
})
export class HotelsListPageComponent implements AfterViewInit {
  showTemplate = false

  constructor(private router: Router) {

  }

  ELEMENT_DATA: Group[] = [
    {position: 1, name: 'Заливина Анна', post: 'Руководитель', phone: '79895423544'},
    {position: 2, name: 'Администратор гостиниц', post: 'Администратор гостиниц', phone: '79895423544'},
    {position: 3, name: 'Администратор системы', post: 'Администратор системы', phone: '79895423544'},
    {position: 4, name: 'Рахмонова Оля', post: 'Горничная', phone: '79895423544'},
    {position: 5, name: 'Аметова Замира', post: 'Горничная', phone: '79895423544'},
    {position: 6, name: 'Толибова Феруза', post: 'Горничная', phone: '79895423544'},
    {position: 7, name: 'Гафарова Хабиба', post: 'Горничная', phone: '79895423544'},
  ];


  displayedColumns: string[] = ['#', 'name', 'floors', 'rooms', 'edit'];
  dataSource = new MatTableDataSource<Group>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openCreateHotelPage() {
    this.router.navigate(['admin-panel/hotel-create'])
  }
}
