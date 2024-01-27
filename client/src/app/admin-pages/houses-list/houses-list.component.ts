import {Component, OnInit, ViewChild} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {Group} from "../../shared/interfaces";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-houses-list',
  standalone: true,
  imports: [
    MatButtonModule,
    MatPaginatorModule,
    MatTableModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './houses-list.component.html',
  styleUrl: './houses-list.component.scss'
})
export class HousesListComponent implements OnInit {
  showTemplate = false
  form: FormGroup

  ELEMENT_DATA: Group[] = [
    {position: 1, name: 'Заливина Анна', post: 'Руководитель', phone: '79895423544'},
    {position: 2, name: 'Администратор гостиниц', post: 'Администратор гостиниц', phone: '79895423544'},
    {position: 3, name: 'Администратор системы', post: 'Администратор системы', phone: '79895423544'},
    {position: 4, name: 'Рахмонова Оля', post: 'Горничная', phone: '79895423544'},
    {position: 5, name: 'Аметова Замира', post: 'Горничная', phone: '79895423544'},
    {position: 6, name: 'Толибова Феруза', post: 'Горничная', phone: '79895423544'},
    {position: 7, name: 'Гафарова Хабиба', post: 'Горничная', phone: '79895423544'},
  ];

  isTrue = false
answer = 'Отлично!!!'

  displayedColumns: string[] = ['#', 'name', 'floors', 'rooms', 'edit'];
  dataSource = new MatTableDataSource<Group>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.generateForm()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  generateForm() {
    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      floors: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
    })
  }

  openTemplate() {
    this.showTemplate = !this.showTemplate
  }

  save(){
    this.isTrue = !this.isTrue

  }
}
