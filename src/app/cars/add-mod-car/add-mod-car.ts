import { Component, Input, OnInit } from '@angular/core';
import { CarModel } from '../../models/car-model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { CarsService, AddCarResponse } from '../cars-service';

type CarFormData = {
  brand: string;
  model: string;
  price: string;
};

@Component({
  selector: 'app-add-mod-car',
  standalone: false,
  templateUrl: './add-mod-car.html',
  styleUrl: './add-mod-car.scss',
})
export class AddModCar implements OnInit {
  @Input() car?: CarModel;
  @Input() mode: 'add' | 'mod' = 'add';

  formData: CarFormData = { brand: '', model: '', price: '' };
  errorMessage = '';
  isSaving = false;

  constructor(
    public readonly activateModal: NgbActiveModal,
    private readonly carsService: CarsService,
  ) {}

  ngOnInit(): void {
    if (this.car) {
      this.formData = {
        brand: this.car.brand,
        model: this.car.model,
        price: String(this.car.price),
      };
    }
  }

  onSave(formData: NgForm): void {
    if (this.mode === 'mod') {
      this.saveModification();
    } else {
      this.saveAddition();
    }
  }

  close(): void {
    this.activateModal.dismiss();
  }

  private saveModification(): void {    
    if (!this.car || !this.car.id) return; 

    const car: any = this.loadData(); 

    this.carsService.updateCar(this.car.id, car).subscribe({
      next: () => {
        this.activateModal.close({});
      }
    });
  }

  private saveAddition(): void {
    const car: any  = this.loadData();

    this.carsService.addCar(car).subscribe({
      next: (response: AddCarResponse) => {
        this.activateModal.close({});
      }
    });
  }

  private loadData(): CarModel | null {
    const brand = this.formData.brand.trim();
    const model = this.formData.model.trim();
    const price = Number(`${this.formData.price ?? ''}`.trim());


    return { brand, model, price };
  }
}
