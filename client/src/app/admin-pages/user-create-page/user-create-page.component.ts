import {AfterViewInit, Component, DoCheck, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {UsersService} from "../../shared/services/users.service";
import {StateService} from "../../shared/services/state.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Post, User} from "../../shared/interfaces";
import {filter, Subscription} from "rxjs";
import {PostsService} from "../../shared/services/posts.service";

@Component({
  selector: 'app-user-create-page',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './user-create-page.component.html',
  styleUrl: './user-create-page.component.scss'
})
export class UserCreatePageComponent implements OnInit, DoCheck, AfterViewInit, OnDestroy {
  form: FormGroup
  post = new FormControl('');
  user: User
  params: string
  postsSub: Subscription
  uSub: Subscription
  pSub: Subscription
  titleForm = ''
  isShowTemplate = true
  isEmptyPosts = true
  isEdit = false
  isDelete = false

  posts: Post[]
  hotelsList: string[] = ['ss', 'sss']

  constructor(private userService: UsersService,
              private stateService: StateService,
              private postsService: PostsService,
              private router: Router,
              private route: ActivatedRoute) {
  }


  ngOnInit() {
    this.generateForm()
    this.getParams()
    this.getUserById()
    this.getPosts()
  }

  ngDoCheck() {
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    if (this.pSub) {
      this.pSub.unsubscribe()
    }
    if (this.uSub) {
      this.uSub.unsubscribe()
    }
  }

  generateForm() {
    this.form = new FormGroup({
      lastName: new FormControl(null, [Validators.required]),
      firstName: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required]),
      post: new FormControl(null, [Validators.required]),
      hotels: new FormControl(null, [Validators.required]),
      login: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    })
  }

  getParams() {
    this.pSub = this.route.queryParams.subscribe(params => {
      this.params = params['userID']
    })
    this.params ? this.isEdit = true : this.isEdit = false
  }

  getUserById() {
    this.uSub = this.userService.getUserById(this.params).subscribe({
      next: user => {
        this.form.get('lastName').setValue(user.lastName)
        this.form.get('firstName').setValue(user.firstName)
        this.form.get('phone').setValue(user.phone)
        this.form.get('post').setValue(user.post)
        this.form.get('hotels').setValue(user.hotels)
        this.form.get('login').setValue(user.login)
        this.form.get('password').setValue(user.password)
      }
    })
  }

  getPosts(){
    this.postsSub = this.postsService.getAll().subscribe({
      next: posts =>{
        this.posts = posts
      }
    })
  }
  changeTemplate(method?: string, post?: Post) {
    switch (method) {
      case 'add': {
        this.isDelete = false
        this.stateService.showTemplate = true
        this.titleForm = `Название должности`
        this.isEdit = false
        this.form.get('title').reset()
      }
        break;
      case 'delete': {
        // this.titleForm = `Удалить "${this.post.title.toUpperCase()}"`
        this.isDelete = true
      }
        break;
      case 'edit': {
        this.stateService.showTemplate = true
        this.isEdit = true
        this.isDelete = false
        // this.post = post
        this.titleForm = `Изменение "${post.title}"`
        this.form.get('title').setValue(post.title)
      }
        break;
      default: {
        this.isShowTemplate = !this.isShowTemplate
      }
    }
  }

  onSubmit() {
    const newUser: User = {
      lastName: this.form.get('lastName').value,
      firstName: this.form.get('firstName').value,
      phone: this.form.get('phone').value,
      post: this.form.get('post').value,
      hotels: this.form.get('hotels').value,
      login: this.form.get('login').value,
      password: this.form.get('password').value,
    }
    const fd = new FormData()

    fd.append('lastName', this.form.get('lastName').value)
    fd.append('firstName', this.form.get('firstName').value)
    fd.append('phone', this.form.get('phone').value)
    fd.append('post', this.form.get('post').value)
    fd.append('login', this.form.get('login').value)
    fd.append('password', this.form.get('password').value)

    for (let i = 0; i < this.form.get('hotels').value.length; i++) {
      fd.append('hotels', this.form.get('hotels').value[i])
    }

    this.userService.create(fd).subscribe({
      next: (message: { message: string }) => {
        if (message.message == 'Успех') {
          this.router.navigate(['/admin-panel/users'])
        }
      },
      error: (error) => console.log(error.error.message),
      complete: () => {
      }
    })
  }

  openUsersPage() {
    this.router.navigate(['admin-panel/users'])
  }
}
