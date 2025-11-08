import { Component, inject } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { Dashboard } from '../../models/dashboard';
import { DashboardService } from '../../services/dashboard.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-create-dashboard',
  standalone: true,
  imports: [FormsModule,TranslateModule],
  templateUrl: './create-dashboard.component.html',
  styleUrl: './create-dashboard.component.css'
})
export class CreateDashboardComponent {
  dashboard = {
    name: '',
    description: ''
  };
  dashboards: Dashboard[] = [];
    newDashboardName: string = '';
    newDashboardDescription: string = '';
    updateDashboardId: string | null = null;
    updateDashboardName: string = '';
    updateDashboardDescription: string = '';
    errorMessage: string | null = null;
    successMessage: string | null = null;
  
    constructor(private dashboardService: DashboardService, private router: Router) {}

  isCreated = false;

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
        alert('Dashboard created successfully');
        this.redirectToList();
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to create dashboard';
      }
    });
  }

  onReset() {
    this.dashboard = { name: '', description: '' };
  }

  redirectToList() {
    this.router.navigate(['/listDashboard']);
  }
}
