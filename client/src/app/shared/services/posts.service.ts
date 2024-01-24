import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Post} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient) { }

  create(post: Post):Observable<{message: string}>{

    return this.http.post<{ message: string }>('/api/posts', post)
  }
}
