import { Component, Input, OnInit } from '@angular/core';
import { Dashboard } from '../../models/dashboard';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-item',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-item.component.html',
  styleUrl: './dashboard-item.component.css'
})
export class DashboardItemComponent implements OnInit {
  @Input() dashboard!: Dashboard; // Input property to receive dashboard data
  cardId: string = ''; // Form input for card ID
  targetUserId: string = ''; // Form input for user ID to share with
  targetUsername: string = ''; // Form input for username
  permission: 'view' | 'edit' | 'admin' = 'view'; // Default permission
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    if (!this.dashboard) {
      this.errorMessage = 'No dashboard data provided';
    }
  }
// Get userId from sessionStorage (like we did in dashboard component)
private getCurrentUserId(): string {
  return sessionStorage.getItem('tempUserId') || '';
}
  // Add card to dashboard
  addCard(): void {
    if (!this.cardId.trim()) {
      this.errorMessage = 'Card ID is required';
      return;
    }
    

    this.errorMessage = null;
    this.successMessage = null;

    this.dashboardService.addCardToDashboard(this.dashboard._id!, this.cardId,this.getCurrentUserId()).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.dashboard = response.dashboard; // Update dashboard with new card
        this.cardId = ''; // Clear input
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to add card';
      }
    });
  }

  // Remove card from dashboard
  removeCard(cardId: string): void {
    if (!confirm(`Are you sure you want to remove card ${cardId}?`)) {
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;

    this.dashboardService.removeCardFromDashboard(this.dashboard._id!, cardId, this.getCurrentUserId()).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.dashboard = response.dashboard; // Update dashboard
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to remove card';
      }
    });
  }

  // Share dashboard with another user
  shareDashboard(): void {
    if (!this.targetUserId.trim() || !this.targetUsername.trim()) {
      this.errorMessage = 'User ID and username are required';
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;

    this.dashboardService
      .shareDashboard(this.dashboard._id!, this.targetUserId, this.targetUsername, this.permission, this.getCurrentUserId())
      .subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.dashboard = response.dashboard; // Update dashboard with new sharing info
          this.targetUserId = ''; // Clear inputs
          this.targetUsername = '';
          this.permission = 'view'; // Reset to default
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to share dashboard';
        }
      });
  }
}