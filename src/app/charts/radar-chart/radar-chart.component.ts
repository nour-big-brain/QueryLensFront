import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { ChartTheme, LIGHT_THEME } from '../chart-themes';
import { ThemesService } from '../../services/themes.service';
import { BaseChartComponent } from '../base-chart.component';

@Component({
  selector: 'app-radar-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.css']
})
export class RadarChartComponent extends BaseChartComponent {
  protected override transformPayloadToSeries(): any {
    if (!this.payload) return {};

    return {
      series: this.payload.series?.map(s => ({ name: s.name, data: s.values })) || [],
      chart: { type: 'radar', height: 350 },
      xaxis: { categories: this.payload.categories || [] },
      title: { text: this.payload.title || '' },
    };
  }
}