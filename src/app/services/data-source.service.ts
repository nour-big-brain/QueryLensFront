import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ConnectionCredentials {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export interface DataSource {
  _id?: string;
  name: string;
  type: 'sql' | 'nosql' | 'api';
  connectionCredentials: ConnectionCredentials;
  metabaseDbId?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Table {
  id: number;
  name: string;
  displayName: string;
  description?: string;
}

export interface TablesResponse {
  dataSourceId: string;
  dataSourceName: string;
  tables: Table[];
}

export interface FieldsResponse {
  tableId: number;
  tableName: string;
  fields: Array<{
    id: number;
    name: string;
    displayName: string;
    type: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class DataSourceService {
  private apiUrl = 'http://localhost:5000/dataSources';

  constructor(private http: HttpClient) {}

  createDataSource(dataSource: DataSource): Observable<DataSource> {
    return this.http.post<DataSource>(this.apiUrl, dataSource);
  }

  syncDataSourceToMetabase(id: string, credentials: ConnectionCredentials): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sync/${id}`, {
      host: credentials.host,
      port: credentials.port,
      database: credentials.database,
      username: credentials.username,
      password: credentials.password
    });
  }

  getDataSourceById(id: string): Observable<DataSource> {
    return this.http.get<DataSource>(`${this.apiUrl}/${id}`);
  }
   // Get all data sources
  getAllDataSources(): Observable<DataSource[]> {
    return this.http.get<DataSource[]>(`${this.apiUrl}/datasources`);
  }

  // Get tables for a specific data source
  getDataSourceTables(datasourceId: string): Observable<TablesResponse> {
    return this.http.get<TablesResponse>(`${this.apiUrl}/datasources/${datasourceId}/tables`);
  }

  // Get fields for a specific table
  getTableFields(datasourceId: string, tableId: string): Observable<FieldsResponse> {
    return this.http.get<FieldsResponse>(
      `${this.apiUrl}/datasources/${datasourceId}/tables/${tableId}/fields`
    );
  }

}