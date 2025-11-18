import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Dashboard } from '../../models/dashboard';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-create-dashboard',
  standalone: true,
  imports: [FormsModule, TranslateModule, CommonModule],
  templateUrl: './create-dashboard.component.html',
  styleUrl: './create-dashboard.component.css'
})
export class CreateDashboardComponent implements OnInit, OnDestroy {
  newDashboardName: string = '';
  newDashboardDescription: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading: boolean = false;
  private destroy$ = new Subject<void>();
  currentUserId: string | null = null; // Make public for debugging

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('CreateDashboardComponent initialized');
    
    // Try to get user ID immediately if already loaded
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?._id) {
      this.currentUserId = currentUser._id;
      console.log('User ID on init:', this.currentUserId);
    }

    // Subscribe to user changes in case user loads after component init
    this.authService.user$
      .pipe(
        filter(user => user !== null),
        takeUntil(this.destroy$)
      )
      .subscribe(user => {
        console.log('User$ subscription fired:', user);
        if (user?._id) {
          this.currentUserId = user._id;
          console.log('User ID updated:', this.currentUserId);
        }
      });

    // Redirect if not logged in
    if (!this.currentUserId && !this.authService.isLoggedIn()) {
      console.warn('User not authenticated, redirecting to login');
      this.router.navigate(['/login']);
    }
  }

  createDashboard(): void {
    console.log('createDashboard() called');
    console.log('Current state - userId:', this.currentUserId, 'name:', this.newDashboardName);

    if (!this.currentUserId) {
      this.errorMessage = 'User not authenticated';
      console.error('Error: User not authenticated');
      return;
    }

    if (!this.newDashboardName.trim()) {
      this.errorMessage = 'Dashboard name is required';
      console.error('Error: Dashboard name is required');
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    console.log('Calling dashboardService.createDashboard with:', {
      name: this.newDashboardName,
      description: this.newDashboardDescription,
      userId: this.currentUserId
    });

    this.dashboardService.createDashboard(
      this.newDashboardName,
      this.newDashboardDescription,
      this.currentUserId
    ).subscribe({
      next: (dashboard) => {
        console.log('Dashboard created successfully:', dashboard);
        this.successMessage = 'Dashboard created successfully';
        this.isLoading = false;
        
        // Reset form
        this.newDashboardName = '';
        this.newDashboardDescription = '';
        
        // Navigate after brief delay
        setTimeout(() => {
          this.router.navigate(['/listDashboard']);
        }, 1500);
      },
      error: (error) => {
        console.error('Error creating dashboard:', error);
        this.errorMessage = error.message || 'Failed to create dashboard';
        this.isLoading = false;
      }
    });
  }

  onReset(): void {
    console.log('Reset clicked');
    this.newDashboardName = '';
    this.newDashboardDescription = '';
    this.errorMessage = null;
    this.successMessage = null;
  }

  redirectToList(): void {
    this.router.navigate(['/listDashboard']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}