import { Component, OnInit } from '@angular/core';
import { CarsService } from '../cars-service';
import { CarModel } from '../../models/car-model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddModCar } from '../add-mod-car/add-mod-car';

@Component({
  selector: 'app-main-cars',
  standalone: false,
  templateUrl: './main-cars.html',
  styleUrls: ['./main-cars.scss'],
})
export class MainCars implements OnInit {
  constructor(
    private readonly carService: CarsService,
    private readonly modalService: NgbModal
  ) { }

  cars: CarModel[] = [];
  pagedCars: CarModel[] = [];

  page: number = 1;
  limit: number = 8;
  total: number = 0;


  ngOnInit() {
    this.getAllCars();
  }

  getAllCars(): void {
    this.carService.getAllCars().subscribe(data => {
      this.cars = data;
      this.total = this.cars.length;
      this.updatePage();
    })
  }

  updatePage(): void {
    const start = (this.page - 1) * this.limit;
    const end = start + this.limit;

    this.pagedCars = this.cars.slice(start, end);
  }

  nextPage(): void {
    if (this.page * this.limit < this.total) {
      this.page++;
      this.updatePage();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.updatePage();
    }
  }

  openModal(action?: string, event?: Event, carFromHtml?: CarModel): void {
    event?.stopPropagation();
    event?.preventDefault();

    const modalRef = this.modalService.open(AddModCar, {size: 'md'});

    modalRef.componentInstance.car = carFromHtml;

    modalRef.result.then(
      (result) => {
        this.page = 1;
        this.getAllCars();
      }
    );
  }
}