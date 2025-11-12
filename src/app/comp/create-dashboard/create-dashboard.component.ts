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
// Get userId from sessionStorage (like we did in dashboard component)
private getCurrentUserId(): string {
// Return the real MongoDB ObjectId instead of temporary ID
  return "6910cda02f1185a181e3e542";}
 createDashboard(): void {
    const userId = this.getCurrentUserId();
    console.log('Creating dashboard with userId:', userId); // Log the userId
    
    if (!this.newDashboardName.trim()) {
      this.errorMessage = 'Dashboard name is required';
      return;
    }

    this.dashboardService.createDashboard(
      this.newDashboardName, 
      this.newDashboardDescription,
      userId
    ).subscribe({
      next: (dashboard) => {
        console.log('Dashboard created:', dashboard);
        this.successMessage = 'Dashboard created successfully';
        this.router.navigate(['/listDashboard']);
        // ... rest of code
      },
      error: (error) => {
        console.log('Full error:', error); // Log full error
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
