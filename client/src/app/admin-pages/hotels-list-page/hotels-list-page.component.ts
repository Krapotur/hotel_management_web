import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {Group} from "../../shared/interfaces";

@Component({
  selector: 'app-hotels-list-page',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatTableModule
  ],
  templateUrl: './hotels-list-page.component.html',
  styleUrl: './hotels-list-page.component.scss'
})
export class HotelsListPageComponent implements AfterViewInit {
  ELEMENT_DATA: Group[] = [
    {position: 1, name: 'Заливина Анна', post: 'Руководитель', phone: '79895423544'},
    {position: 2, name: 'Администратор гостиниц', post: 'Администратор гостиниц', phone: '79895423544'},
    {position: 3, name: 'Администратор системы', post: 'Администратор системы', phone: '79895423544'},
    {position: 4, name: 'Рахмонова Оля', post: 'Горничная', phone: '79895423544'},
    {position: 5, name: 'Аметова Замира', post: 'Горничная', phone: '79895423544'},
    {position: 6, name: 'Толибова Феруза', post: 'Горничная', phone: '79895423544'},
    {position: 7, name: 'Гафарова Хабиба', post: 'Горничная', phone: '79895423544'},
  ];


  displayedColumns: string[] = ['#', 'name', 'post', 'phone'];
  dataSource = new MatTableDataSource<Group>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
