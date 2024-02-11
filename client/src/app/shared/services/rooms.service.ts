import { Injectable } from '@angular/core';
import {Room} from "../interfaces";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  quantityRooms = 0
  constructor(private http: HttpClient) { }

  create(room: Room): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/rooms', room)
  }

  getAll(): Observable<Room[]> {
    return this.http.get<Room[]>('/api/rooms')
  }

  update(room: Room): Observable<Room> {
    return this.http.patch<Room>(`/api/rooms/${room._id}`, room)
  }

  delete(room: Room): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/api/rooms/${room._id}`)
  }

}
