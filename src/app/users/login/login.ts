import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Auth } from '../../auth/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  authError: string | null = null;

  constructor(
    private readonly authService: Auth,
    private readonly router: Router
  ) {}

  submitData(form: NgForm) {
    this.authError = null;

    const login = form.value.login;
    const password = form.value.password;

    this.authService.login(login, password).subscribe({
      error: () => this.authError = 'Nieprawidłowy login lub hasło.'
    });
  }

  clearAuthError(form: NgForm) {
    if (!this.authError) {
      return;
    }

    this.authError = null;
  }
}
