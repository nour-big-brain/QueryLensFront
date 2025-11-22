import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuditLog {
  _id: string;
  logId: string;
  action: string;
  targetUserId?: { _id: string; username: string; email: string };
  targetRoleId?: { _id: string; name: string };
  performedBy: { _id: string; username: string; email: string };
  details: any;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private apiUrl = 'http://localhost:5000/api/audit-logs';

  constructor(private http: HttpClient) {}

  // Get all audit logs
  getAllAuditLogs(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.apiUrl}/`);
  }

  // Get single audit log by ID
  getAuditLogById(id: string): Observable<AuditLog> {
    return this.http.get<AuditLog>(`${this.apiUrl}/${id}`);
  }

  // Get audit logs for specific user (target)
  getAuditLogsByUser(userId: string): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Get audit logs by action type
  getAuditLogsByAction(action: string): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.apiUrl}/action/${action}`);
  }

  // Get audit logs performed by specific admin
  getAuditLogsByAdmin(adminId: string): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.apiUrl}/admin/${adminId}`);
  }
}