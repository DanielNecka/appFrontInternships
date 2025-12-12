import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Auth } from '../../auth/auth';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @ViewChild('accountModal') accountModal?: TemplateRef<unknown>;

  constructor(
    private readonly authService: Auth,
    private readonly modalService: NgbModal,
  ) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get userName(): string | null {
    const user = this.authService.getCurrentUserFromToken();
    return user && user.login ? user.login : null;
  }

  get userRole(): string | null {
    const user = this.authService.getCurrentUserFromToken();
    return user && user.role ? user.role : null;
  }

  openAccountModal(event: Event): void {
    event.stopPropagation();

    if (!this.accountModal) {
      return;
    }

    this.modalService.open(this.accountModal, { centered: true, windowClass: 'account-modal-window' });
  }

  logOut() {
    this.authService.logout();
  }
}