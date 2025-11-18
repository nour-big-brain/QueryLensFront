import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GridsterConfig, GridsterItem, GridsterModule } from 'angular-gridster2';

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
import { Dashboard } from '../../models/dashboard';
import { DashboardService } from '../../services/dashboard.service';
import { ChartService } from '../../services/chart.service';
import { QueryService } from '../../services/query.service';

interface Comment {
  _id?: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string | number | Date;
}

interface DashboardChart {
  chart: ChartPayload;
  item: GridsterItem;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GridsterModule,
    BarChartComponent,
    LineChartComponent,
    AreaChartComponent,
    PieChartComponent,
    DonutChartComponent,
    RadarChartComponent,
    HeatmapChartComponent,
    ScatterChartComponent,
    MixedChartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  options!: GridsterConfig;
  dashboardData: Dashboard | null = null;
  chartData: DashboardChart[] = [];
  isLoading = true;

  permission: 'view' | 'edit' | 'admin' | 'owner' = 'view';

  showShareModal = false;
  targetUsernameOrId = '';
  sharePermission: 'view' | 'edit' | 'admin' = 'view';
  shareMessage = '';
  shareSuccess = false;

  comments: Comment[] = [];
  newComment = '';
  currentUserId = '';
  currentUsername = '';
  showCommentsSidebar = true;
  commentsLoading = false;

