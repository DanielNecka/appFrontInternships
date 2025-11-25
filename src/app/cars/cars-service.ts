import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarsService {
  apiUrl = 'http://localhost:3000'

  constructor(
    private readonly http: HttpClient
  ) {}

  getAllCars(): Observable<any> {
    return this.http.get(`${this.apiUrl}/car`);
  }

  getCarById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/car/${id}`);
  }

  delCar(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/car/${id}`, { responseType: 'text' as const });
  }
}
