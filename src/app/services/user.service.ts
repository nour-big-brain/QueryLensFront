import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl = 'http://localhost:5000/users';

  constructor(private http: HttpClient) { }

  // Error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    const errorMessage = error.error?.error || error.error?.message || 'Server error';
    return throwError(() => new Error(errorMessage));
  }

  // Get all users
  getAllUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // Get user by ID
  getUserById(id: string): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Update user
  updateUser(id: string, username?: string, email?: string): Observable<{ message: string; user: User }> {
    return this.http
      .put<{ message: string; user: User }>(`${this.apiUrl}/${id}`, { username, email })
      .pipe(catchError(this.handleError));
  }

  // Deactivate user
  deactivateUser(id: string): Observable<{ message: string; user: User }> {
    return this.http
      .patch<{ message: string; user: User }>(`${this.apiUrl}/${id}/deactivate`, {})
      .pipe(catchError(this.handleError));
  }

  // Activate user
  activateUser(id: string): Observable<{ message: string; user: User }> {
    return this.http
      .patch<{ message: string; user: User }>(`${this.apiUrl}/${id}/activate`, {})
      .pipe(catchError(this.handleError));
  }

  // Delete user (soft delete)
  deleteUser(id: string): Observable<{ message: string; user: User }> {
    return this.http
      .delete<{ message: string; user: User }>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Assign role to user
  assignRoleToUser(id: string, roleId: string): Observable<{ message: string; user: User }> {
    return this.http
      .patch<{ message: string; user: User }>(`${this.apiUrl}/${id}/assign-role`, { roleId })
      .pipe(catchError(this.handleError));
  }
}