import {Component, inject, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TableComponent} from './table/table.component';
import {ChartComponent} from './chart/chart.component';
import {HeatIndexComponent} from './heat-index/heat-index.component';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {WeatherService} from "../services/weather.service";
import {WeatherData} from "../models/weather-data";
import {DateRange} from "../models/date-range";
import {HeaderComponent} from "./header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TableComponent,
    ChartComponent,
    HeatIndexComponent,
    HeaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'wheatherLondon';

  public data!: WeatherData;

  weatherService = inject(WeatherService);

  constructor() {
    this.getWeatherData();
  }

  searchForHistoricalDate(event: DateRange) {
    this.weatherService.getHistoricalWeather(event.dateFrom, event.dateTo).subscribe((data: WeatherData) => {
      this.data = data;
    });
  }

  getWeatherData() {
    this.weatherService.getWeather().subscribe((data: WeatherData) => {
      this.data = data;
    });
  }
}
