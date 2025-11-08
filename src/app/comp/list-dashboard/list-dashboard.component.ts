import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Dashboard } from '../../models/dashboard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './list-dashboard.component.html',
  styleUrl: './list-dashboard.component.css'
})
export class ListDashboardComponent implements OnInit {
dashboards: Dashboard[] = [];
  newDashboardName: string = '';
  newDashboardDescription: string = '';
  updateDashboardId: string | null = null;
  updateDashboardName: string = '';
  updateDashboardDescription: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private dashboardService: DashboardService, private router: Router) {}

  ngOnInit(): void {
    this.loadDashboards();
  }

  // Load all dashboards
  loadDashboards(): void {
    this.dashboardService.getDashboards().subscribe({
      next: (dashboards) => {
        this.dashboards = dashboards;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load dashboards';
      }
    });
  }

  // Create a new dashboard
  createDashboard(): void {
    if (!this.newDashboardName.trim()) {
      this.errorMessage = 'Dashboard name is required';
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;

    this.dashboardService.createDashboard(this.newDashboardName, this.newDashboardDescription).subscribe({
      next: (dashboard) => {
        this.dashboards.push(dashboard);
        this.successMessage = 'Dashboard created successfully';
        this.newDashboardName = '';
        this.newDashboardDescription = '';
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to create dashboard';
      }
    });
  }

  // Delete a dashboard
  deleteDashboard(id: string): void {
    if (!confirm('Are you sure you want to delete this dashboard?')) {
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;

    this.dashboardService.deleteDashboard(id).subscribe({
      next: (response) => {
        this.dashboards = this.dashboards.filter(d => d._id !== id);
        this.successMessage = response.message;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to delete dashboard';
      }
    });
  }

  // Prepare to update a dashboard (populate form)
  startUpdateDashboard(dashboard: Dashboard): void {
    this.updateDashboardId = dashboard._id!;
    this.updateDashboardName = dashboard.name;
    this.updateDashboardDescription = dashboard.description || '';
  }

  // Update a dashboard
  updateDashboard(): void {
    if (!this.updateDashboardId || !this.updateDashboardName.trim()) {
      this.errorMessage = 'Dashboard ID and name are required';
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;

    this.dashboardService
      .updateDashboard(this.updateDashboardId, this.updateDashboardName, this.updateDashboardDescription)
      .subscribe({
        next: (dashboard) => {
          const index = this.dashboards.findIndex(d => d._id === this.updateDashboardId);
          if (index !== -1) {
            this.dashboards[index] = dashboard;
          }
          this.successMessage = 'Dashboard updated successfully';
          this.cancelUpdate();
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to update dashboard';
        }
      });
  }// Cancel update
  cancelUpdate(): void {
    this.updateDashboardId = null;
    this.updateDashboardName = '';
    this.updateDashboardDescription = '';
  }

  // Navigate to dashboard item view
  viewDashboard(id: string|undefined): void {
    this.dashboardService.getDashboardById(id).subscribe({
      next: (dashboard) => {
        this.router.navigate(['/dashboard', id]);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load dashboard';
      }
    });
  }
}
