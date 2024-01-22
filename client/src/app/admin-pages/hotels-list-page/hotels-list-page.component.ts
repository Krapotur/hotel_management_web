import {AfterViewInit, Component, DoCheck, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {Group} from "../../shared/interfaces";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {PostsPageComponent} from "../posts-page/posts-page.component";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {StateService} from "../../shared/services/state.service";

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
    MatInputModule
  ],
  templateUrl: './hotels-list-page.component.html',
  styleUrl: './hotels-list-page.component.scss'
})
export class HotelsListPageComponent implements OnInit, DoCheck, AfterViewInit {
  form: FormGroup
  showTemplate = false
  quantityFloors = 0
  floors = []
  quantityRooms;
  rooms=[]

  constructor(private stateService: StateService) {
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

  ngOnInit() {
    this.generateForm()
  }

  ngDoCheck() {
    this.createArrForFloors()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  generateForm() {
    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      floors: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      floor0: new FormControl(null, [Validators.required]),
      floor1: new FormControl(null, [Validators.required]),
      floor2: new FormControl(null, [Validators.required]),
      floor3: new FormControl(null, [Validators.required]),
      floor4: new FormControl(null, [Validators.required]),
      startRoom0: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      endRoom0: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      startRoom1: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      endRoom1: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      startRoom2: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      endRoom2: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      startRoom3: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      endRoom3: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      startRoom4: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
      endRoom4: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
    })
  }

  createArrForFloors() {
    this.floors = []
    if (this.form.get('floors').value > 4) {
      setTimeout(() => {
        this.form.get('floors').reset()
      }, 3000)
    }

    if (this.floors.length < 1) {
      for (let i = 1; i <= this.quantityFloors && i < 5; i++) {
        this.floors.push(i)
      }
    }
  }

  setValueInInputFloors() {
    let startFloor = this.form.get('floor1').value

    if (this.form.get('floor1').value > 0) {

      for (let i = 1; i <= this.floors.length; i++) {
        this.form.controls['floor' + i].setValue(startFloor++)
      }

      for (let i = 0; i <= this.floors.length; i++) {
        this.form.controls['floor' + i].disable()
      }
      this.stateService.quantityFloors = this.quantityFloors
    }
  }

  checkQuantityFloors(numberFloors: number) {
    this.quantityFloors = numberFloors
    if (this.quantityFloors != this.stateService.quantityFloors) {
      for (let i = 0; i <= this.floors.length; i++) {
        this.form.controls['floor' + i].reset()
        this.form.controls['floor' + i].enable()
      }
    }
  }

  protected readonly Number = Number;

  getValuesOfRooms() {
    let countArr = []

    for (let i = 0; i < this.floors.length; i++) {

      for (let j = (this.form.controls['startRoom' + (i+1)].value -1 ); j <= this.form.controls['endRoom' + i].value; j++) {

        this.rooms.push(j)
        console.log(this.form.controls['startRoom' +1].value +  this.form.controls['endRoom' + 1].value)
        console.log(this.form.controls['startRoom2'].value +  this.form.controls['endRoom' + 2].value)
      }
      this.quantityRooms = this.rooms.length


    }
    console.log(this.rooms)

  }
}
