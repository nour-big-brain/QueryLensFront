export interface ChartPayload {
  title: string;                // Chart title
  type: 'bar' | 'line' | 'area' | 'pie' | 'donut' | 'radar' | 'scatter' | 'heatmap' | 'mixed'; // restricts allowed chart types
  categories?: string[];        // X-axis labels (for bar/line/area)
  labels?: string[];            // Labels for pie/donut charts
  series?: {                    // Data series
    name: string;
    values: number[];
  }[];
  description?: string;         // Optional chart subtitle or details
}

