import { inject, Input, OnInit, ViewChild, Directive, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { ChartTheme, LIGHT_THEME } from './chart-themes';
import { ThemesService } from '../services/themes.service';
import { Subscription } from 'rxjs';
import { ChartPayload } from './chartPayload';
import { style } from '@angular/animations';

@Directive()
export abstract class BaseChartComponent implements OnInit, OnDestroy, OnChanges {
    @Input() payload!: ChartPayload;
    @Input() theme: ChartTheme = LIGHT_THEME;
    @ViewChild('chart') chart!: ChartComponent;

    public chartOptions: any;
    protected themeService = inject(ThemesService);
    private themeSubscription?: Subscription;

    ngOnInit(): void {
        this.themeSubscription = this.themeService.currentTheme$.subscribe((theme) => {
            this.theme = theme;
            // this.updateChartTheme(); removed this since its called twice
        });
        this.updateChartTheme();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['payload'] && !changes['payload'].firstChange) {
            this.updateChartTheme();
        }
    }

    ngOnDestroy(): void {
        this.themeSubscription?.unsubscribe();
    }

    // Common base configuration that all charts share
   protected getBaseChartOptions(): any {
    return {
        chart: {
            background: this.theme.background,
            foreColor: this.theme.labelColor,
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                },
                theme: this.theme.name
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800
            }
        },

        colors: this.theme.colors,

        title: {
            text: this.payload?.title || '',
            align: 'left',
            style: {
                color: this.theme.labelColor,
                fontSize: '16px',
                fontWeight: 600
            }
        },

        xaxis: {
            labels: {
                style: { colors: this.theme.labelColor }
            },
            axisBorder: { color: this.theme.gridBorderColor },
            axisTicks: { color: this.theme.gridBorderColor }
        },

        yaxis: {
            labels: {
                style: { colors: this.theme.labelColor }
            }
        },

        grid: {
            borderColor: this.theme.gridColor,
            strokeDashArray: 4,
            xaxis: { lines: { show: true } },
            yaxis: { lines: { show: true } }
        },

        dataLabels: {
            enabled: false,
            style: {
                colors: [this.theme.dataLabels.textColor],
                fontSize: '12px',
                fontWeight: 500
            },
            background: {
                enabled: true,
                foreColor: this.theme.background,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: this.theme.gridBorderColor,
                opacity: 0.9
            }
        },

        tooltip: {
            enabled: true,
            theme: this.theme.name,
            style: {
                fontSize: '12px',
                color:this.theme.tooltip.textColor
            },
            y: {
                formatter: (value: number) => value?.toFixed(2) || '',
                title: {
                    formatter: (seriesName: string) => seriesName + ':',
                    style: { color: this.theme.tooltip.titleColor }
                }
            },
            marker: { show: true },
            cssClass: this.theme.name === 'dark'
                ? 'apexcharts-tooltip-dark'
                : 'apexcharts-tooltip-light'
        },

        legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'left',
            labels: { colors: this.theme.legend.textColor },
            markers: { fillColors: this.theme.colors }
        },

        stroke: {
            curve: 'smooth',
            width: 2
        }
    };
}


    // Special configuration for specific chart types
    protected getChartTypeSpecificOptions(chartType: string): any {
        switch (chartType) {
            case 'heatmap':
                return {
                    dataLabels: {
                        enabled: true
                    },
                    plotOptions: {
                        heatmap: {
                            shadeIntensity: 0.5,
                            colorScale: {
                                ranges: this.theme.heatmapColors?.map((color, idx) => ({
                                    from: idx * 25,
                                    to: (idx + 1) * 25,
                                    color: color,
                                    name: `Range ${idx + 1}`
                                }))
                            }
                        }
                    },
                    stroke: {
                        width: 1
                    }
                };

            case 'radar':
                return {
                    stroke: {
                        width: 2
                    },
                    fill: {
                        opacity: 0.2,
                        colors: [this.theme.radarFillColor || this.theme.colors[0]]
                    },
                    markers: {
                        size: 4,
                        colors: this.theme.colors,
                        strokeColors: this.theme.background,
                        strokeWidth: 2
                    },
                    plotOptions: {
                        radar: {
                            polygons: {
                                strokeColors: this.theme.gridColor,
                                fill: {
                                    colors: [this.theme.background]
                                }
                            }
                        }
                    }
                };

            case 'pie':
            case 'donut':
                return {
                    colors: this.theme.pieSliceColors || this.theme.colors,
                    dataLabels: {
                        enabled: true,
                        style: {
                            colors: ['#ffffff']
                        }
                    },
                    plotOptions: {
                        pie: {
                            donut: {
                                size: chartType === 'donut' ? '65%' : '0%',
                                labels: {
                                    show: true,
                                    name: {
                                        show: true,
                                        color: this.theme.labelColor
                                    },
                                    value: {
                                        show: true,
                                        color: this.theme.labelColor
                                    },
                                    total: {
                                        show: true,
                                        color: this.theme.labelColor
                                    }
                                }
                            }
                        }
                    },
                    stroke: {
                        width: 2,
                        colors: [this.theme.background]
                    }
                };

            case 'area':
                return {
                    fill: {
                        type: 'gradient',
                        gradient: {
                            shadeIntensity: 1,
                            opacityFrom: 0.7,
                            opacityTo: 0.3,
                            stops: [0, 90, 100]
                        }
                    },
                    stroke: {
                        curve: 'smooth',
                        width: 3
                    }
                };

            case 'bar':
                return {
                    plotOptions: {
                        bar: {
                            borderRadius: 4,
                            horizontal: false,
                            columnWidth: '60%',
                            dataLabels: {
                                position: 'top'
                            }
                        }
                    },
                    dataLabels: {
                        enabled: false
                    }
                };

            case 'scatter':
                return {
                    markers: {
                        size: 6,
                        colors: this.theme.colors,
                        strokeColors: this.theme.background,
                        strokeWidth: 2,
                        hover: {
                            size: 8
                        }
                    },
                    grid: {
                        xaxis: {
                            lines: {
                                show: true
                            }
                        },
                        yaxis: {
                            lines: {
                                show: true
                            }
                        }
                    }
                };

            case 'line':
                return {
                    stroke: {
                        curve: 'smooth',
                        width: 3
                    },
                    markers: {
                        size: 5,
                        colors: this.theme.colors,
                        strokeColors: this.theme.background,
                        strokeWidth: 2,
                        hover: {
                            size: 7
                        }
                    }
                };

            default:
                return {};
        }
    }

    // Each chart component must implement this to transform payload into ApexCharts format
    protected abstract transformPayloadToSeries(): any;

    // Merge base options with specific chart options
    protected updateChartTheme(): void {
        if (!this.payload) return;

        const chartType = this.payload.type;
        const baseOptions = this.getBaseChartOptions();
        const typeSpecificOptions = this.getChartTypeSpecificOptions(chartType);
        const seriesData = this.transformPayloadToSeries();
        
        // Merge in order: base -> type-specific -> series data
        let mergedOptions = this.mergeDeep(baseOptions, typeSpecificOptions);
        mergedOptions = this.mergeDeep(mergedOptions, seriesData);
        
        this.chartOptions = mergedOptions;

        if (this.chart && this.chart.updateOptions) {
            this.chart.updateOptions(this.chartOptions);
        }
    }

    // Deep merge utility
    protected mergeDeep(target: any, source: any): any {
        const output = { ...target };
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(output, { [key]: source[key] });
                    } else {
                        output[key] = this.mergeDeep(target[key], source[key]);
                    }
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    }

    private isObject(item: any): boolean {
        return item && typeof item === 'object' && !Array.isArray(item);
    }
}