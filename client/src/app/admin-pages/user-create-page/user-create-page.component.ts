import {Component, DoCheck, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {UsersService} from "../../shared/services/users.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Hotel, Post, User} from "../../shared/interfaces";
import {Subscription} from "rxjs";
import {PostsService} from "../../shared/services/posts.service";
import {MaterialService} from "../../shared/classes/material.service";
import {HotelsService} from "../../shared/services/hotels.service";

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
    ReactiveFormsModule,
    NgClass,
    RouterLink
  ],
  templateUrl: './user-create-page.component.html',
  styleUrl: './user-create-page.component.scss'
})
export class UserCreatePageComponent implements OnInit, DoCheck, OnDestroy {
  form: FormGroup
  formPassword: FormGroup
  post = new FormControl('');
  user: User
  hotels: Hotel[] = []
  params: string
  postsSub: Subscription
  uSub: Subscription
  hSub: Subscription
  pSub: Subscription
  titleForm = ''
  isEdit = true
  isDelete = false
  isResetPassword = false

  posts: Post[]

  constructor(private userService: UsersService,
              private hotelService: HotelsService,
              private postsService: PostsService,
              private router: Router,
              private route: ActivatedRoute) {
  }


  ngOnInit() {
    this.getParams()
    this.generateForm()
    this.getPosts()
  }

  ngDoCheck() {
    this.isDelete || this.isResetPassword ? this.form.disable() : this.form.enable()
  }

  ngOnDestroy() {
    if (this.pSub) {
      this.pSub.unsubscribe()
    }
    if (this.uSub) {
      this.uSub.unsubscribe()
    }
    if (this.hSub) {
      this.hSub.unsubscribe()
    }
  }

  generateForm() {
    this.form = new FormGroup({
      lastName: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      firstName: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      phone: new FormControl(null, [Validators.required, Validators.min(9000000000),Validators.max(9999999999)]),
      post: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      login: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      password: new FormControl(null, [Validators.required]),
    })
  }

  getParams() {
    this.pSub = this.route.queryParams.subscribe(params => {
      this.params = params['userID']
      this.getUserById(params['userID'])
    })
    this.params ? this.isEdit = true : this.isEdit = false
  }

  getUserById(id: string) {
    if (id) {
      this.uSub = this.userService.getUserById(id).subscribe({
        next: user => {
          this.form.patchValue({
            lastName: user.lastName,
            firstName: user.firstName,
            phone: user.phone,
            post: user.post,
            login: user.login
          })
          this.titleForm = user.lastName + ' ' + user.firstName
          this.user = user
        },
        error: error => MaterialService.toast(error.error.message),
      })
      this.getHotelsByUser()
    } else this.titleForm = 'Новый сотрудник'
  }

  getPosts() {
    this.postsSub = this.postsService.getAll().subscribe({
      next: posts => {
        this.posts = posts.filter(post => post.title.toLowerCase() !== 'admin')
      }
    })
  }

  getHotelsByUser(){
    this.hSub = this.hotelService.getAll().subscribe({
      next: hotels => {
         this.hotels = hotels.filter(hotel => hotel.personal.includes(this.user._id))
      }
    })
  }

  onSubmit() {
    const user: User = {
      lastName: this.form.get('lastName').value,
      firstName: this.form.get('firstName').value,
      phone: this.form.get('phone').value,
      post: this.form.get('post').value,
      login: this.form.get('login').value.toString().toLowerCase(),
      password: this.form.get('password').value,
    }

    if (!this.params) {
      this.userService.create(user).subscribe({
        next: (message: { message: string }) => {
          MaterialService.toast(message.message)
          this.router.navigate(['/admin-panel/users']).then()
        },
        error: (error) => MaterialService.toast(error.error.message)
      })
    } else {
      this.isResetPassword ? this.resetPassword() : this.userService.update({
        _id: this.user._id,
        lastName: this.form.get('lastName').value,
        firstName: this.form.get('firstName').value,
        phone: this.form.get('phone').value,
        post: this.form.get('post').value,
        login: this.form.get('login').value,
      }).subscribe({
        next: (message: { message: string }) => {
            MaterialService.toast(message.message)
            this.router.navigate(['/admin-panel/users']).then()
        },
        error: (error) => MaterialService.toast(error.error.message),
        complete: () => {
        }
      })
    }
    this.openUsersPage()
  }

  delete() {
    this.uSub = this.userService.delete(this.user).subscribe({
      next: message => console.log(message.message),
      error: error => console.log(error.error.message)
    })
    this.openUsersPage()
  }

  openUsersPage() {
    this.router.navigate(['admin-panel/users']).then()
  }

  generateFormPassword() {
    this.isResetPassword = !this.isResetPassword
    this.formPassword = new FormGroup({
      password: new FormControl(null, [Validators.required]),
      checkPassword: new FormControl(null, [Validators.required]),
    })
  }

  resetPassword() {
    if (this.formPassword.get('password').value == this.formPassword.get('checkPassword').value) {
      this.userService.update({
        ...this.user,
        password: this.formPassword.get('password').value
      }).subscribe({
        next: message => {
          MaterialService.toast(message.message)
          this.router.navigate(['/admin-panel/users']).then()
        },
        error: (error) => MaterialService.toast(error.error.message),
      })
      this.openUsersPage()
    } else MaterialService.toast('Пароли не совпадают')
  }

}
