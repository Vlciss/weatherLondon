import {Component, EventEmitter, inject, Input, Output, ViewChild} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {DatePipe, DecimalPipe} from "@angular/common";
import {TransformedWeatherData} from "../../models/transformed-weather-data";
import {WeatherData} from "../../models/weather-data";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DateRange} from "../../models/date-range";
import {MAT_DATE_FORMATS, MatDateFormats, DateAdapter, NativeDateAdapter} from "@angular/material/core";


export class CustomDateAdapter extends NativeDateAdapter {
  override format(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1; // getMonth() začína od 0, preto +1
    return `${this._toTwoDigit(day)}.${this._toTwoDigit(month)}.`;
  }

  private _toTwoDigit(n: number): string {
    return n < 10 ? '0' + n : n.toString();
  }
}

export const CUSTOM_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD.MM.',
  },
  display: {
    dateInput: 'DD.MM.',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

@Component({
  selector: 'app-table',
  standalone: true,
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    DecimalPipe,
    DatePipe,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ]
})


export class TableComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Output()
  searchForHistoricalDate = new EventEmitter<DateRange>();

  @Output()
  resetHistoricalDateSearch = new EventEmitter<void>();

  public displayedColumns: string[] = ['datetime', 'temperature', 'pressure', 'humidity'];

  dataSource: MatTableDataSource<TransformedWeatherData> = new MatTableDataSource<TransformedWeatherData>();

  form: FormGroup;
  fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      dateFrom: [''],
      dateTo: [''],
    })

    this.form.valueChanges.subscribe(() => {
      if (!this.form.controls['dateTo'].value){
        return;
      }

      const dateFrom = new Date(this.form.controls['dateFrom'].value);
      dateFrom.setDate(dateFrom.getDate() + 1);
      const formattedDateFrom = dateFrom.toISOString().split('T')[0];

      const dateTo = new Date(this.form.controls['dateTo'].value);
      dateTo.setDate(dateTo.getDate() + 1);
      const formattedDateTo = dateTo.toISOString().split('T')[0];

      console.log(formattedDateFrom, formattedDateTo);
      this.searchForHistoricalDate.emit({dateFrom: formattedDateFrom, dateTo: formattedDateTo});
    });
  }

  @Input()
  set data(data: WeatherData) {
    this.dataSource.data = data?.hourly.time.map((datetime: string, index: number) => ({
      datetime,
      temperature: data.hourly.temperature_2m[index],
      pressure: data.hourly.surface_pressure[index],
      humidity: data.hourly.relative_humidity_2m[index]
    }));

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
