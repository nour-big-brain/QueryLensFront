import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { ChartTheme, LIGHT_THEME } from '../chart-themes';
import { ThemesService } from '../../services/themes.service';
import { BaseChartComponent } from '../base-chart.component';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent extends BaseChartComponent {
  protected override transformPayloadToSeries(): any {
    if (!this.payload) return {};

    return {
      series: this.payload.series?.map(s => ({ name: s.name, data: s.values })) || [],
      chart: { type: 'line', height: 350 },
      stroke: { curve: 'smooth' },
      xaxis: { categories: this.payload.categories || [] },
      title: { text: this.payload.title || '' },
    };
  }
}