  constructor(
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    private chartService: ChartService,
    private queryService: QueryService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.initializeUser();

    const navigation = window.history.state;
    if (navigation?.dashboard) {
      this.dashboardData = navigation.dashboard;

      const myAccess = navigation.dashboard.sharedWith?.find((s: any) => s.userId === this.currentUserId);
      this.permission = myAccess?.permission ||
        (navigation.dashboard.ownerId === this.currentUserId ? 'owner' : 'view');

      this.initializeGridster();  // ← must be AFTER setting permission!
      this.loadChartsFromQueries();
      this.loadComments();
    } else {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) this.loadDashboard(id);
      else this.isLoading = false;
    }
    this.cdr.markForCheck();
  }

  private initializeGridster() {
    const canEdit = this.canEdit();
    this.options = {
      gridType: 'verticalFixed',
      compactType: 'compactUp&Left',
      margin: 12,
      outerMargin: true,
      outerMarginTop: 15,
      outerMarginRight: 15,
      outerMarginBottom: 15,
      outerMarginLeft: 15,
      useTransformOnContainer: true,
      mobileBreakpoint: 640,
      minCols: 12,
      maxCols: 12,
      minRows: 1,
      maxRows: 100,
      fixedColWidth: 100,
      fixedRowHeight: 100,
      pushItems: true,
      swap: false,
      draggable: {
        enabled: canEdit,
        ignoreContent: false,
        delayStart: 0
      },
      resizable: {
        enabled: canEdit,
        handles: {
          s: true,
          e: true,
          n: false,
          w: false,
          se: true,
          ne: false,
          sw: false,
          nw: false
        }
      },
      displayGrid: 'onDrag&Resize',
      disableScrollHorizontal: true,
      disableScrollVertical: false,
      disableWarnings: false,
      enableEmptyCellClick: false,
      enableOccupiedCellClick: false,
      emptyCellClickToRemove: false,
      keepFixedHeightInMobile: false,
      ignoreMarginInRow: false,
      ignoreRenderingSubcomponents: false,
      stopUsingGridGap: false,
      itemChangeCallback: () => this.onItemChange()
    };
  }
  loadDashboard(id: string) {
    this.dashboardService.getDashboardById(id, this.currentUserId).subscribe({
      next: (data) => {
        this.dashboardData = data;

        // Determine permission
        const myAccess = data.sharedWith?.find((s: any) => s.userId === this.currentUserId);
        this.permission = myAccess?.permission || 'view';

        if (data.ownerId === this.currentUserId && this.permission === 'view') {
          this.permission = 'owner';
        }

        // CRITICAL: Re-initialize gridster AFTER permission is set
        this.initializeGridster();

        this.loadChartsFromQueries();
        this.loadComments();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
  canEdit(): boolean {
    const p = this.permission;
    return p === 'owner' || p === 'admin' || p === 'edit';
  }

  canShare(): boolean {
    const p = this.permission;
    return p === 'owner' || p === 'admin';
  }

  loadChartsFromQueries() {
    if (!this.dashboardData?._id) return;

    this.queryService.getQueriesByDashboardId(this.dashboardData._id).subscribe({
      next: (queries) => {
        if (!queries?.length) {
          this.chartData = [];
          this.isLoading = false;
          this.cdr.markForCheck();
          return;
        }

        const promises = queries.map((q, i) =>
          this.chartService.getChartData(q._id!, q.chartType)
            .toPromise()
            .then(payload => payload ? {
              chart: { ...payload, title: q.title || 'Untitled', description: q.description || '' } as ChartPayload,
              item: { x: (i % 2) * 6, y: Math.floor(i / 2) * 6, cols: 6, rows: 6 }
            } : null)
        );

        Promise.all(promises).then(results => {
          this.chartData = results.filter(Boolean) as DashboardChart[];
          this.isLoading = false;
          this.cdr.markForCheck();
        });
      }
    });
  }

  loadComments() {
    if (!this.dashboardData?._id) return;
    this.commentsLoading = true;
    this.dashboardService.getComments(this.dashboardData._id, this.currentUserId).subscribe({
      next: (comments: any[]) => {
        this.comments = comments
          .map(c => ({ ...c, createdAt: new Date(c.createdAt) }))
          .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        this.commentsLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  addComment() {
    if (!this.newComment.trim() || !this.dashboardData?._id) return;
    this.dashboardService.addComment(this.dashboardData._id, this.newComment.trim(), this.currentUserId).subscribe({
      next: () => {
        this.comments.unshift({
          userId: this.currentUserId,
          username: this.currentUsername,
          text: this.newComment.trim(),
          createdAt: new Date()
        });
        this.newComment = '';
        this.cdr.markForCheck();
      }
    });
  }

  deleteComment(commentId?: string) {
    if (!commentId || !confirm('Delete this comment?')) return;
    const dashboardId = this.dashboardData?._id;
    if (!dashboardId) return;

    this.dashboardService.deleteComment(dashboardId, commentId, this.currentUserId).subscribe({
      next: () => {
        this.comments = this.comments.filter(c => c._id !== commentId);
        this.cdr.markForCheck();
      }
    });
  }

  toggleCommentsSidebar() {
    this.showCommentsSidebar = !this.showCommentsSidebar;
    this.cdr.markForCheck();
  }

  private initializeUser() {
    let userId = sessionStorage.getItem('tempUserId') || '6910cda02f1185a181e3e542';
    let username = sessionStorage.getItem('tempUsername') || 'nourr';
    this.currentUserId = userId;
    this.currentUsername = username;
  }

  openShareModal() {
    if (!this.canShare()) return alert('You do not have permission to share');
    this.showShareModal = true;
    this.targetUsernameOrId = '';
    this.sharePermission = 'view';
    this.cdr.markForCheck();
  }

  closeShareModal() {
    this.showShareModal = false;
    this.cdr.markForCheck();
  }

  confirmShare() {
    if (!this.dashboardData?._id) return;
    this.dashboardService.shareDashboard(
      this.dashboardData._id,
      this.targetUsernameOrId.trim(),
      this.targetUsernameOrId.trim(),
      this.sharePermission,
      this.currentUserId
    ).subscribe({
      next: () => {
        this.shareMessage = 'Shared successfully!';
        this.shareSuccess = true;
        this.cdr.markForCheck();
        setTimeout(() => this.closeShareModal(), 2000);
      },
      error: (err) => {
        this.shareMessage = err.message || 'Failed to share';
        this.shareSuccess = false;
        this.cdr.markForCheck();
      }
    });
  }

  getPermissionBadge(): string {
    switch (this.permission) {
      case 'owner': return 'Owner';
      case 'admin': return 'Admin';
      case 'edit': return 'Can Edit';
      case 'view':
      default:
        return 'View Only';
    }
  }

  onItemChange() {
    // Trigger chart resize when gridster items change
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    });
  }
}