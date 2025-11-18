import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Dashboard } from '../models/dashboard';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:5000/dashboards';

  constructor(private http: HttpClient) {}

  // ============================================
  // ERROR HANDLING
  // ============================================
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    const errorMessage = error.error?.error || 'Server error';
    return throwError(() => new Error(errorMessage));
  }

  // ============================================
  // DASHBOARD OPERATIONS
  // ============================================

  /**
   * Create a new dashboard
   */
  createDashboard(name: string, description: string = '', userId: string): Observable<Dashboard> {
    return this.http
      .post<Dashboard>(`${this.apiUrl}/create`, { name, description, userId })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get all dashboards for a user (owned, shared, public)
   */
  getDashboards(userId: string): Observable<Dashboard[]> {
    return this.http
      .post<Dashboard[]>(`${this.apiUrl}`, { userId })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get dashboards by user (owned dashboards)
   */
  getDashboardsByUser(userId: string): Observable<Dashboard[]> {
    return this.http
      .post<Dashboard[]>(`${this.apiUrl}/user/${userId}`, { userId })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get shared dashboards (dashboards shared with user)
   */
  getSharedDashboards(userId: string): Observable<Dashboard[]> {
    return this.http
      .post<Dashboard[]>(`${this.apiUrl}/shared`, { userId })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get dashboard by ID (with access check)
   */
  getDashboardById(id: string, userId: string): Observable<Dashboard> {
    return this.http
      .post<Dashboard>(`${this.apiUrl}/${id}`, { userId })
      .pipe(catchError(this.handleError));
  }

  /**
   * Update dashboard (name and/or description)
   */
  updateDashboard(id: string, userId: string, name?: string, description?: string): Observable<Dashboard> {
    return this.http
      .put<Dashboard>(`${this.apiUrl}/${id}`, { userId, name, description })
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete dashboard (owner only)
   */
  deleteDashboard(id: string, userId: string): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${this.apiUrl}/${id}`, { body: { userId } })
      .pipe(catchError(this.handleError));
  }

  // ============================================
  // CARD OPERATIONS
  // ============================================

  /**
   * Add card to dashboard
   */
  addCardToDashboard(dashboardId: string, cardId: string, userId: string): Observable<{ message: string; dashboard: Dashboard }> {
    return this.http
      .post<{ message: string; dashboard: Dashboard }>(
        `${this.apiUrl}/add-card`,
        { dashboardId, cardId, userId }
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Remove card from dashboard
   */
  removeCardFromDashboard(dashboardId: string, cardId: string, userId: string): Observable<{ message: string; dashboard: Dashboard }> {
    return this.http
      .post<{ message: string; dashboard: Dashboard }>(
        `${this.apiUrl}/remove-card`,
        { dashboardId, cardId, userId }
      )
      .pipe(catchError(this.handleError));
  }

  // ============================================
  // SHARING OPERATIONS
  // ============================================

  /**
   * Share dashboard with another user by username
   * The backend will look up the user ID
   */
  shareDashboardByUsername(
    dashboardId: string,
    targetUsername: string,
    permission: 'view' | 'edit' | 'admin',
    userId: string
  ): Observable<{ message: string; dashboard: Dashboard }> {
    return this.http
      .post<{ message: string; dashboard: Dashboard }>(
        `${this.apiUrl}/${dashboardId}/share`,
        { targetUsername, permission, userId }
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Share dashboard with another user by user ID
   */
  shareDashboard(
    id: string,
    targetUserId: string,
    targetUsername: string,
    permission: 'view' | 'edit' | 'admin',
    userId: string
  ): Observable<{ message: string; dashboard: Dashboard }> {
    return this.http
      .post<{ message: string; dashboard: Dashboard }>(
        `${this.apiUrl}/${id}/share`,
        { targetUserId, targetUsername, permission, userId }
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Remove share access from a user
   */
  removeShareAccess(id: string, targetUserId: string, userId: string): Observable<{ message: string; dashboard: Dashboard }> {
    return this.http
      .delete<{ message: string; dashboard: Dashboard }>(
        `${this.apiUrl}/${id}/share/${targetUserId}`,
        { body: { userId } }
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Toggle dashboard public/private
   */
  toggleDashboardPublic(id: string, isPublic: boolean, userId: string): Observable<{ message: string; dashboard: Dashboard }> {
    return this.http
      .put<{ message: string; dashboard: Dashboard }>(
        `${this.apiUrl}/${id}/public`,
        { isPublic, userId }
      )
      .pipe(catchError(this.handleError));
  }

  // ============================================
  // COMMENT OPERATIONS
  // ============================================

  /**
   * Add comment to dashboard
   */
  addComment(dashboardId: string, text: string, userId: string): Observable<{ message: string; comment: Comment }> {
    return this.http
      .post<{ message: string; comment: Comment }>(
        `${this.apiUrl}/${dashboardId}/comments`,
        { text, userId }
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Get all comments for a dashboard
   */
  getComments(dashboardId: string, userId: string): Observable<Comment[]> {
    return this.http
      .post<Comment[]>(
        `${this.apiUrl}/${dashboardId}/comments/list`,
        { userId }
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete a comment (author or owner only)
   */
  deleteComment(dashboardId: string, commentId: string, userId: string): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(
        `${this.apiUrl}/${dashboardId}/comments/${commentId}`,
        { body: { userId } }
      )
      .pipe(catchError(this.handleError));
  }
}