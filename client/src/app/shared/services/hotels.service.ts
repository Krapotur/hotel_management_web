import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Hotel} from "../interfaces";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class HotelsService {

    constructor(private http: HttpClient) {
    }

    create(hotel: Hotel, image: File): Observable<Hotel> {
        const fd = new FormData()
        fd.append('title', hotel.title)
        if (hotel.floors) {
            fd.append('floors', hotel.floors.toString())
        }

        for (let i = 0; i < hotel.personal.length; i++) {
            fd.append('personal', hotel.personal[i])
        }

        if (image) {
            fd.append('image', image, image.name)
        }

        return this.http.post<Hotel>('/api/hotels', fd)
    }

    getAll(): Observable<Hotel[]> {
        return this.http.get<Hotel[]>('/api/hotels')
    }

    getHotelById(userID: string): Observable<Hotel> {
        return this.http.get<Hotel>(`/api/hotels/${userID}`)
    }

    delete(hotelID: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`/api/hotels/${hotelID}`)
    }

    update(hotelId: string, fd: FormData): Observable<{ message: string }> {
        return this.http.patch<{ message: string }>(`/api/hotels/${hotelId}`, fd)
    }
}
