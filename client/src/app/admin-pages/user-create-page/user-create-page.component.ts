import {AfterViewInit, Component, DoCheck, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {UsersService} from "../../shared/services/users.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Post, User} from "../../shared/interfaces";
import {Subscription} from "rxjs";
import {PostsService} from "../../shared/services/posts.service";
import {MaterialService} from "../../shared/classes/material.service";

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
export class UserCreatePageComponent implements OnInit, DoCheck, AfterViewInit, OnDestroy {
    form: FormGroup
    formPassword: FormGroup
    post = new FormControl('');
    user: User
    params: string
    postsSub: Subscription
    uSub: Subscription
    pSub: Subscription
    titleForm = ''
    isEdit = true
    isDelete = false
    isResetPassword = false

    posts: Post[]

    constructor(private userService: UsersService,
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
            login: new FormControl(null, [Validators.required]),
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
                error: error => console.log(error.error.message),
            })
        } else {
            this.titleForm = 'Новый сотрудник'
        }
    }

    getPosts() {
        this.postsSub = this.postsService.getAll().subscribe({
            next: posts => {
                this.posts = posts
            }
        })
    }

    onSubmit() {
        const user: User = {
            lastName: this.form.get('lastName').value,
            firstName: this.form.get('firstName').value,
            phone: this.form.get('phone').value,
            post: this.form.get('post').value,
            login: this.form.get('login').value,
            password: this.form.get('password').value,
        }

        if (!this.params) {
            this.userService.create(user).subscribe({
                next: (message: { message: string }) => {
                    if (message.message == 'Успех') {
                        this.router.navigate(['/admin-panel/users'])
                    }
                },
                error: (error) => console.log(error.error.message),
                complete: () => {
                }
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
                    if (message.message == 'Успех') {
                        this.router.navigate(['/admin-panel/users'])
                    }
                },
                error: (error) => console.log(error.error.message),
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
        this.router.navigate(['admin-panel/users'])
    }

    generateFormPassword() {
        this.form.disable()
        this.isResetPassword = !this.isResetPassword
        this.formPassword = new FormGroup({
            password: new FormControl(null, [Validators.required]),
            checkPassword: new FormControl(null, [Validators.required]),
        })
    }

    resetPassword() {
        this.userService.update({
            ...this.user,
            password: this.formPassword.get('password').value
        }).subscribe({
            next: message => {
                MaterialService.toast(message.message)
                this.router.navigate(['/admin-panel/users'])
            },
            error: (error) => MaterialService.toast(error.error.message),
            complete: () => {
            }
        })
        this.openUsersPage()
    }

    blur = blur;

}
