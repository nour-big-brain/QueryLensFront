import { Component, OnInit } from '@angular/core';
import { BarChartComponent } from '../../charts/bar-chart/bar-chart.component';
import { LineChartComponent } from '../../charts/line-chart/line-chart.component';
import { AreaChartComponent } from '../../charts/area-chart/area-chart.component';
import { PieChartComponent } from '../../charts/pie-chart/pie-chart.component';
import { DonutChartComponent } from '../../charts/donut-chart/donut-chart.component';
import { RadarChartComponent } from '../../charts/radar-chart/radar-chart.component';
import { HeatmapChartComponent } from '../../charts/heatmap-chart/heatmap-chart.component';
import { ScatterChartComponent } from '../../charts/scatter-chart/scatter-chart.component';
import { MixedChartComponent } from '../../charts/mixed-chart/mixed-chart.component';
import { ChartPayload } from '../../models/chartPayload';
import { GridsterModule, GridsterConfig } from 'angular-gridster2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dashboard } from '../../models/dashboard';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

interface Comment {
  _id?: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string | number | Date;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    BarChartComponent,
    LineChartComponent,
    AreaChartComponent,
    PieChartComponent,
    DonutChartComponent,
    RadarChartComponent,
    HeatmapChartComponent,
    ScatterChartComponent,
    MixedChartComponent,
    GridsterModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  options!: GridsterConfig;
  dashboardData: Dashboard | null = null;
  charts: ChartPayload[] = [];
  isLoading = true;
  Math = Math;

  // Comments
  comments: Comment[] = [];
  newComment: string = '';
  currentUserId: string = '';
  currentUsername: string = '';
  showCommentsSidebar: boolean = true;
  commentsLoading: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private dashboardService: DashboardService,
    private router:Router
  ) {}

  ngOnInit() {
    this.options = {
      gridType: 'scrollVertical',
      draggable: { enabled: true },
      resizable: { enabled: true },
      minCols: 12,
      maxCols: 12,
      minRows: 1,
      maxRows: 100,
      fixedColWidth: 100,
      fixedRowHeight: 100
    };

    // Initialize user FIRST
    this.initializeUser();

    const navigation = window.history.state;
    console.log('Navigation state:', navigation);
if (navigation && navigation.dashboard) {
      this.dashboardData = navigation.dashboard as Dashboard;
      this.charts = this.dashboardData.cards && this.dashboardData.cards.length > 0 
        ? this.dashboardData.cards 
        : this.getMockCharts();
      this.isLoading = false;
      setTimeout(() => this.loadComments(), 100);
    }  else {
      const dashboardId = this.route.snapshot.paramMap.get('id');
      console.log('Dashboard ID from route:', dashboardId);
      
      if (dashboardId) {
        this.loadDashboard(dashboardId);
      } else {
        console.error('No dashboard ID provided in route or state.');
        this.isLoading = false;
      }
    }
  }

