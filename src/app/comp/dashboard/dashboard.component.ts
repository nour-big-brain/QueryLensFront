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
import { ChartPayload } from '../../charts/chartPayload';
import { GridsterModule, GridsterConfig, GridsterItem } from 'angular-gridster2';
import { CommonModule } from '@angular/common';
import { NgModel } from '@angular/forms';

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
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
options!: GridsterConfig;
  dashboard: any[] = [];

  ngOnInit() {
    // Configure gridster options
  this.options = {
    gridType: 'scrollVertical',  // Changed from 'fit' to allow scrolling
    displayGrid: 'onDrag&Resize',
    pushItems: true,
    draggable: {
      enabled: true
    },
    resizable: {
      enabled: true
    },
    minCols: 12,
    maxCols: 12,
    minRows: 1,
    maxRows: 100,
    maxItemCols: 12,
    maxItemRows: 10,
    defaultItemCols: 4,
    defaultItemRows: 3,
    fixedColWidth: 100,  // Width per column
    fixedRowHeight: 100, // Height per row
    itemChangeCallback: this.itemChange.bind(this),
    itemResizeCallback: this.itemResize.bind(this)
  };

    // Load saved layout or use default
    this.loadDashboard();
  }

  loadDashboard() {
    const savedLayout = localStorage.getItem('dashboardLayout');
    
    if (savedLayout) {
      this.dashboard = JSON.parse(savedLayout);
    } else {
      // Default layout
      this.dashboard = [
        {
          x: 0, y: 0, cols: 6, rows: 3,
          chartType: 'area',
          payload: {
            title: 'Sales Over Time',
            type: 'area',
            categories: ['Jan', 'Feb', 'Mar', 'Apr'],
            series: [
              { name: 'Revenue', values: [100, 200, 150, 300] },
              { name: 'Expenses', values: [80, 120, 100, 150] }
            ]
          }
        },
        {
          x: 6, y: 0, cols: 6, rows: 3,
          chartType: 'bar',
          payload: {
            title: 'Quarterly Sales',
            type: 'bar',
            categories: ['Q1', 'Q2', 'Q3', 'Q4'],
            series: [
              { name: 'Revenue', values: [120, 200, 150, 300] },
              { name: 'Profit', values: [50, 80, 40, 90] }
            ]
          }
        },
        {
          x: 0, y: 3, cols: 4, rows: 3,
          chartType: 'line',
          payload: {
            title: 'Monthly Revenue',
            type: 'line',
            categories: ['Jan', 'Feb', 'Mar', 'Apr'],
            series: [
              { name: 'Revenue', values: [30, 40, 35, 50] }
            ]
          }
        },
        {
          x: 4, y: 3, cols: 4, rows: 3,
          chartType: 'pie',
          payload: {
            title: 'Fruit Sales',
            type: 'pie',
            labels: ['Apples', 'Oranges', 'Bananas', 'Grapes'],
            series: [
              { name: 'Fruits', values: [44, 55, 13, 33] }
            ]
          }
        },
        {
          x: 8, y: 3, cols: 4, rows: 3,
          chartType: 'donut',
          payload: {
            title: 'Browser Usage',
            type: 'donut',
            labels: ['Chrome', 'Firefox', 'Safari', 'Edge'],
            series: [
              { name: 'Users', values: [60, 25, 10, 5] }
            ]
          }
        },
        {
          x: 0, y: 6, cols: 4, rows: 3,
          chartType: 'radar',
          payload: {
            title: 'Student Scores',
            type: 'radar',
            categories: ['Math', 'Physics', 'Chemistry', 'Biology', 'English'],
            series: [
              { name: 'Scores', values: [80, 90, 70, 85, 75] }
            ]
          }
        },
        {
          x: 4, y: 6, cols: 4, rows: 3,
          chartType: 'heatmap',
          payload: {
            title: 'Team Performance',
            type: 'heatmap',
            categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            series: [
              { name: 'Team A', values: [30, 40, 50, 20] },
              { name: 'Team B', values: [20, 50, 30, 60] }
            ]
          }
        },
        {
          x: 8, y: 6, cols: 4, rows: 3,
          chartType: 'scatter',
          payload: {
            title: 'Scatter Plot',
            type: 'scatter',
            categories: ['Point 1', 'Point 2', 'Point 3', 'Point 4'],
            series: [
              { name: 'Dataset 1', values: [30, 20, 40, 10] },
              { name: 'Dataset 2', values: [15, 25, 35, 45] }
            ]
          }
        },
        {
          x: 0, y: 9, cols: 12, rows: 3,
          chartType: 'mixed',
          payload: {
            title: 'Revenue vs Orders',
            type: 'mixed',
            categories: ['Jan', 'Feb', 'Mar', 'Apr'],
            series: [
              { name: 'Revenue', values: [20, 30, 40, 50] },
              { name: 'Orders', values: [25, 35, 30, 45] }
            ]
          }
        }
      ];
    }
  }

  itemChange(item: any) {
    this.saveDashboard();
  }

  itemResize(item: any) {
    this.saveDashboard();
    // Trigger window resize event to force charts to redraw
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 50);
  }

  saveDashboard() {
    localStorage.setItem('dashboardLayout', JSON.stringify(this.dashboard));
  }

  resetLayout() {
    localStorage.removeItem('dashboardLayout');
    this.loadDashboard();
  }
}