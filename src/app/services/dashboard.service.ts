import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Dashboard } from '../models/dashboard';



@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly apiUrl = 'http://localhost:5000/dashboards'; // Adjust as needed

  constructor(private http: HttpClient) {}

  // Error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    const errorMessage = error.error?.error || 'Server error';
    return throwError(() => new Error(errorMessage));
  }

  // Create a new dashboard
  createDashboard(name: string, description?: string): Observable<Dashboard> {
    return this.http
      .post<Dashboard>(`${this.apiUrl}/create`, { name, description })
      .pipe(catchError(this.handleError));
  }

  // Get all dashboards
  getDashboards(): Observable<Dashboard[]> {
    return this.http
      .get<Dashboard[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // Get dashboard by ID
  getDashboardById(id: string | undefined ): Observable<Dashboard> {
    return this.http
      .get<Dashboard>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Update dashboard
  updateDashboard(id: string, name?: string, description?: string): Observable<Dashboard> {
    return this.http
      .put<Dashboard>(`${this.apiUrl}/update/${id}`, { name, description })
      .pipe(catchError(this.handleError));
  }

  // Delete dashboard
  deleteDashboard(id: string): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${this.apiUrl}/delete/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Add card to dashboard
  addCardToDashboard(dashboardId: string, cardId: string): Observable<{ message: string; dashboard: Dashboard; metabaseData?: any }> {
    return this.http
      .post<{ message: string; dashboard: Dashboard; metabaseData?: any }>(
        `${this.apiUrl}/add-card`,
        { dashboardId, cardId }
      )
      .pipe(catchError(this.handleError));
  }

  // Remove card from dashboard
  removeCardFromDashboard(dashboardId: string, cardId: string): Observable<{ message: string; dashboard: Dashboard }> {
    return this.http
      .post<{ message: string; dashboard: Dashboard }>(
        `${this.apiUrl}/remove-card`,
        { dashboardId, cardId }
      )
      .pipe(catchError(this.handleError));
  }

  // Share dashboard
  shareDashboard(id: string, targetUserId: string, targetUsername: string, permission: 'view' | 'edit' | 'admin'): Observable<{ message: string; dashboard: Dashboard }> {
    return this.http
      .post<{ message: string; dashboard: Dashboard }>(
        `${this.apiUrl}/${id}/share`,
        { targetUserId, targetUsername, permission }
      )
      .pipe(catchError(this.handleError));
  }

  // Toggle dashboard public/private
  toggleDashboardPublic(id: string, isPublic: boolean): Observable<{ message: string; dashboard: Dashboard }> {
    return this.http
      .put<{ message: string; dashboard: Dashboard }>(`${this.apiUrl}/${id}/public`, { isPublic })
      .pipe(catchError(this.handleError));
  }

  // Remove share access
  removeShareAccess(id: string, targetUserId: string): Observable<{ message: string; dashboard: Dashboard }> {
    return this.http
      .delete<{ message: string; dashboard: Dashboard }>(`${this.apiUrl}/${id}/share/${targetUserId}`)
      .pipe(catchError(this.handleError));
  }


}
