import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CarModel } from '../models/car-model';

export interface AddCarResponse {
  message: string;
  addedCar: CarModel;
}

@Injectable({
  providedIn: 'root',
})
export class CarsService {
  apiUrl = 'http://localhost:3000'

  constructor(
    private readonly http: HttpClient
  ) {}

  public getAllCars(): Observable<CarModel[]> {
    return this.http.get<CarModel[]>(`${this.apiUrl}/car`);
  }

  public getCarById(id: number): Observable<CarModel> {
    return this.http.get<CarModel>(`${this.apiUrl}/car/${id}`);
  }

  public delCar(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/car/${id}`, { responseType: 'text' });
  }

  public addCar(car: CarModel): Observable<AddCarResponse> {
    return this.http.post<AddCarResponse>(`${this.apiUrl}/car`, car);
  }

  public updateCar(id: number, car: CarModel): Observable<string> {
    return this.http.patch<string>(`${this.apiUrl}/car/${id}`, car, {
      responseType: 'text' as 'json'
    });
  }
}
