import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {HttpErrorResponse, HttpInterceptorFn, HttpResponse,} from "@angular/common/http";
import {tap} from "rxjs";
import {MaterialService} from "./material.service";
import {Router} from "@angular/router";
import {UsersService} from "../services/users.service";

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService)
  const router = inject(Router)


  if (auth.isAuthenticated()) {
    req = req.clone({
      setHeaders: {
        Authorization: auth.getToken()
      }
    })
  }
  return next(req).pipe(
    tap(
      (event: HttpResponse<any>) => ()=>{},
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          router.navigate(['/login'], {
            queryParams: {
              sessionFailed: true
            }
          }).then()
        }

        auth.setStatus(error.status)
      }
    )
  )
}






