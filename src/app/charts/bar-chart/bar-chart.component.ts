import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { ChartTheme, LIGHT_THEME } from '../chart-themes';
import { ThemesService } from '../../services/themes.service';
import { BaseChartComponent } from '../base-chart.component';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css'
})
export class BarChartComponent extends BaseChartComponent{
  protected override transformPayloadToSeries(): any {
    if (!this.payload) return {};

    return {
      series: this.payload.series?.map(s => ({ name: s.name, data: s.values })) || [],
      chart: { type: 'bar', height: 350 },
      plotOptions: { bar: { horizontal: false } },
      dataLabels: { enabled: false },
      xaxis: { categories: this.payload.categories || [] },
      title: { text: this.payload.title || '' },
    };
  }
  }

