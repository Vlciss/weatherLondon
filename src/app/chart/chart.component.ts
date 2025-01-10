import { Component, inject, Input, ViewChild, AfterViewInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { BaseChartDirective } from "ng2-charts";
import { ChartConfiguration, ChartData, ChartType } from "chart.js";
import { WeatherData } from "../../models/weather-data";
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    BaseChartDirective
  ],
  providers: [DatePipe],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent implements AfterViewInit {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  private cdRef = inject(ChangeDetectorRef);
  datePipe = inject(DatePipe);

  chartData?: ChartData<'line'>;

  @Input()
  set data(data: WeatherData) {
    const labels = data?.hourly.time.map((datetime) =>
      this.datePipe.transform(datetime, 'dd/MM hh:mm')
    );

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'London Temperature',
          data: data?.hourly.temperature_2m,
          borderColor: 'rgb(59 130 246)',
          tension: 0.4,
          fill: false,
        }
      ]
    };

    if (this.chart) {
      this.chart.update();
    }
  }

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { autoSkip: true, maxTicksLimit: 10 },
      },
      y: {
        beginAtZero: true,
      }
    }
  };

  public lineChartType: ChartType = 'line';

  ngAfterViewInit(): void {
    this.resizeChart();
  }

  @HostListener('window:resize')
  resizeChart(): void {
    if (this.chart) {
      this.chart.update();
      this.cdRef.detectChanges();
    }
  }
}