loadDashboard(id: string) {
    this.dashboardService.getDashboardById(id, this.currentUserId).subscribe({
      next: (data: Dashboard) => {
        this.dashboardData = data;
        
        // Use cards from backend, or show mock data if empty
        this.charts = data.cards && data.cards.length > 0 ? data.cards : this.getMockCharts();
        
        console.log('Charts loaded:', this.charts);
        this.isLoading = false;
        this.loadComments();
      },
      error: (err) => {
        console.error('Failed to load dashboard:', err);
        this.isLoading = false;
      }
    });
  }

  private getMockCharts(): ChartPayload[] {
    return [
      {
        title: 'Sales by Region',
        description: 'Monthly sales performance across regions',
        type: 'bar',
        categories: ['North', 'South', 'East', 'West'],
        series: [
          {
            name: 'Sales',
            values: [4000, 3000, 2000, 2780]
          }
        ]
      },
      {
        title: 'Revenue Trend',
        description: 'Revenue growth over months',
        type: 'line',
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        series: [
          {
            name: 'Revenue',
            values: [4000, 3000, 2000, 2780, 1890]
          }
        ]
      },
      {
        title: 'Market Share',
        description: 'Product distribution across markets',
        type: 'pie',
        labels: ['Product A', 'Product B', 'Product C', 'Product D'],
        series: [
          {
            name: 'Share',
            values: [30, 25, 20, 25]
          }
        ]
      },
      {
        title: 'Performance Metrics',
        description: 'Key performance indicators',
        type: 'radar',
        labels: ['Quality', 'Delivery', 'Cost', 'Safety'],
        series: [
          {
            name: 'Performance',
            values: [85, 90, 75, 88]
          }
        ]
      }
    ];
  }
  loadComments() {
    const dashboardId = this.dashboardData?._id || this.route.snapshot.paramMap.get('id');
    if (!dashboardId) {
      console.error('No dashboard ID found');
      return;
    }

    console.log('Loading comments for dashboard:', dashboardId);
    console.log('With user ID:', this.currentUserId);

    this.commentsLoading = true;
    this.dashboardService.getComments(dashboardId, this.currentUserId).subscribe({
      next: (data: any) => {
        console.log('Comments received:', data);
        // Convert createdAt to Date if it's a string
        const processedComments = data.map((comment: any) => ({
          ...comment,
          createdAt: new Date(comment.createdAt)
        }));
        
        // Sort comments by newest first
        this.comments = processedComments.sort((a: Comment, b: Comment) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.commentsLoading = false;
      },
      error: (err) => {
        console.error('Failed to load comments:', err);
        this.comments = [];
        this.commentsLoading = false;
      }
    });
  }

  addComment() {
    if (!this.newComment.trim()) return;

    const dashboardId = this.dashboardData?._id || this.route.snapshot.paramMap.get('id');
    if (!dashboardId) return;

    this.dashboardService.addComment(dashboardId, this.newComment.trim(), this.currentUserId).subscribe({
      next: (response: any) => {
        // Create new comment object to add locally
        const newComment: Comment = {
          _id: response.comment?._id || Date.now().toString(),
          userId: this.currentUserId,
          username: this.currentUsername,
          text: this.newComment.trim(),
          createdAt: new Date()
        };

        this.comments.unshift(newComment);
        this.newComment = '';
      },
      error: (err) => {
        console.error('Failed to add comment:', err);
        alert('Failed to add comment. Please try again.');
      }
    });
  }

  deleteComment(commentId?: string) {
    if (!commentId) return;
    
    const dashboardId = this.dashboardData?._id || this.route.snapshot.paramMap.get('id');
    if (!dashboardId) return;

    if (!confirm('Are you sure you want to delete this comment?')) return;

    this.dashboardService.deleteComment(dashboardId, commentId, this.currentUserId).subscribe({
      next: () => {
        this.comments = this.comments.filter(c => c._id !== commentId);
      },
      error: (err) => {
        console.error('Failed to delete comment:', err);
        alert('Failed to delete comment. You may only delete your own comments.');
      }
    });
  }

  toggleCommentsSidebar() {
    this.showCommentsSidebar = !this.showCommentsSidebar;
  }

  private initializeUser() {
    // Check if user ID exists in session storage
    let userId = sessionStorage.getItem('tempUserId');
    let username = sessionStorage.getItem('tempUsername');
    
    // Validate that userId is a valid MongoDB ObjectId (24 hex characters)
    if (!userId || !this.isValidObjectId(userId)) {
      // Generate a valid temporary user ID
      userId = "6910cda02f1185a181e3e542";
      username = 'User ' + userId.substring(0, 8);
      
      sessionStorage.setItem('tempUserId', userId);
      sessionStorage.setItem('tempUsername', username);
    }
    
    this.currentUserId = userId;
    this.currentUsername = username || 'Anonymous User';
  }

  private isValidObjectId(id: string): boolean {
    return /^[0-9a-f]{24}$/i.test(id);
  }
}