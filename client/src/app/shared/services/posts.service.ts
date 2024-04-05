import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Post} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  posts: Post[] = []

  constructor(private http: HttpClient) {
  }

  create(post: Post): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/posts', post)
  }

  getAll(): Observable<Post[]> {
    return this.http.get<Post[]>('/api/posts')
  }

  update(post: Post): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`/api/posts/${post._id}`, post)
  }

  delete(post: Post): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/api/posts/${post._id}`)
  }
}
