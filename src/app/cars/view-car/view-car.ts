import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarModel } from '../../models/car-model';
import { CarsService } from '../cars-service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddModCar } from '../add-mod-car/add-mod-car';

@Component({
  selector: 'app-view-car',
  standalone: false,
  templateUrl: './view-car.html',
  styleUrl: './view-car.scss',
})
export class ViewCar implements OnInit {
  car: CarModel | null = null;
  @ViewChild('deleteConfirmModal') deleteConfirmModal?: TemplateRef<unknown>;
  @ViewChild('infoModal') infoModal?: TemplateRef<unknown>;
  pendingDeleteId: number | null = null;
  isDeleting = false;
  infoModalData = {
    title: '',
    body: ''
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly carService: CarsService,
    private readonly router: Router,
    private readonly modalService: NgbModal,
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

  openDeleteModal(id: number | undefined, event: Event): void {
    event.stopPropagation();
    if (typeof id !== 'number') {
      this.showInfoModal(
        'Brak identyfikatora',
        'Brak identyfikatora pojazdu. Odśwież widok i spróbuj ponownie.'
      );
      return;
    }
    if (!this.deleteConfirmModal) {
      return;
    }

    this.pendingDeleteId = id;
    this.modalService.open(this.deleteConfirmModal, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
  }

  confirmDelete(modal: NgbActiveModal): void {
    if (this.pendingDeleteId === null) {
      modal.dismiss();
      return;
    }
    this.isDeleting = true;

    this.carService.delCar(this.pendingDeleteId).subscribe({
      next: () => {
        this.isDeleting = false;
        this.pendingDeleteId = null;
        modal.close('deleted');
        this.showInfoModal(
          'Samochód usunięty',
          'Samochód został usunięty z bazy danych.',
          () => this.router.navigate(['/main-cars'])
        );
      },
      error: () => {
        this.isDeleting = false;
        modal.dismiss('error');
        this.showInfoModal(
          'Błąd',
          'Nie udało się usunąć samochodu. Spróbuj ponownie później.'
        );
      }
    });
  }

  private showInfoModal(title: string, body: string, onClose?: () => void): void {
    if (!this.infoModal) {
      onClose?.();
      return;
    }

    this.infoModalData = { title, body };
    const modalRef = this.modalService.open(this.infoModal, { centered: true });

    modalRef.result.finally(() => onClose?.());
  }

  openModal(action?: string, event?: Event, carFromHtml?: CarModel): void {
    if (action === 'mod') {
      event?.stopPropagation();
      event?.preventDefault();
    }

    const modalRef = this.modalService.open(AddModCar, {size: 'md'});

    modalRef.componentInstance.car = carFromHtml;
    modalRef.componentInstance.mode = action === 'mod' ? 'mod' : 'add';

    modalRef.result.then(
      (result) => {
        if (!result) {
          return;
        }

        const res = result.save;

        if (res) {
          const id = carFromHtml?.id ?? this.car?.id;

          if (typeof id === 'number') {
            this.getCar(id);
          }

          this.showInfoModal(
            'Dane zapisane',
            'Pomyślnie zaktualizowano dane tego pojazdu.'
          );
        }
      }
    ).catch(() => { /* modal dismissed */ });
  }

}
