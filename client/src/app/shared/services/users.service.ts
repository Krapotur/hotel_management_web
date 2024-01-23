import { Injectable } from '@angular/core';
import {User} from "../interfaces";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  create(user: User):Observable<{message: string}>{
   return  this.http.post<{message: string}>('/api/users',user)
  }
}
