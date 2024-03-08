import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {NgForOf, NgIf, UpperCasePipe} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Post} from "../../shared/interfaces";
import {PostsService} from "../../shared/services/posts.service";
import {Subscription} from "rxjs";
import {MaterialService} from "../../shared/classes/material.service";
import {StateService} from "../../shared/services/state.service";
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
    ReactiveFormsModule,
    UpperCasePipe
  ],
  templateUrl: './posts-page.component.html',
  styleUrl: './posts-page.component.scss'
})
export class PostsPageComponent implements OnInit, OnDestroy {
  form: FormGroup
  titleForm = ''
  titlePost = ''
  post: Post
  isShowTemplate = false
  isEmptyPosts = true
  isEdit = false
  isDelete = false
  dataSource: MatTableDataSource<Post>
  pSub: Subscription
  posts: Post[]
  excludedPostList = ['admin','администратор','руководитель','горничная']

  constructor(private postsService: PostsService,
              private stateService: StateService,
              private router: Router) {
  }

  displayedColumns: string[] = ['#', 'post', 'action'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.getPosts()
    this.generateForm()
  }

  ngOnDestroy() {
    if (this.pSub) {
      this.pSub.unsubscribe()
    }
  }

  generateForm() {
    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required, Validators.minLength(3)])
    })
  }

  changeTemplate(method?: string, post?: Post) {
    switch (method) {
      case 'add': {
        this.isDelete = false
        this.isShowTemplate = true
        this.stateService.showTemplate = true
        this.titleForm = `Новая должность`
        this.isEdit = false
        this.form.get('title').reset()
      }
        break;
      case 'delete': {
        this.titleForm = `Удалить должность?`
        this.titlePost = `"${this.post.title}"`
        this.isDelete = true
      }
        break;
      case 'edit': {
        this.isShowTemplate = true
        this.stateService.showTemplate = true
        this.isEdit = true
        this.isDelete = false
        this.post = post
        this.titleForm = "Изменение должности"
        this.titlePost = `"${this.post.title}"`
        this.form.get('title').setValue(post.title)
      }
        break;
      default: {
        this.titlePost = ''
        this.isShowTemplate = false
        this.stateService.showTemplate = false
      }
    }
  }

  onSubmit() {
    const post: Post = {
      title: this.form.get('title').value
    }

    if (this.isEdit) {
      this.post.title = post.title
      this.update(this.post)
    } else {
      this.pSub = this.postsService.create(post).subscribe({
          next: (message: { message: string }) => MaterialService.toast(message.message),
          error: error => MaterialService.toast(error.error.message)
        }
      )
      this.router.navigateByUrl('/').then(() => this.router.navigate(['admin-panel/users']))
    }
    this.isShowTemplate = false
    this.stateService.showTemplate = false
  }

  getPosts() {
    let position = 1
    this.pSub = this.postsService.getAll().subscribe({
      next: posts => {
        if (posts.length > 0) {
          this.isEmptyPosts = false

          this.posts = posts.filter(post => post.title !== 'admin')
          this.posts.map(post => post.position = position++)
          this.dataSource = new MatTableDataSource<Post>(this.posts);
          this.dataSource.paginator = this.paginator;
        }
      },
      error: error => MaterialService.toast(error.error.message),
    })
  }


  delete() {
    this.pSub = this.postsService.delete(this.post).subscribe({
      next: message => MaterialService.toast(message.message)
      , error: error => MaterialService.toast(error.error.message)
    })
    this.isShowTemplate = !this.isShowTemplate
    this.stateService.showTemplate = false
    this.router.navigateByUrl('/').then(() => this.router.navigate(['admin-panel/users']))
  }

  update(post: Post) {
    this.pSub = this.postsService.update(post).subscribe({
      next: message => MaterialService.toast(message.message),
      error: error => MaterialService.toast(error.error.message)
    })
  }

}
