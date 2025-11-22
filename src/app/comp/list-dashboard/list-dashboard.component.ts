import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';
import { Dashboard } from '../../models/dashboard';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-list-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-dashboard.component.html',
  styleUrl: './list-dashboard.component.css'
})
export class ListDashboardComponent implements OnInit, OnDestroy {
  dashboards: Dashboard[] = [];
  ownedDashboards: Dashboard[] = [];
  sharedDashboards: Dashboard[] = [];
  filteredOwnedDashboards: Dashboard[] = [];
  filteredSharedDashboards: Dashboard[] = [];
  
  isLoading = false;
  error: string | null = null;
  searchQuery: string = '';
  totalDashboards: number = 0;
  
  private destroy$ = new Subject<void>();

  constructor(
    private dashboardService: DashboardService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to user changes and load dashboards when user is available
    this.authService.user$
      .pipe(
        filter(user => user !== null), // Wait for user to be loaded
        takeUntil(this.destroy$)
      )
      .subscribe(user => {
        if (user && user._id) {
          this.loadAllDashboards(user._id);
        }
      });

    // Fallback: if user is already loaded, start loading dashboards immediately
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser._id) {
      this.loadAllDashboards(currentUser._id);
    } else if (!currentUser) {
      // User not logged in → redirect
      this.router.navigate(['/login']);
    }
  }

  loadAllDashboards(userId: string) {
    this.isLoading = true;
    this.error = null;

    // Load both owned and shared dashboards in parallel
    forkJoin({
      owned: this.dashboardService.getDashboardsByUser(userId),
      shared: this.dashboardService.getSharedDashboards(userId)
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (result) => {
        this.ownedDashboards = result.owned || [];
        this.sharedDashboards = result.shared || [];
        
        // Combine both arrays
        this.dashboards = [
          ...this.ownedDashboards,
          ...this.sharedDashboards
        ];
        
        // Initialize filtered arrays
        this.filteredOwnedDashboards = [...this.ownedDashboards];
        this.filteredSharedDashboards = [...this.sharedDashboards];
        this.updateTotalCount();
        
        console.log('Owned dashboards:', this.ownedDashboards.length);
        console.log('Shared dashboards:', this.sharedDashboards.length);
        console.log('Total dashboards:', this.dashboards.length);
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading dashboards:', err);
        this.error = 'Failed to load your dashboards';
        this.isLoading = false;
      }
    });
  }

  /**
   * Filter dashboards based on search query
   * Searches through name, description, and owner name
   */
  filterDashboards(): void {
    const query = this.searchQuery.toLowerCase().trim();

    if (!query) {
      // Reset to original lists if search is empty
      this.filteredOwnedDashboards = [...this.ownedDashboards];
      this.filteredSharedDashboards = [...this.sharedDashboards];
      this.updateTotalCount();
      return;
    }

    // Filter owned dashboards
    this.filteredOwnedDashboards = this.ownedDashboards.filter(db =>
      this.matchesQuery(db, query)
    );

    // Filter shared dashboards
    this.filteredSharedDashboards = this.sharedDashboards.filter(db =>
      this.matchesQuery(db, query)
    );

    this.updateTotalCount();
  }

  /**
   * Check if a dashboard matches the search query
   * @param dashboard Dashboard to check
   * @param query Search query
   * @returns true if dashboard matches query
   */
  private matchesQuery(dashboard: Dashboard, query: string): boolean {
    const name = dashboard.name.toLowerCase();
    const description = (dashboard.description || '').toLowerCase();
    
    return (
      name.includes(query) ||
      description.includes(query)
    );
  }

  /**
   * Update total dashboard count based on filtered results
   */
  private updateTotalCount(): void {
    this.totalDashboards =
      this.filteredOwnedDashboards.length +
      this.filteredSharedDashboards.length;
  }

  /**
   * Clear search filter and reset to original lists
   */
  clearSearch(): void {
    this.searchQuery = '';
    this.filterDashboards();
  }

  /**
   * Refresh dashboards list
   */
  refreshDashboards(): void {
    this.clearSearch();
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser._id) {
      this.loadAllDashboards(currentUser._id);
    }
  }

  openDashboard(dashboard: Dashboard) {
    this.router.navigate(['/dashboard', dashboard._id], { 
      state: { dashboard } 
    });
  }

  /**
   * Get the permission for a dashboard (owned, shared with specific permission, or view-only)
   */
  getDashboardPermission(dashboard: Dashboard, userId: string): string {
    if (dashboard.ownerId === userId) {
      return 'Owner';
    }
    
    const share = dashboard.sharedWith?.find(s => s.userId === userId);
    if (share) {
      return share.permission.charAt(0).toUpperCase() + share.permission.slice(1);
    }
    
    return 'View Only';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}