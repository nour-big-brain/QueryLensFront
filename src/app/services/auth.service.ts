// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  userId: string;
  username: string;
  email: string;
  roleId: string | null;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/auth'; 
  private tokenKey = 'auth_token';
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromToken();
  }

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, {
      username, email, password
    }).pipe(
      tap(res => this.handleAuthentication(res)),
      catchError(this.handleError)
    );
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
      username, password
    }).pipe(
      tap(res => this.handleAuthentication(res)),
      catchError(this.handleError)
    );
  }

  refreshToken(): Observable<{ token: string }> {
    const token = this.getToken();
    if (!token) return throwError(() => new Error('No token'));

    return this.http.post<{ token: string }>(`${this.apiUrl}/refresh-token`, { token }).pipe(
      tap(res => localStorage.setItem(this.tokenKey, res.token)),
      catchError(this.handleError)
    );
  }

  private handleAuthentication(res: AuthResponse) {
    localStorage.setItem(this.tokenKey, res.token);
    this.userSubject.next(res.user);
  }

  private loadUserFromToken() {
    const token = this.getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user = {
        userId: payload.userId,
        username: payload.username || 'User',
        email: payload.email || '',
        roleId: payload.roleId || null
      };
      this.userSubject.next(user);
    } catch (e) {
      this.logout();
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'An error occurred';
    if (error.error?.error) {
      message = error.error.error;
    } else if (error.status === 401) {
      message = 'Invalid credentials';
    } else if (error.status === 403) {
      message = 'Account deactivated or deleted';
    }
    return throwError(() => new Error(message));
  }
}