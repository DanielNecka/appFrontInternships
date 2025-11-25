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
  ) { }

  cars: any = [];
  pagedCars: any = [];

  page: number = 1;
  limit: number = 8;
  total: number = 0;


  ngOnInit() {
    this.getAllCars()
  }

  getAllCars(): void {
    this.carService.getAllCars().subscribe(data => {
      this.cars = data;
      this.total = this.cars.length;
      this.updatePage();
    })
  }

  updatePage() {
    const start = (this.page - 1) * this.limit;
    const end = start + this.limit;

    this.pagedCars = this.cars.slice(start, end);
  }

  nextPage() {
    if (this.page * this.limit < this.total) {
      this.page++;
      this.updatePage();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.updatePage();
    }
  }

  delCar(id: number, event: Event): void {
    event.stopPropagation();
    const confirmDelete = confirm('Czy chcesz usunąć ten samochód?');

    if (!confirmDelete) {
      return;
    }

    this.carService.delCar(id).subscribe({
      next: () => this.getAllCars(),
      error: (err) => console.error('Błąd usuwania', err)
    });
  }
}