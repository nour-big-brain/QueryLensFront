export interface ChartTheme {
  name: 'light' | 'dark';
  colors: string[];
  background: string;
  labelColor: string;
  gridColor: string;
  gridBorderColor: string;

  // Tooltip styling
  tooltip: {
    background: string;
    textColor: string;
    borderColor: string;
    titleColor: string;
  };

  // Legacy tooltip support
  tooltipTextColor?: string;

  // Legend styling
  legend: {
    textColor: string;
  };

  // Data labels
  dataLabels: {
    textColor: string;
  };

  // Specific chart types
  barColor?: string;
  pieSliceColors?: string[];
  radarFillColor?: string;
  heatmapColors?: string[];
}

// Utility to fetch CSS variable values
function getCssVar(varName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

export const LIGHT_THEME: ChartTheme = {
  name: 'light',
  colors: [
    getCssVar('--chart-color-1'),
    getCssVar('--chart-color-2'),
    getCssVar('--chart-color-3'),
    getCssVar('--chart-color-4')
  ],
  background: getCssVar('--chart-bg'),
  labelColor: getCssVar('--chart-label'),
  gridColor: getCssVar('--chart-grid'),
  gridBorderColor: getCssVar('--chart-grid-border'),

  tooltip: {
    background: getCssVar('--chart-tooltip-bg'),
    textColor: getCssVar('--chart-tooltip-text'),
    borderColor: getCssVar('--border-color'),
    titleColor: getCssVar('--chart-tooltip-title')
  },

  tooltipTextColor: getCssVar('--chart-tooltip-text'),

  legend: {
    textColor: getCssVar('--chart-label')
  },

  dataLabels: {
    textColor: getCssVar('--chart-label')
  },

  barColor: getCssVar('--chart-color-1'),
  pieSliceColors: [
    getCssVar('--chart-color-1'),
    getCssVar('--chart-color-2'),
    getCssVar('--chart-color-3'),
    getCssVar('--chart-color-4')
  ],
  radarFillColor: 'rgba(0,143,251,0.3)',
  heatmapColors: [
    getCssVar('--chart-color-2'),
    getCssVar('--chart-color-1'),
    getCssVar('--chart-color-3'),
    getCssVar('--chart-color-4')
  ]
};

export const DARK_THEME: ChartTheme = {
  name: 'dark',
  colors: [
    getCssVar('--chart-color-1'),
    getCssVar('--chart-color-2'),
    getCssVar('--chart-color-3'),
    getCssVar('--chart-color-4')
  ],
  background: getCssVar('--chart-bg'),
  labelColor: getCssVar('--chart-label'),
  gridColor: getCssVar('--chart-grid'),
  gridBorderColor: getCssVar('--chart-grid-border'),

  tooltip: {
    background: getCssVar('--chart-tooltip-bg'),
    textColor: getCssVar('--chart-tooltip-text'),
    borderColor: getCssVar('--border-color'),
    titleColor: getCssVar('--chart-tooltip-title')
  },

  tooltipTextColor: getCssVar('--chart-tooltip-text'),

  legend: {
    textColor: getCssVar('--chart-label')
  },

  dataLabels: {
    textColor: getCssVar('--chart-label')
  },

  barColor: getCssVar('--chart-color-1'),
  pieSliceColors: [
    getCssVar('--chart-color-1'),
    getCssVar('--chart-color-2'),
    getCssVar('--chart-color-3'),
    getCssVar('--chart-color-4')
  ],
  radarFillColor: 'rgba(102,178,255,0.3)', // slightly blueish fill
  heatmapColors: [
    getCssVar('--chart-color-2'),
    getCssVar('--chart-color-1'),
    getCssVar('--chart-color-3'),
    getCssVar('--chart-color-4')
  ]
};
