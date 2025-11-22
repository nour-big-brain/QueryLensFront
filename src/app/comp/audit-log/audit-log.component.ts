import { Component, OnInit } from '@angular/core';
import { AuditLog, AuditLogService } from '../../services/audit-log.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [NgClass,CommonModule,ReactiveFormsModule],
  templateUrl: './audit-log.component.html',
  styleUrl: './audit-log.component.css'
})
export class AuditLogsComponent implements OnInit {
  auditLogs: AuditLog[] = [];
  filteredLogs: AuditLog[] = [];
  loading = false;
  error: string | null = null;
  filterForm: FormGroup;

  actions = [
    'USER_DELETED',
    'USER_DEACTIVATED',
    'USER_ACTIVATED',
    'ROLE_CREATED',
    'ROLE_MODIFIED',
    'ROLE_DELETED',
    'USER_ROLE_ASSIGNED'
  ];

  constructor(
    private auditLogService: AuditLogService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      filterType: ['all'],
      filterValue: [''],
      action: ['']
    });
  }

  ngOnInit(): void {
    this.loadAllAuditLogs();
    this.setupFilterListener();
  }

  loadAllAuditLogs(): void {
    this.loading = true;
    this.error = null;

    this.auditLogService.getAllAuditLogs().subscribe({
      next: (logs) => {
        this.auditLogs = logs;
        this.filteredLogs = logs;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to load audit logs';
        this.loading = false;
        console.error('Error loading audit logs:', err);
      }
    });
  }

  setupFilterListener(): void {
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  applyFilters(): void {
    const { filterType, filterValue, action } = this.filterForm.value;

    if (filterType === 'all') {
      this.filteredLogs = this.auditLogs;
    } else if (filterType === 'user' && filterValue) {
      this.filteredLogs = this.auditLogs.filter(log =>
        log.targetUserId?.username.toLowerCase().includes(filterValue.toLowerCase()) ||
        log.targetUserId?.email.toLowerCase().includes(filterValue.toLowerCase())
      );
    } else if (filterType === 'admin' && filterValue) {
      this.filteredLogs = this.auditLogs.filter(log =>
        log.performedBy.username.toLowerCase().includes(filterValue.toLowerCase()) ||
        log.performedBy.email.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (action) {
      this.filteredLogs = this.filteredLogs.filter(log => log.action === action);
    }
  }

  getActionBadgeClass(action: string): string {
    if (action.includes('DELETED')) return 'badge-danger';
    if (action.includes('DEACTIVATED')) return 'badge-warning';
    if (action.includes('ACTIVATED')) return 'badge-success';
    if (action.includes('ROLE')) return 'badge-info';
    return 'badge-secondary';
  }

  getActionIcon(action: string): string {
    if (action.includes('DELETED')) return '🗑️';
    if (action.includes('DEACTIVATED')) return '🚫';
    if (action.includes('ACTIVATED')) return '✅';
    if (action.includes('ROLE')) return '👤';
    return '📋';
  }

  resetFilters(): void {
    this.filterForm.reset({
      filterType: 'all',
      filterValue: '',
      action: ''
    });
    this.filteredLogs = this.auditLogs;
  }

  exportLogs(): void {
    const dataStr = JSON.stringify(this.filteredLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-logs-${new Date().toISOString()}.json`;
    link.click();
  }
}