import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Dashboard } from '../../models/dashboard';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-dashboard.component.html',
  styleUrl: './list-dashboard.component.css'
})
export class ListDashboardComponent implements OnInit {
dashboards: Dashboard[] = [
    {
      _id: '1',
      name: 'Sales Overview',
      description: 'Monthly sales performance for the team',
      ownerId: 'user123',
      ownerName: 'Alice',
      cards: [
        {
          title: 'Monthly Sales',
          type: 'bar',
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          series: [
            { name: 'Product A', values: [12000, 15000, 18000, 13000, 20000] },
            { name: 'Product B', values: [10000, 12000, 14000, 9000, 16000] }
          ],
          description: 'Sales figures per month for two products'
        },
        {
          title: 'Website Traffic',
          type: 'line',
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          series: [
            { name: 'Visits', values: [300, 400, 350, 500, 450] },
            { name: 'Conversions', values: [20, 25, 18, 30, 22] }
          ],
          description: 'Daily website traffic and conversions'
        }
      ],
      sharedWith: [
        { userId: 'user456', username: 'Bob', permission: 'view', sharedAt: new Date() }
      ],
      isPublic: false,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-10'),
      comments: [
        { _id: 'c1', userId: 'user789', username: 'Charlie', text: 'Great dashboard!', createdAt: new Date('2025-01-05') }
      ],
      metabaseDashboardId: 101,
      metabaseData: {}
    },
    {
      _id: '2',
      name: 'Website Analytics',
      description: 'Daily traffic and conversion metrics',
      ownerId: 'user234',
      ownerName: 'David',
      cards: [
        {
          title: 'User Demographics',
          type: 'pie',
          labels: ['18-24', '25-34', '35-44', '45+'],
          series: [
            { name: 'Users', values: [25, 40, 20, 15] }
          ],
          description: 'Distribution of users by age'
        },
        {
          title: 'Revenue by Region',
          type: 'donut',
          labels: ['North', 'South', 'East', 'West'],
          series: [
            { name: 'Revenue', values: [120, 180, 250, 300] }
          ],
          description: 'Revenue contribution per region'
        }
      ],
      sharedWith: [],
      isPublic: true,
      createdAt: new Date('2025-02-01'),
      updatedAt: new Date('2025-02-05'),
      comments: [],
      metabaseDashboardId: 102,
      metabaseData: {}
    }
  ];

  isLoading = false; // Set to false since we're using hardcoded data
  error: string | null = null;

  constructor(private dashboardService: DashboardService, private router: Router) {}

  ngOnInit() {
    this.loadUserDashboards();
  }
  loadUserDashboards() {
    const currentUserId = '6910cda02f1185a181e3e542';
    this.isLoading = true;

    this.dashboardService.getDashboardsByUser(currentUserId).subscribe({
      next: (data) => {
        console.log('Received dashboards:', data);
        this.dashboards = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading dashboards:', err);
        this.error = 'Failed to load dashboards';
        this.isLoading = false;
      }
    });
  }

  openDashboard(dashboard: Dashboard) {
    // Navigate with dashboard data in state
    this.router.navigate(['/dashboard', dashboard._id], { 
      state: { dashboard: dashboard } 
    });
  }



























































  
// dashboards: Dashboard[] = [];
//   newDashboardName: string = '';
//   newDashboardDescription: string = '';
//   updateDashboardId: string | null = null;
//   updateDashboardName: string = '';
//   updateDashboardDescription: string = '';
//   errorMessage: string | null = null;
//   successMessage: string | null = null;

//   constructor(private dashboardService: DashboardService, private router: Router) {}

//   ngOnInit(): void {
//     this.loadDashboards();
//   }

//   // Load all dashboards
//   loadDashboards(): void {
//     this.dashboardService.getDashboards().subscribe({
//       next: (dashboards) => {
//         this.dashboards = dashboards;
//       },
//       error: (error) => {
//         this.errorMessage = error.message || 'Failed to load dashboards';
//       }
//     });
//   }

//   // Create a new dashboard
//   createDashboard(): void {
//     if (!this.newDashboardName.trim()) {
//       this.errorMessage = 'Dashboard name is required';
//       return;
//     }

//     this.errorMessage = null;
//     this.successMessage = null;

//     this.dashboardService.createDashboard(this.newDashboardName, this.newDashboardDescription).subscribe({
//       next: (dashboard) => {
//         this.dashboards.push(dashboard);
//         this.successMessage = 'Dashboard created successfully';
//         this.newDashboardName = '';
//         this.newDashboardDescription = '';
//       },
//       error: (error) => {
//         this.errorMessage = error.message || 'Failed to create dashboard';
//       }
//     });
//   }

//   // Delete a dashboard
//   deleteDashboard(id: string): void {
//     if (!confirm('Are you sure you want to delete this dashboard?')) {
//       return;
//     }

//     this.errorMessage = null;
//     this.successMessage = null;

//     this.dashboardService.deleteDashboard(id).subscribe({
//       next: (response) => {
//         this.dashboards = this.dashboards.filter(d => d._id !== id);
//         this.successMessage = response.message;
//       },
//       error: (error) => {
//         this.errorMessage = error.message || 'Failed to delete dashboard';
//       }
//     });
//   }

//   // Prepare to update a dashboard (populate form)
//   startUpdateDashboard(dashboard: Dashboard): void {
//     this.updateDashboardId = dashboard._id!;
//     this.updateDashboardName = dashboard.name;
//     this.updateDashboardDescription = dashboard.description || '';
//   }

//   // Update a dashboard
//   updateDashboard(): void {
//     if (!this.updateDashboardId || !this.updateDashboardName.trim()) {
//       this.errorMessage = 'Dashboard ID and name are required';
//       return;
//     }

//     this.errorMessage = null;
//     this.successMessage = null;

//     this.dashboardService
//       .updateDashboard(this.updateDashboardId, this.updateDashboardName, this.updateDashboardDescription)
//       .subscribe({
//         next: (dashboard) => {
//           const index = this.dashboards.findIndex(d => d._id === this.updateDashboardId);
//           if (index !== -1) {
//             this.dashboards[index] = dashboard;
//           }
//           this.successMessage = 'Dashboard updated successfully';
//           this.cancelUpdate();
//         },
//         error: (error) => {
//           this.errorMessage = error.message || 'Failed to update dashboard';
//         }
//       });
//   }// Cancel update
//   cancelUpdate(): void {
//     this.updateDashboardId = null;
//     this.updateDashboardName = '';
//     this.updateDashboardDescription = '';
//   }

//   // Navigate to dashboard item view
//   viewDashboard(id: string|undefined): void {
//     this.dashboardService.getDashboardById(id).subscribe({
//       next: (dashboard) => {
//         this.router.navigate(['/dashboard', id]);
//       },
//       error: (error) => {
//         this.errorMessage = error.message || 'Failed to load dashboard';
//       }
//     });
//   }
}
