import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {House} from "../interfaces";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HousesService {

  constructor(private http: HttpClient) {
  }

  create(house: House, image: File): Observable<{ message: string }> {
    const fd = new FormData()
    fd.append('title', house.title)
    fd.append('floors', house.floors.toString())

    for (let i = 0; i < house.personal.length; i++) {
      fd.append('personal', house.personal[i])
    }

    if (image) {
      fd.append('image', image, image.name)
    }

    return this.http.post<{ message: string }>('/api/houses', fd)
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
