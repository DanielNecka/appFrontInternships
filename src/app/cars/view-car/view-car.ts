import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarsService } from '../cars-service';

@Component({
  selector: 'app-view-car',
  standalone: false,
  templateUrl: './view-car.html',
  styleUrl: './view-car.scss',
})
export class ViewCar implements OnInit {
  car: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly carService: CarsService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.getCar(id);
  }

  getCar(id: number): void {
    this.carService.getCarById(id).subscribe(data => {
      this.car = data;
    })
  }
}
