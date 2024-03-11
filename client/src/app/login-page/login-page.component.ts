import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgIf} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {AuthService} from "../shared/services/auth.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Post, User} from "../shared/interfaces";
import {MaterialService} from "../shared/classes/material.service";
import {UsersService} from "../shared/services/users.service";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    NgIf,
    MatIconModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit, OnDestroy {
  form: FormGroup
  formPassword: FormGroup
  isTruePassword = true
  isAdmin = false
  aSub: Subscription
  pSub: Subscription
  uSub: Subscription
  posts: Post[]

  constructor(private auth: AuthService,
              private userService: UsersService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      login: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })

    this.formPassword = new FormGroup({
      password: new FormControl(null, [Validators.required, Validators.min(6)]),
      checkPassword: new FormControl(null, [Validators.required]),
    })

    this.route.queryParams.subscribe(params => {
      if (params['sessionFailed']) {
        MaterialService.toast('Сессия истекла, авторизуйтесь заново')
      }
      if (params['admin'] == 'true') {
        this.isAdmin = true
      }
    })
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
    if (this.pSub) {
      this.pSub.unsubscribe()
    }
    if (this.uSub) {
      this.uSub.unsubscribe()
    }
  }

  onSubmit() {
    if (this.isAdmin) {
      let user: User = {
        lastName: 'Administrator',
        firstName: 'System',
        post: 'admin',
        phone: '',
        login: 'admin',
        password: this.formPassword.get('checkPassword').value ? this.formPassword.get('checkPassword').value : null
      }

      this.uSub = this.userService.create(user).subscribe({
        next: () => MaterialService.toast('Пароль для "admin" успешно задан, попробуйте авторизоваться'),
        error: error => MaterialService.toast(error.error.message)
      })
      this.isAdmin = false

    } else {
      this.form.disable()

      const login = {
        login: this.form.value.login,
        password: this.form.value.password
      }

      this.aSub = this.auth.login(login).subscribe({
        next: (auth) => {
          if (auth.post === "Администратор") {
            this.router.navigate(['/management/hotels']).then()
          } else if (auth.post === "Горничная") {
            MaterialService.toast('Доступ в систему запрещен')
            this.form.enable()
          } else {
            this.router.navigate(['/admin-panel']).then()
          }
        },
        error: error => {
          MaterialService.toast(error.error.message)
          this.form.enable()
        }
      })
    }
  }

  checkPassword() {
    if (this.formPassword.get('password').value !== this.formPassword.get('checkPassword').value) {
      MaterialService.toast('Пароли не совпадают, проверьте еще раз')
      this.isTruePassword = false
    } else this.isTruePassword = true
  }
}
