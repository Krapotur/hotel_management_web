import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {House} from "../interfaces";
import {delay, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HousesService {

  constructor(private http: HttpClient) {
  }

  create(fd: FormData): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/houses', fd)
      .pipe(delay(500))
  }

  getAll(): Observable<House[]> {
    return this.http.get<House[]>('/api/houses')
  }

  getHouseById(houseID: string): Observable<House> {
    return this.http.get<House>(`/api/houses/${houseID}`)
  }

  delete(houseID: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/api/houses/${houseID}`)
  }

  update(house?: House, fd?: FormData): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`/api/houses/${house._id}`, fd ? fd : house)
  }
}
