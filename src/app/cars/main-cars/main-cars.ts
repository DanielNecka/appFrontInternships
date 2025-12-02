import { Component, OnInit } from '@angular/core';
import { CarsService } from '../cars-service';
import { CarModel } from '../../models/car-model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddModCar } from '../add-mod-car/add-mod-car';
import { SearchModel } from '../../models/search-model';
import { NgForm } from '@angular/forms';

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

  protected cars: CarModel[] = [];
  protected pagedCars: CarModel[] = [];

  protected page: number = 1;
  protected limit: number = 8;
  protected total: number = 0;

  protected searchForm: SearchModel = {
    search: '',
    column: 'brand',
    isRented: true,
    isNotRented: true
  };

  CarInputForm!: CarModel;

  ngOnInit() {
    this.getAllCars();
  }

  searchCars() {
  let search: any = {};

  if (this.searchForm.column == 'brand' && this.searchForm.search) {
    search.brand = this.searchForm.search;
  }

  if (this.searchForm.column == 'model' && this.searchForm.search) {
    search.model = this.searchForm.search;
  }

  if (this.searchForm.column == 'maxPrice' && this.searchForm.search) {
    search.maxPrice = this.searchForm.search;
  }

  if (this.searchForm.column == 'minPrice' && this.searchForm.search) {
    search.minPrice = this.searchForm.search;
  }

  if (this.searchForm.isRented && this.searchForm.isNotRented) {

  } if (this.searchForm.isRented && !this.searchForm.isNotRented) {
    search.isRented = true;
  } else if (this.searchForm.isNotRented && !this.searchForm.isRented) {
    search.isRented = false;
  }

  this.carService.searchCars(search).subscribe(data => {
    this.cars = data;
    this.total = this.cars.length;
    this.updatePage();  
  });
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
    modalRef.componentInstance.mode = action === 'add' ? 'add' : 'mod';

    modalRef.result.then(
      (result) => {
        this.page = 1;
        this.getAllCars();
      }
    );
  }
}