import { Component } from '@angular/core';
import { CarsService } from '../cars-service';

@Component({
  selector: 'app-main-cars',
  standalone: false,
  templateUrl: './main-cars.html',
  styleUrl: './main-cars.scss',
})
export class MainCars {
  constructor(
    private readonly carService: CarsService
  ) {}

  ngOnInit() {
    this.getAllCars()
  }

  getAllCars() {
    this.carService.getAllCars().subscribe(data => {
      console.log(data)
    })
  }
}
