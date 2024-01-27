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
import {PostsService} from "../shared/services/posts.service";
import {Post} from "../shared/interfaces";

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
  aSub: Subscription
  pSub: Subscription
  posts: Post[]
  protected readonly onsubmit = onsubmit;

  constructor(private auth: AuthService,
              private postsService: PostsService,
              private router: Router,
              private route: ActivatedRoute
              ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      login: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })

  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
    if (this.pSub){
      this.pSub.unsubscribe()
    }
  }

  onSubmit() {
    this.form.disable()
    const login = {
      login: this.form.value.login,
      password: this.form.value.password
    }

    this.aSub = this.auth.login(login).subscribe({
      next: (result) => {
        this.router.navigate(['/admin-panel']).then(r => console.log(r))
      },
      error: (error) => {
        console.warn(error)
        this.form.enable()
      }
    })
  }

  // getPosts(){
  //   this.pSub = this.postsService.getAll().subscribe({
  //       next: posts => {
  //         this.posts = posts;
  //         console.log('1',posts)
  //       },
  //       error: error => console.log(error.error.message)
  //     })
  //   console.log(this.postsService.posts)
  // }
}
