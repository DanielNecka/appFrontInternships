import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { JwtPayloadModel } from '../models/jwt-payload-payload';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:3000';

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  login(login: string, password: string): Observable<{access_token: string}> {
    return this.http.post<{access_token: string}>(`${this.apiUrl}/auth/login`, {login: login, password: password}).pipe(
      tap(res => {  
        sessionStorage.setItem('access_token', res.access_token)

        const payload = jwtDecode<JwtPayload & JwtPayloadModel>(res.access_token)
        sessionStorage.setItem('user_name', payload.login)

        this.router.navigate(['/main-cars'])
      })
    )
  }

  logout(): void {
    sessionStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

  getToken()  {
    return sessionStorage.getItem('access_token');
  }

  isLoggedIn(): boolean { 
    const token = this.getToken();
    
    if (!token) {
      return false;
    }

    try {
      const payload = jwtDecode<JwtPayload>(token)

      if (payload.exp && Date.now() >= payload.exp * 1000)  {
        this.logout();
        return false;
      }

      return true;
    } catch   {
      return false;
    }
  }

  getCurrentUserFromToken(): (JwtPayload & Partial<JwtPayloadModel>) | false {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    try {
      return jwtDecode<JwtPayload & Partial<JwtPayloadModel>>(token);
    } catch {
      return false;
    }
  }

  getUserRole(): string | boolean {
    const user = this.getCurrentUserFromToken();

    if (user) {
      return user.role ?? false;
    }

    return false;
  }
}