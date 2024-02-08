import {Component, OnInit, ViewChild} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {Group, Hotel} from "../../shared/interfaces";
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
  houses:Hotel [] = []


  isTrue = false

  displayedColumns: string[] = ['#', 'name', 'floors', 'personal', 'edit'];
  dataSource = new MatTableDataSource<Hotel>(this.houses);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.generateForm()
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
