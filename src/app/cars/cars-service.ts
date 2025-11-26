import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CarModel } from '../models/car-model';

@Injectable({
  providedIn: 'root',
})
export class CarsService {
  apiUrl = 'http://localhost:3000'

  constructor(
    private readonly http: HttpClient
  ) {}

  getAllCars(): Observable<CarModel[]> {
    return this.http.get<CarModel[]>(`${this.apiUrl}/car`);
  }

  getCarById(id: number): Observable<CarModel> {
    return this.http.get<CarModel>(`${this.apiUrl}/car/${id}`);
  }

  delCar(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/car/${id}`, { responseType: 'text' });
  }
}
