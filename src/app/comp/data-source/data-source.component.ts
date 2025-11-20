import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataSource, DataSourceService } from '../../services/data-source.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-data-source',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './data-source.component.html',
  styleUrls: ['./data-source.component.css']
})
export class DataSourceComponent implements OnInit {
  form: FormGroup;
  dataSource: DataSource | null = null;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  syncStatus: string | null = null;
  metabaseInfo: any = null;

  constructor(
    private fb: FormBuilder,
    private dataSourceService: DataSourceService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['sql'],
      host: ['localhost'],
      port: [3306, [Validators.required, Validators.min(1), Validators.max(65535)]],
      database: ['', Validators.required],
      username: [''],
      password: [''] // Password is now 100% optional
    });
  }

  ngOnInit(): void {}

  // Helper: check if critical fields are missing
  get isMissingCriticalFields(): boolean {
    const controls = this.form.controls;
    return !controls['name'].value?.trim() ||
           !controls['database'].value?.trim();
  }

  createDataSource(): void {
    // Only block if name or database is empty (most critical)
    if (!this.form.get('name')?.value?.trim()) {
      this.error = 'Data Source Name is required';
      return;
    }
    if (!this.form.get('database')?.value?.trim()) {
      this.error = 'Database Name is required';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    const fv = this.form.value;

    const newDataSource: DataSource = {
      name: fv.name.trim(),
      type: fv.type || 'sql',
      connectionCredentials: {
        host: fv.host?.trim() || 'localhost',
        port: fv.port || 3306,
        database: fv.database.trim(),
        username: fv.username?.trim() || '',
        password: fv.password?.trim() || null // empty string if no password
      }
    };

    this.dataSourceService.createDataSource(newDataSource).subscribe({
      next: (response) => {
        this.dataSource = response;
        this.success = `Data source "${response.name}" created successfully!`;
        this.loading = false;

        // Reset form but keep good defaults
        this.form.reset({
          type: 'sql',
          host: 'localhost',
          port: 3306,
          username: '',
          password: ''
        });
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to create data source';
        this.loading = false;
      }
    });
  }

 syncToMetabase(): void {
  if (!this.dataSource?._id) {
    this.error = 'No data source selected';
    return;
  }

  if (!this.dataSource?.connectionCredentials) {
    this.error = 'No connection credentials available';
    return;
  }

  this.loading = true;
  this.syncStatus = 'Syncing to Metabase...';
  this.error = null;

  // ✅ Pass the credentials from the dataSource
  this.dataSourceService.syncDataSourceToMetabase(
    this.dataSource._id,
    this.dataSource.connectionCredentials
  ).subscribe({
    next: (response) => {
      this.metabaseInfo = response.metabaseDb;
      this.dataSource = response.dataSource;
      this.success = 'Successfully synced to Metabase!';
      this.syncStatus = `Metabase Database ID: ${response.metabaseDb.id}`;
      this.loading = false;
    },
    error: (err) => {
      this.error = err.error?.error || 'Failed to sync to Metabase';
      this.syncStatus = null;
      this.loading = false;
    }
  });
}

  getDataSourceDetails(): void {
    if (!this.dataSource?._id) {
      this.error = 'No data source selected';
      return;
    }

    this.loading = true;
    this.error = null;

    this.dataSourceService.getDataSourceById(this.dataSource._id).subscribe({
      next: (response) => {
        this.dataSource = response;
        this.success = 'Data source details refreshed';
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to retrieve data source';
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    this.form.reset({
      type: 'sql',
      host: 'localhost',
      port: 3306,
      database: '',
      username: '',
      password: ''
    });
    this.dataSource = null;
    this.error = null;
    this.success = null;
    this.syncStatus = null;
    this.metabaseInfo = null;
  }
}