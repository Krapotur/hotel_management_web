import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Hotel} from "../interfaces";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HotelsService {

  constructor(private http: HttpClient) { }

  create(hotel: Hotel): Observable<{message: string}>{
    const fd = new FormData()

    if(hotel.image){
      fd.append('image', hotel.image, hotel.image.name)
    }


   return  this.http.post<{message: string}>('/api/hotels', hotel)
  }

}
