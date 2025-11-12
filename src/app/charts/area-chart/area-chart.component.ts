import { Component, inject, Input, ViewChild, OnInit } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { ChartTheme, LIGHT_THEME } from '../chart-themes';
import { ThemesService } from '../../services/themes.service';
import { BaseChartComponent } from '../base-chart.component';

@Component({
  selector: 'app-area-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.css','../chart-common.css']
})
export class AreaChartComponent extends BaseChartComponent {
  protected override transformPayloadToSeries(): any {
    if (!this.payload) return {};

    return {
      series: this.payload.series?.map(s => ({
        name: s.name,
        data: s.values
      })) || [],
      chart: {
        type: 'area',
        height: 350,
      },
      xaxis: {
        categories: this.payload.categories || [],
      },
      title: {
        text: this.payload.title || '',
      }
    };
  }
}
