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
    if (!this.car?.id) {
      return;
    }
    
    const payload = this.resolvePayload();

    if (!payload) {
      return;
    }

    this.carsService.updateCar(this.car.id, payload).subscribe({
      next: () => {
        this.isSaving = false;
        const updatedCar = this.car ? { ...this.car, ...payload } : payload;
        this.activateModal.close({ save: true, action: 'mod', updatedCar });
      }
    });
  }

  private saveAddition(): void {
    this.isSaving = true;
    const payload = this.resolvePayload();

    if (!payload) {
      this.isSaving = false;
      return;
    }

    this.carsService.addCar(payload).subscribe({
      next: (response: AddCarResponse) => {
        this.isSaving = false;
        const addedCar = response.addedCar ?? payload;
        this.activateModal.close({
          save: true,
          action: 'add',
          addedCar,
          message: response.message,
        });
      }
    });
  }

  private resolvePayload(): CarModel | null {
    const brand = this.formData.brand.trim();
    const model = this.formData.model.trim();
    const priceRaw = `${this.formData.price ?? ''}`.trim();

    if (!brand || !model) {
      this.errorMessage = 'Marka i model są wymagane.';
      return null;
    }

    if (!priceRaw) {
      this.errorMessage = 'Cena jest wymagana.';
      return null;
    }

    const price = Number(priceRaw);

    if (!Number.isFinite(price) || price < 0) {
      this.errorMessage = 'Cena musi być liczbą większą lub równą zero.';
      return null;
    }

    return { brand, model, price };
  }
}
