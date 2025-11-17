import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin } from 'rxjs';
import { throwError, of } from 'rxjs';
import { ChartPayload } from '../models/chartPayload';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  private apiUrl = 'http://localhost:5000/charts';

  constructor(private http: HttpClient) {}

  /**
   * Get chart data for a specific query
   * Fetches data from Metabase and transforms it to a standardized chart format
   * @param queryId - The ID of the saved query
   * @param chartType - Optional chart type (bar, line, pie, etc.)
   * @returns Observable<ChartPayload>
   */
  getChartData(queryId: string, chartType: string = 'bar'): Observable<ChartPayload> {
    const url = `${this.apiUrl}/${queryId}?chartType=${chartType}`;
    
    return this.http.get<ChartPayload>(url).pipe(
      catchError((error) => {
        console.error('Error fetching chart data:', error);
        return throwError(() => new Error(error.error?.error || 'Failed to fetch chart data'));
      })
    );
  }

  /**
   * Get raw query results without transformation
   * Useful for debugging or custom data processing
   * @param queryId - The ID of the saved query
   * @returns Observable<any>
   */
  getRawQueryData(queryId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${queryId}/raw`).pipe(
      catchError((error) => {
        console.error('Error fetching raw query data:', error);
        return throwError(() => new Error(error.error?.error || 'Failed to fetch raw data'));
      })
    );
  }

  /**
   * Get database metadata to understand available tables and fields
   * Useful for building queries
   * @param dataSourceId - The ID of the data source
   * @returns Observable<any>
   */
  getDatabaseMetadata(dataSourceId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/metadata/${dataSourceId}`).pipe(
      catchError((error) => {
        console.error('Error fetching database metadata:', error);
        return throwError(() => new Error(error.error?.error || 'Failed to fetch metadata'));
      })
    );
  }

  /**
   * Fetch multiple charts in parallel
   * Used when a dashboard has multiple queries/cards
   * @param queryIds - Array of query IDs
   * @param chartType - Chart type for all queries (default: 'bar')
   * @returns Observable<ChartPayload[]>
   */
  getMultipleCharts(queryIds: string[], chartType: string = 'bar'): Observable<ChartPayload[]> {
    if (queryIds.length === 0) {
      return of([]);
    }

    const requests = queryIds.map(id => 
      this.getChartData(id, chartType).pipe(
        catchError(err => {
          console.error(`Failed to load chart for query ${id}:`, err);
          // Return error chart instead of failing the whole request
          return of({
            title: 'Error Loading Chart',
            description: `Failed to load chart for query ${id}`,
            type: chartType,
            categories: [],
            series: []
          } as ChartPayload);
        })
      )
    );

    return forkJoin(requests);
  }
}