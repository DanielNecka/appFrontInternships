import { Component, Input, OnInit } from '@angular/core';
import { CarModel } from '../../models/car-model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { CarsService, AddCarResponse } from '../cars-service';

@Component({
  selector: 'app-add-mod-car',
  standalone: false,
  templateUrl: './add-mod-car.html',
  styleUrl: './add-mod-car.scss',
})

export class AddModCar implements OnInit {
  @Input() car?: CarModel;
  @Input() mode: 'add' | 'mod' = 'add';

  CarInputForm!: CarModel;

  constructor(
    public readonly activateModal: NgbActiveModal,
    private readonly carsService: CarsService,
  ) { }

  ngOnInit(): void {
    this.CarInputForm = this.car ? { ...this.car } : { brand: '', model: '', price: 0 };
  }

  onSave(formData: NgForm): void {
    if (this.mode === 'mod') {
      this.modifyCar();
    } else {
      this.saveCar();
    }
  }

  close(): void {
    this.activateModal.dismiss();
  }

  private loadData(): CarModel {
    const brand = this.CarInputForm.brand.trim();
    const model = this.CarInputForm.model.trim();
    const price = Number(`${this.CarInputForm.price ?? ''}`.trim());

    return { brand, model, price };
  }

  private modifyCar(): void {
    const car: CarModel = this.loadData();

    this.carsService.updateCar(this.car!.id!, car).subscribe({
      next: () => {
        this.activateModal.close({});
      }
    });
  }

  private saveCar(): void {
    const car: CarModel = this.loadData();

    this.carsService.addCar(car).subscribe({
      next: (response: AddCarResponse) => {
        this.activateModal.close({});
      }
    });
  }
}
