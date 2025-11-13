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
  syncingDataSource = false;
  syncingDataSourceId: string | null = null;
  showJsonPreview = false;

  constructor(
    private fb: FormBuilder,
    private queryService: QueryService,
    private datasourceService: DataSourceService
  ) {
    this.buildQueryForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      dataSource: ['', Validators.required],
      type: ['builder', Validators.required],
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

  // ---- inside BuildQueryComponent class ----
private syncStatus = new Map<string, 'idle' | 'syncing' | 'synced'>();

syncDataSource(datasourceId: string): void {
  const datasource = this.dataSources.find(ds => ds._id === datasourceId);
  if (!datasource) return;

  this.syncStatus.set(datasourceId, 'syncing');   // <-- show spinner
  this.syncingDataSourceId = datasourceId;
  this.error = null;

  this.datasourceService
    .syncDataSourceToMetabase(datasourceId, datasource.connectionCredentials)
    .subscribe({
      next: (response) => {
        this.success = `Data source synced successfully! Found ${response.tablesCount} tables.`;
        this.syncStatus.set(datasourceId, 'synced'); // <-- show checkmark
        this.syncingDataSourceId = null;

        // refresh tables
        this.onDataSourceChange(datasourceId);

        // clear the checkmark after 2 s
        setTimeout(() => this.syncStatus.set(datasourceId, 'idle'), 2000);
        setTimeout(() => (this.success = null), 3000);
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to sync data source to Metabase';
        this.syncStatus.set(datasourceId, 'idle');
        this.syncingDataSourceId = null;
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
      query.aggregation = [['count']]; // Can be extended later
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
      queryDefinition: this.generateQueryDefinition(),
      userId: formValue.userId,
    };

    this.queryService.buildQuery(buildQueryRequest).subscribe({
      next: (response) => {
        this.createdQuery = response;
        this.isCreated = true;
        this.success = `Query "${response.title}" created successfully!`;
        this.loading = false;

        setTimeout(() => {
          this.resetForm();
        }, 3000);
      },
      error: (error) => {
        this.error =
          error.error?.error || error.error?.details || 'Failed to create query';
        this.loading = false;
        console.error('Error creating query:', error);
      },
    });
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

  // Helper to get selected data source safely
  getSelectedDataSource(): DataSource | undefined {
    const id = this.buildQueryForm.get('dataSource')?.value;
    return this.dataSources.find((ds) => ds._id === id);
  }

  // Reactive getter for template
  get selectedDataSourceId(): string | null {
    return this.buildQueryForm.get('dataSource')?.value || null;
  }
}