import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CarModel } from '../models/car-model';

export interface AddCarResponse {
  msg: string;
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

  public searchCars(search: object): Observable<CarModel[]> {
    return this.http.post<CarModel[]>(`${this.apiUrl}/car/search`, search);
  }

  public getCarById(id: number): Observable<CarModel> {
    return this.http.get<CarModel>(`${this.apiUrl}/car/${id}`);
  }

  public delCar(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/car/${id}`, { responseType: 'text' });
  }

  public addCar(car: CarModel, imageFile?: File): Observable<AddCarResponse> {
    const formData = new FormData();
    formData.append('brand', car.brand);
    formData.append('model', car.model);
    formData.append('price', String(car.price));
    formData.append('isRented', String(car.isRented ?? false));

    if (car.fuelType) {
      formData.append('fuelType', car.fuelType);
    }

    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    }

    return this.http.post<AddCarResponse>(`${this.apiUrl}/car`, formData);
  }

  public updateCar(id: number, car: CarModel): Observable<string> {
    return this.http.patch<string>(`${this.apiUrl}/car/${id}`, car, {
      responseType: 'text' as 'json'
    });
  }
}
