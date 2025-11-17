import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { QueryService, BuildQueryRequest } from '../../services/query.service';
import {
  DataSource,
  DataSourceService,
} from '../../services/data-source.service';
import { DashboardService } from '../../services/dashboard.service';
import { Dashboard } from '../../models/dashboard';

interface Table {
  id: number;
  name: string;
  displayName: string;
  description?: string;
}



@Component({
  selector: 'app-build-query',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './build-query.component.html',
  styleUrl: './build-query.component.css',
})
export class BuildQueryComponent implements OnInit {
  buildQueryForm: FormGroup;
  isCreated = false;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  createdQuery: any = null;

  dataSources: DataSource[] = [];
  tables: Table[] = [];
  loadingDataSources = false;
  loadingTables = false;
  showJsonPreview = false;

  // Dashboard modal state
  showDashboardModal = false;
  dashboards: Dashboard[] = [];
  loadingDashboards = false;
  selectedDashboardId: string | null = null;
  assigningToDashboard = false;
  dashboardError: string | null = null;
  // Add this line with your other properties
retryingQueryId: string | null = null;
  private syncStatus = new Map<string, 'idle' | 'syncing' | 'synced'>();

  constructor(
    private fb: FormBuilder,
    private queryService: QueryService,
    private datasourceService: DataSourceService,
    private dashboardService: DashboardService
  ) {
    this.buildQueryForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      dataSource: ['', Validators.required],
      type: ['builder', Validators.required],
      chartType: ['bar', Validators.required],  // ✅ NEW
      tableId: ['', Validators.required],
      aggregation: ['none'],
      userId: ['', Validators.required],
    });
  }


  ngOnInit(): void {
    this.fetchDataSources();
  }

  fetchDataSources(): void {
    this.loadingDataSources = true;
    this.datasourceService.getAllDataSources().subscribe({
      next: (dataSources) => {
        this.dataSources = dataSources;
        this.loadingDataSources = false;
      },
      error: (err) => {
        console.error('Error fetching data sources:', err);
        this.error = 'Failed to load data sources';
        this.loadingDataSources = false;
      },
    });
  }

  syncDataSource(datasourceId: string): void {
    const datasource = this.dataSources.find((ds) => ds._id === datasourceId);
    if (!datasource) return;

    this.syncStatus.set(datasourceId, 'syncing');
    this.error = null;

    this.datasourceService
      .syncDataSourceToMetabase(datasourceId, datasource.connectionCredentials)
      .subscribe({
        next: (response) => {
          this.success = `Data source synced successfully! Found ${response.tablesCount} tables.`;
          this.syncStatus.set(datasourceId, 'synced');

          this.onDataSourceChange(datasourceId);

          setTimeout(() => this.syncStatus.set(datasourceId, 'idle'), 2000);
          setTimeout(() => (this.success = null), 3000);
        },
        error: (err) => {
          this.error =
            err.error?.error || 'Failed to sync data source to Metabase';
          this.syncStatus.set(datasourceId, 'idle');
        },
      });
  }

  getSyncStatus(id: string): 'idle' | 'syncing' | 'synced' {
    return this.syncStatus.get(id) ?? 'idle';
  }

  onDataSourceChange(datasourceId: string): void {
    this.buildQueryForm.patchValue({ tableId: '' });
    this.tables = [];

    if (!datasourceId) return;

    this.loadingTables = true;
    this.datasourceService.getDataSourceTables(datasourceId).subscribe({
      next: (response) => {
        this.tables = response.tables || [];
        this.loadingTables = false;
      },
      error: (err) => {
        console.error('Error fetching tables:', err);
        this.error =
          err.error?.error ||
          'Failed to load tables. Make sure data source is synced to Metabase.';
        this.loadingTables = false;
        this.tables = [];
      },
    });
  }

  generateQueryDefinition(): any {
    const tableId = this.buildQueryForm.get('tableId')?.value;
    if (!tableId) return null;

    const query: any = {
      'source-table': Number(tableId),
    };

    const aggregation = this.buildQueryForm.get('aggregation')?.value;
    if (aggregation && aggregation !== 'none') {
      query.aggregation = [['count']];
    }

    return query;
  }

   createQuery(): void {
    if (this.buildQueryForm.invalid) {
      this.buildQueryForm.markAllAsTouched();
      this.error = 'Please fill in all required fields correctly';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    const formValue = this.buildQueryForm.value;

    const buildQueryRequest: BuildQueryRequest = {
      title: formValue.title,
      description: formValue.description,
      dataSource: formValue.dataSource,
      type: formValue.type,
      chartType: formValue.chartType,  // ✅ NEW - Pass chart type
      queryDefinition: this.generateQueryDefinition(),
      userId: formValue.userId,
    };

    this.queryService.buildQuery(buildQueryRequest).subscribe({
      next: (response) => {
        this.createdQuery = response;
        this.isCreated = true;
        this.success = `Query "${response.title}" created successfully!`;
        this.loading = false;

        // Open dashboard modal after successful creation
        setTimeout(() => {
          this.openDashboardModal();
        }, 500);
      },
      error: (error) => {
        this.error =
          error.error?.error || error.error?.details || 'Failed to create query';
        this.loading = false;
        console.error('Error creating query:', error);
      },
    });
  }

  openDashboardModal(): void {
    this.showDashboardModal = true;
    this.selectedDashboardId = null;
    this.dashboardError = null;
    this.loadingDashboards = true;

    // Use hardcoded user ID for testing
    const userId = '6910cda02f1185a181e3e542';
    
    console.log('Opening dashboard modal with userId:', userId);

    // Use getDashboards instead - it returns all dashboards for a user (owned, shared, public)
    this.dashboardService.getDashboards(userId).subscribe({
      next: (dashboards) => {
        console.log('Fetched dashboards:', dashboards);
        this.dashboards = dashboards || [];
        this.loadingDashboards = false;
        if (this.dashboards.length === 0) {
          console.warn('No dashboards found for user:', userId);
        }
      },
      error: (err) => {
        console.error('Error fetching dashboards:', err);
        this.dashboardError = 'Failed to load dashboards: ' + (err.error?.error || err.message);
        this.loadingDashboards = false;
      },
    });
  }

  closeDashboardModal(): void {
    this.showDashboardModal = false;
    this.selectedDashboardId = null;
    this.dashboardError = null;
    this.resetForm();
  }

  assignQueryToDashboard(): void {
    if (!this.selectedDashboardId || !this.createdQuery) {
      this.dashboardError = 'Please select a dashboard';
      return;
    }

    this.assigningToDashboard = true;
    this.dashboardError = null;

    console.log('Assigning query to dashboard:', {
      queryId: this.createdQuery._id,
      dashboardId: this.selectedDashboardId
    });

    // Use QueryService's assignQueryToDashboard method
    this.queryService
      .assignQueryToDashboard(this.createdQuery._id, this.selectedDashboardId)
      .subscribe({
        next: (response) => {
          console.log('Query assigned successfully:', response);
          this.success = `Query added to dashboard "${this.getDashboardName(
            this.selectedDashboardId!
          )}" successfully!`;
          this.assigningToDashboard = false;

          setTimeout(() => {
            this.closeDashboardModal();
          }, 2000);
        },
        error: (err) => {
          console.error('Error assigning query to dashboard:', err);
          this.dashboardError =
            err.error?.error || 'Failed to add query to dashboard';
          this.assigningToDashboard = false;
        },
      });
  }

  getDashboardName(dashboardId: string): string {
    return (
      this.dashboards.find((d) => d._id === dashboardId)?.name || 'Dashboard'
    );
  }

  skipDashboardAssignment(): void {
    this.closeDashboardModal();
  }

  resetForm(): void {
    this.buildQueryForm.reset({
      type: 'builder',
      aggregation: 'none',
    });
    this.isCreated = false;
    this.error = null;
    this.success = null;
    this.createdQuery = null;
    this.tables = [];
    this.showJsonPreview = false;
  }

  onReset(): void {
    this.resetForm();
  }

  toggleJsonPreview(): void {
    this.showJsonPreview = !this.showJsonPreview;
  }

  getQueryDefinitionDisplay(): string {
    const queryDef = this.generateQueryDefinition();
    return queryDef ? JSON.stringify(queryDef, null, 2) : '';
  }

  get selectedDataSourceId(): string | null {
    return this.buildQueryForm.get('dataSource')?.value || null;
  }
  retryMetabaseSync(queryId: string): void {
  // Prevent double-clicks
  if (this.retryingQueryId === queryId) return;

  this.retryingQueryId = queryId;
  this.error = null;
  this.success = null;

  this.queryService.retryQuerySync(queryId).subscribe({
    next: (response) => {
      console.log('Query sync retried successfully:', response);
      this.success = `Sync retried successfully! Query will appear in Metabase shortly.`;

      // Update the createdQuery if it's the same one
      if (this.createdQuery?._id === queryId) {
        this.createdQuery.metabaseCardId = response.metabaseCardId;
      }

      this.retryingQueryId = null;

      setTimeout(() => this.success = null, 5000);
    },
    error: (err) => {
      console.error('Failed to retry sync:', err);
      this.error = err.error?.error || 'Failed to retry sync. Please try again later.';
      this.retryingQueryId = null;
    }
  });
}
   
}