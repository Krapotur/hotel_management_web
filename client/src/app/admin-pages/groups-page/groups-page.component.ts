import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {Group} from "../../shared/interfaces";
import {MatButtonModule} from "@angular/material/button";
import {NgForOf, NgIf} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-groups-page',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    NgIf,
    NgForOf,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './groups-page.component.html',
  styleUrl: './groups-page.component.scss'
})
export class GroupsPageComponent implements AfterViewInit {
  ELEMENT_DATA: Group[] = [
    {position: 1, post: 'Руководитель'},
    {position: 2, post: 'Администратор гостиниц'},
    {position: 3, post: 'Администратор системы'},
    {position: 4, post: 'Горничная'},
  ];


  displayedColumns: string[] = ['#', 'post'];
  dataSource = new MatTableDataSource<Group>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
