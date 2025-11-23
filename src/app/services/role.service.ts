import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, throwError } from 'rxjs';

export interface Role {
  _id?: string;
  roleId: string;
  name: string;
  description: string;
  permissions: string[];
  createdBy?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = 'http://localhost:5000/roles';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  getRoleById(id: string): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  createRole(data: Partial<Role>): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateRole(id: string, data: Partial<Role>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteRole(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    let message = 'An error occurred';
    
    if (error.error?.error) {
      message = error.error.error;
    } else if (error.status === 401) {
      message = 'Unauthorized - Token may be invalid or expired';
    } else if (error.status === 403) {
      message = 'Forbidden - You do not have permission';
    } else if (error.status === 404) {
      message = 'Resource not found';
    } else if (error.status === 500) {
      message = 'Server error';
    }

    console.error('HTTP Error:', { status: error.status, message });
    return throwError(() => new Error(message));
  }
}