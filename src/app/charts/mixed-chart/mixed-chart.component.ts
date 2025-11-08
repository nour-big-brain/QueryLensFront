import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { ChartTheme, LIGHT_THEME } from '../chart-themes';
import { ThemesService } from '../../services/themes.service';
import { BaseChartComponent } from '../base-chart.component';

@Component({
  selector: 'app-mixed-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './mixed-chart.component.html',
  styleUrls: ['./mixed-chart.component.css']
})
export class MixedChartComponent extends BaseChartComponent {
  protected override transformPayloadToSeries(): any {
    if (!this.payload) return {};

    return {
      series: this.payload.series?.map((s, i) => ({
        name: s.name,
        type: i % 2 === 0 ? 'column' : 'line',
        data: s.values
      })) || [],
      chart: { height: 350, type: 'line' },
      stroke: { width: [0, 4] },
      xaxis: { categories: this.payload.categories || [] },
      title: { text: this.payload.title || '' },
    };
  }
}
