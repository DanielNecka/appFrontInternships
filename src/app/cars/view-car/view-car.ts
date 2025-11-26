import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarModel } from '../../models/car-model';
import { CarsService } from '../cars-service';

@Component({
  selector: 'app-view-car',
  standalone: false,
  templateUrl: './view-car.html',
  styleUrl: './view-car.scss',
})
export class ViewCar implements OnInit {
  car: CarModel | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly carService: CarsService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.getCar(id);
  }

  getCar(id: number): void {
    this.carService.getCarById(id).subscribe(data => {
      this.car = data;
    });
  }

  delCar(id: number | undefined, event: Event): void {
    event.stopPropagation();
    if (typeof id !== 'number') {
      alert('Brak identyfikatora pojazdu. Odśwież widok i spróbuj ponownie.');
      return;
    }
    const confirmDelete = confirm('Czy chcesz usunąć ten samochód?');

    if (!confirmDelete) {
      return;
    }

    this.carService.delCar(id).subscribe({
      next: () => {
        alert('Samochód został usunięty.');
        this.router.navigate(['/main-cars']);
      }
    });
  }
}
