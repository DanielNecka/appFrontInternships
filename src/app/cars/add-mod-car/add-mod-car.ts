import { Component, Input, OnInit } from '@angular/core';
import { CarModel } from '../../models/car-model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { CarsService, AddCarResponse } from '../cars-service';

@Component({
  selector: 'app-add-mod-car',
  standalone: false,
  templateUrl: './add-mod-car.html',
  styleUrls: ['./add-mod-car.scss'],
})

export class AddModCar implements OnInit {
  @Input() car?: CarModel;
  @Input() mode: 'add' | 'mod' = 'add';

  CarInputForm!: CarModel;
  selectedFile: File | null = null;
  fileError: string | null = null;
  imagePreviewUrl: string | null = null;
  readonly fuelTypeOptions = ['Benzyna', 'Diesel', 'Hybrydowy', 'Elektryczny', 'LPG'];

  constructor(
    public readonly activateModal: NgbActiveModal,
    private readonly carsService: CarsService,
  ) { }

  ngOnInit(): void {
    this.CarInputForm = this.car
      ? { ...this.car }
      : { brand: '', model: '', price: 0, isRented: false, fuelType: '' };

    if (!this.CarInputForm.fuelType) {
      this.CarInputForm.fuelType = '';
    }

  }

  onSave(formData: NgForm): void {
    if (formData.invalid) {
      return;
    }

    if (this.mode === 'add' && !this.selectedFile) {
      this.fileError = 'Dodaj zdjęcie samochodu przed zapisaniem.';
      return;
    }

    if (this.mode === 'mod') {
      this.modifyCar();
      return;
    }

    this.saveCar();
  }

  close(): void {
    this.activateModal.dismiss();
  }

  private loadData(): CarModel {
    const brand = this.CarInputForm.brand.trim();
    const model = this.CarInputForm.model.trim();
    const parsedPrice = Number(`${this.CarInputForm.price ?? ''}`.trim());
    const price = Number.isFinite(parsedPrice) ? parsedPrice : 0;
    const fuelType = this.CarInputForm.fuelType?.trim();

    return { brand, model, price, fuelType: fuelType || undefined };
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

    this.carsService.addCar(car, this.selectedFile ?? undefined).subscribe({
      next: (response: AddCarResponse) => {
        this.activateModal.close({ addedCar: response.addedCar });
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : null;

    if (!file) {
      this.selectedFile = null;
      this.imagePreviewUrl = null;
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.fileError = 'Dozwolone są wyłącznie pliki graficzne (jpg, png, svg itp.).';
      this.selectedFile = null;
      this.imagePreviewUrl = null;
      input.value = '';
      return;
    }

    const maxSizeMb = 5;
    if (file.size > maxSizeMb * 1024 * 1024) {
      this.fileError = `Plik jest za duży. Maksymalny rozmiar to ${maxSizeMb} MB.`;
      this.selectedFile = null;
      this.imagePreviewUrl = null;
      input.value = '';
      return;
    }

    this.fileError = null;
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = typeof reader.result === 'string' ? reader.result : null;
    };
    reader.readAsDataURL(file);
  }
}
