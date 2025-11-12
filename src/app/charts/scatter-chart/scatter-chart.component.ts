import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { ChartTheme, LIGHT_THEME } from '../chart-themes';
import { ThemesService } from '../../services/themes.service';
import { BaseChartComponent } from '../base-chart.component';

@Component({
  selector: 'app-scatter-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './scatter-chart.component.html',
  styleUrls: ['./scatter-chart.component.css']
})
export class ScatterChartComponent extends BaseChartComponent {
  protected override transformPayloadToSeries(): any {
    if (!this.payload) return {};

    return {
      series: this.payload.series?.map(s => ({
        name: s.name,
        data: s.values.map((v, i) => [this.payload?.categories?.[i] ?? `Point ${i + 1}`, v])
      })) || [],
      chart: { type: 'scatter', height: 350 },
      xaxis: { categories: this.payload.categories || [] },
      title: { text: this.payload.title || '' },
    };
  }
}