import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { ChartTheme, LIGHT_THEME } from '../chart-themes';
import { ThemesService } from '../../services/themes.service';
import { BaseChartComponent } from '../base-chart.component';

@Component({
  selector: 'app-heatmap-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './heatmap-chart.component.html',
  styleUrls: ['./heatmap-chart.component.css']
})
export class HeatmapChartComponent extends BaseChartComponent {
  protected override transformPayloadToSeries(): any {
    if (!this.payload) return {};

    return {
      series: this.payload.series?.map(s => ({
        name: s.name,
        data: s.values.map((v, i) => ({ x: this.payload?.categories?.[i] ?? `Item ${i + 1}`, y: v }))
      })) || [],
      chart: { type: 'heatmap', height: 350 },
      dataLabels: { enabled: false },
      title: { text: this.payload.title || '' },
    };
  }
}