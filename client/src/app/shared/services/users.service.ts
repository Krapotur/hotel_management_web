import {Injectable} from '@angular/core';
import {User} from "../interfaces";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) {
  }

  create(user: User): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/users', user)
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users')
  }

  update(user: User): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`/api/users/${user._id}`, user)
  }

  getUserById(userID: string): Observable<User> {
    return this.http.get<User>(`/api/users/${userID}`)
  }

  delete(user: User): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/api/users/${user._id}`)
  }
}
