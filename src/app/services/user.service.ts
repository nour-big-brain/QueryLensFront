import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../models/user';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl = 'http://localhost:5000/users';

  constructor(private http: HttpClient) { }
  
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    console.log('🔍 DEBUG getAuthHeaders - token:', token);
    console.log('🔍 DEBUG - All localStorage keys:', Object.keys(localStorage));
    console.log('🔍 DEBUG - Full localStorage:', localStorage);
    
    if (!token) {
      console.warn('⚠️ WARNING: No token found in localStorage!');
      return new HttpHeaders();
    }
    
    console.log('✅ Token found, length:', token.length);
    console.log('✅ Creating Bearer header:', `Bearer ${token.substring(0, 20)}...`);
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('❌ An error occurred:', error);
    console.error('📊 Error details:', {
      status: error.status,
      statusText: error.statusText,
      message: error.error?.error || error.error?.message,
      url: error.url
    });
    const errorMessage = error.error?.error || error.error?.message || 'Server error';
    return throwError(() => new Error(errorMessage));
  }

  // Get all users
  getAllUsers(): Observable<User[]> {
    console.log('📤 getAllUsers - Making request to:', this.apiUrl);
    return this.http
      .get<User[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Get user by ID
  getUserById(id: string): Observable<User> {
    console.log('📤 getUserById - Making request to:', `${this.apiUrl}/${id}`);
    return this.http
      .get<User>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Update user
  updateUser(id: string, username?: string, email?: string): Observable<{ message: string; user: User }> {
    const headers = this.getAuthHeaders();
    console.log('📤 updateUser - headers:', headers);
    console.log('📤 updateUser - Making PUT request to:', `${this.apiUrl}/${id}`);
    return this.http
      .put<{ message: string; user: User }>(`${this.apiUrl}/${id}`, { username, email }, { headers })
      .pipe(catchError(this.handleError));
  }

  // Deactivate user
  deactivateUser(id: string): Observable<{ message: string; user: User }> {
    const headers = this.getAuthHeaders();
    console.log('📤 deactivateUser - Making PATCH request to:', `${this.apiUrl}/${id}/deactivate`);
    return this.http
      .patch<{ message: string; user: User }>(`${this.apiUrl}/${id}/deactivate`, {}, { headers })
      .pipe(catchError(this.handleError));
  }

  // Activate user
  activateUser(id: string): Observable<{ message: string; user: User }> {
    const headers = this.getAuthHeaders();
    console.log('📤 activateUser - Making PATCH request to:', `${this.apiUrl}/${id}/activate`);
    return this.http
      .patch<{ message: string; user: User }>(`${this.apiUrl}/${id}/activate`, {}, { headers })
      .pipe(catchError(this.handleError));
  }

  // Delete user (soft delete)
  deleteUser(id: string): Observable<{ message: string; user: User }> {
    const headers = this.getAuthHeaders();
    console.log('📤 deleteUser - Making DELETE request to:', `${this.apiUrl}/${id}`);
    return this.http
      .delete<{ message: string; user: User }>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Assign role to user
  assignRoleToUser(id: string, roleId: string): Observable<{ message: string; user: User }> {
    const headers = this.getAuthHeaders();
    console.log('📤 assignRoleToUser - Making PATCH request to:', `${this.apiUrl}/${id}/assign-role`);
    console.log('📤 assignRoleToUser - roleId:', roleId);
    return this.http
      .patch<{ message: string; user: User }>(`${this.apiUrl}/${id}/assign-role`, { roleId }, { headers })
      .pipe(catchError(this.handleError));
  }

  // Change user password
  changePassword(id: string, oldPassword: string, newPassword: string): Observable<{ message: string }> {
    const headers = this.getAuthHeaders();
    console.log('📤 changePassword - Making POST request to:', `${this.apiUrl}/${id}/change-password`);
    return this.http
      .post<{ message: string }>(
        `${this.apiUrl}/${id}/change-password`,
        { oldPassword, newPassword },
        { headers }
      )
      .pipe(catchError(this.handleError));
  }
}