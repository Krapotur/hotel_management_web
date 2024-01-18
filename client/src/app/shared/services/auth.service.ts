import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Login} from "../interfaces";
import {Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token = null

  constructor(private http: HttpClient) {
  }


  login(login: Login): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('api/auth/login', login)
      .pipe(
        tap(({token}) => {
          this.setToken(token)
          localStorage.setItem('auth-token', token)
        })
      )
  }

  setToken(token: string) {
    this.token = token
  }

  getToken(): string{
    return this.token
  }

  isAuthenticated(): boolean{
    return !!this.token
  }

  logout(){
    this.setToken(null)
    localStorage.clear()
  }
}
