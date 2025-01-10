import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, take} from 'rxjs';
import {WeatherData} from "../models/weather-data";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private readonly apiUrl = 'https://api.open-meteo.com/v1/';

  http = inject(HttpClient);

  getWeather(): Observable<WeatherData> {
    return this.http.get<WeatherData>(this.apiUrl + 'forecast?' +
      'latitude=51.5085&longitude=-0.1257&hourly=temperature_2m,relative_humidity_2m,surface_pressure' +
      '&timezone=Europe%2FBerlin&past_days=7&forecast_days=4').pipe(take(1));
  }

  getHistoricalWeather(from: string, to: string): Observable<WeatherData> {
    return this.http.get<WeatherData>('https://archive-api.open-meteo.com/v1/era5?latitude=52.52&longitude=13.41&start_date='+from+'&end_date='+to+'&hourly=temperature_2m,relative_humidity_2m,surface_pressure').pipe(take(1));
  }
}
