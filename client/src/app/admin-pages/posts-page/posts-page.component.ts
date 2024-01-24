import {AfterViewInit, Component, DoCheck, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {Group, Post} from "../../shared/interfaces";
import {MatButtonModule} from "@angular/material/button";
import {NgForOf, NgIf} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {StateService} from "../../shared/services/state.service";
import {PostsService} from "../../shared/services/posts.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-posts-page',
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
  templateUrl: './posts-page.component.html',
  styleUrl: './posts-page.component.scss'
})
export class PostsPageComponent implements OnInit, DoCheck, AfterViewInit {
  form: FormGroup
  showTemplate = ''

  constructor(private stateService: StateService,
              private postsService: PostsService,
              private router: Router) {
  }

  ELEMENT_DATA: Group[] = [
    {position: 1, post: 'Руководитель'},
    {position: 2, post: 'Супервайзер'},
    {position: 3, post: 'Администратор гостиниц'},
    {position: 4, post: 'Горничная'},
  ];


  displayedColumns: string[] = ['#', 'post'];
  dataSource = new MatTableDataSource<Group>(this.ELEMENT_DATA);

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
      title: new FormControl(null, [Validators.required])
    })
  }

  openTemplate(newPost: string) {
    this.stateService.changeTemplate(newPost);
    this.showTemplate = this.stateService.showTemplate
  }

  checkStatusShowTemplate() {
    this.showTemplate = this.stateService.showTemplate
  }

  onSubmit() {
    const post: Post = {
      title: this.form.get('title').value
    }
    this.form.get('title').reset()
    this.postsService.create(post).subscribe({
        next: (message: { message: string }) => {
          console.log(message)
          this.stateService.showTemplate = ''
        },
        error: error => console.log(error.error.message)
      }
    )
  }
}
