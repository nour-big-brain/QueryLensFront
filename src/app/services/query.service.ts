import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface QueryDefinition {
  [key: string]: any;
}

export interface Query {
  _id?: string;
  title: string;
  description?: string;
  dataSource: string; // ObjectId reference
  type: 'native' | 'builder' | 'ai';
  queryDefinition: QueryDefinition;
  createdBy: string; // Changed from userId to createdBy
  metabaseCardId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  dashboard?: string; // ObjectId reference
}

// In your query.service.ts

export interface BuildQueryRequest {
  title: string;
  description: string;
  dataSource: string;
  type: 'builder' | 'native' | 'ai';
  queryDefinition: any;
  userId: string;  // ✅ Changed from createdBy to userId
}


export interface AssignQueryRequest {
  queryId: string;
  dashboardId: string;
}

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  private apiUrl = 'http://localhost:5000/query';

  constructor(private http: HttpClient) {}

  buildQuery(request: BuildQueryRequest): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/queries`, request);
}


  assignQueryToDashboard(queryId: string, dashboardId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/assign`, {
      queryId,
      dashboardId
    });
  }

  getQueryById(id: string): Observable<Query> {
    return this.http.get<Query>(`${this.apiUrl}/${id}`);
  }
}