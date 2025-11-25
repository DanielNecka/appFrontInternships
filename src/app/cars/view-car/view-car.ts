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
  car: any = null;
  loading = true;
  error: string | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly carService: CarsService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error = 'Nieprawidłowe ID samochodu.';
      this.loading = false;
      return;
    }

    this.carService.getCarById(id).subscribe({
      next: (data) => {
        this.car = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Nie udało się pobrać danych samochodu.';
        this.loading = false;
      },
    });
  }
}
