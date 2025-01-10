import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AsyncPipe, DecimalPipe} from "@angular/common";
import {combineLatest, map, Observable, startWith} from "rxjs";



@Component({
  selector: 'app-heat-index',
  standalone: true,
  imports: [
    FormsModule,
    DecimalPipe,
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './heat-index.component.html',
  styleUrl: './heat-index.component.css'
})
export class HeatIndexComponent {
  form: FormGroup;
  fb = new FormBuilder();

  heatIndex$: Observable<number>;
  isCelsius: boolean = true;

  constructor() {
    this.form = this.fb.group({
      temperature: [this.isCelsius ? 26.7 : 80],
      relativeHumidity: [50],
    });

    this.heatIndex$ = combineLatest([
      this.form.get('temperature')!.valueChanges.pipe(startWith(this.form.get('temperature')!.value)),
      this.form.get('relativeHumidity')!.valueChanges.pipe(startWith(this.form.get('relativeHumidity')!.value)),
    ]).pipe(
      map(([temperature, relativeHumidity]) => {
        if ((this.isCelsius && temperature < 26.7) || (!this.isCelsius && temperature < 80)) {
          return 0;
        }
        const T = this.isCelsius ? (temperature * 9) / 5 + 32 : temperature;
        const RH = relativeHumidity;

        const HI =
          -42.379 +
          2.04901523 * T +
          10.14333127 * RH -
          0.22475541 * T * RH -
          6.83783 * Math.pow(10, -3) * Math.pow(T, 2) -
          5.481717 * Math.pow(10, -2) * Math.pow(RH, 2) +
          1.22874 * Math.pow(10, -3) * Math.pow(T, 2) * RH +
          8.5282 * Math.pow(10, -4) * T * Math.pow(RH, 2) -
          1.99 * Math.pow(10, -6) * Math.pow(T, 2) * Math.pow(RH, 2);

        return this.isCelsius ? ((HI - 32) * 5) / 9 : HI;
      })
    );
  }

  convertUnit() {
    if (this.isCelsius) {
      this.form.controls['temperature'].patchValue(this.form.controls['temperature'].value * 9 / 5 + 32); // °C to °F
    } else {
      this.form.controls['temperature'].patchValue((this.form.controls['temperature'].value - 32) * 5 / 9); // °F to °C
    }
    this.isCelsius = !this.isCelsius;
  }
}
