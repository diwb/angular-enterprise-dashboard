import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
  type GridComponentOption,
  type LegendComponentOption,
  type TooltipComponentOption,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { BarSeriesOption, LineSeriesOption, PieSeriesOption } from 'echarts/charts';
import type { ComposeOption, ECharts } from 'echarts/core';

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
]);

type ChartOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | PieSeriesOption
  | GridComponentOption
  | TooltipComponentOption
  | LegendComponentOption
>;

@Component({
  selector: 'app-chart-card',
  template: `
    <section class="card chart-card">
      <div class="section-heading">
        <div>
          <p class="eyebrow">{{ eyebrow }}</p>
          <h2>{{ title }}</h2>
        </div>
      </div>
      <div #chart class="chart" role="img" [attr.aria-label]="summary"></div>
      <p class="sr-only">{{ summary }}</p>
    </section>
  `,
})
export class ChartCardComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) title = '';
  @Input() eyebrow = 'Analytics';
  @Input({ required: true }) labels: string[] = [];
  @Input({ required: true }) values: number[] = [];
  @Input() type: 'line' | 'bar' | 'pie' = 'line';
  @Input() summary = 'Chart summary unavailable.';
  @ViewChild('chart', { static: true }) private readonly chartRef?: ElementRef<HTMLDivElement>;

  private readonly platformId = inject(PLATFORM_ID);
  private chart?: ECharts;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !this.chartRef) return;
    this.chart = echarts.init(this.chartRef.nativeElement, undefined, { renderer: 'canvas' });
    this.render();
  }

  ngOnChanges(_: SimpleChanges): void {
    this.render();
  }

  ngOnDestroy(): void {
    this.chart?.dispose();
  }

  private render(): void {
    if (!this.chart) return;
    const option: ChartOption =
      this.type === 'pie'
        ? {
            tooltip: {},
            legend: { bottom: 0 },
            series: [
              {
                type: 'pie',
                radius: ['45%', '70%'],
                data: this.labels.map((name, index) => ({ name, value: this.values[index] ?? 0 })),
              },
            ],
          }
        : {
            tooltip: {},
            grid: { left: 32, right: 16, top: 24, bottom: 32 },
            xAxis: { type: 'category', data: this.labels },
            yAxis: { type: 'value' },
            series: [
              {
                type: this.type,
                data: this.values,
                smooth: this.type === 'line',
                areaStyle: this.type === 'line' ? {} : undefined,
              },
            ],
          };
    this.chart.setOption(option);
  }
}
