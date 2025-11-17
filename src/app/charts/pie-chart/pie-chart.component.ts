import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { ChartTheme, LIGHT_THEME } from '../chart-themes';
import { ThemesService } from '../../services/themes.service';
import { BaseChartComponent } from '../base-chart.component';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent extends BaseChartComponent {
  protected override transformPayloadToSeries(): any {
    if (!this.payload) return {};

    // For pie charts: sum values per category
    const labels = this.payload.categories || [];
    
    // If we have multiple series, sum them together for each category
    let seriesValues: number[] = [];
    
    if (this.payload.series && this.payload.series.length > 0) {
      // Initialize array with zeros for each category
      seriesValues = new Array(labels.length).fill(0);
      
      // Sum all series values for each category index
      this.payload.series.forEach((s: any) => {
        if (s.values && Array.isArray(s.values)) {
          s.values.forEach((val: number, idx: number) => {
            if (idx < seriesValues.length) {
              seriesValues[idx] += val;
            }
          });
        }
      });
    }

    return {
      series: seriesValues,  // One value per category
      chart: { type: 'pie', height: 350 },
      labels: labels,
      title: { text: this.payload.title || '' },
      legend: { 
        position: 'bottom',
        fontSize: '12px'
      },
      dataLabels: {
        enabled: true,
        formatter: (val: any) => val.toFixed(1) + '%'
      },
      tooltip: {
        enabled: true,
        theme: 'light'
      }
    };
  }
}