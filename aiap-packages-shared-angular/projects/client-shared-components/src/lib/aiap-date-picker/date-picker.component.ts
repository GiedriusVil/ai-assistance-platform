/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { LocalePipe } from "../pipes";
import moment from 'moment-timezone';

@Component({
  selector: 'aiap-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePicker {
  @Input() label: string;
  @Input() class: string;
  @Input() dateFormat: string = "Y-m-d";
  @Input() placeholder: string = "yyyy-mm-dd";
  @Input() theme: string = "light";
  @Input() disabled: boolean = false;


  @Input() timezone: string;

  @Input() set value(value: Date | string) {
    if (!value) {
      this._value = [undefined];
      return;
    }
    
    this._value = [this.localePipe.transform(value, 'YYYY-MM-DDTHH:mm:ss.SSSZZ', this.timezone)];
  }

  @Output() valueChange = new EventEmitter<Date | string>();

  
  _value: (Date | string)[];

  constructor(
    private localePipe: LocalePipe
  ) { }


  onValueChange(event: Date[]) {
    const selectedDate: Date = event[0];
    let date = moment(selectedDate).format('YYYY-MM-DD HH:mm:ss.SSS');
    
    if (this.timezone) {
      date = moment.tz(date, this.timezone).toISOString();
    }

    const DATE = new Date(this.localePipe.transform(date, 'YYYY-MM-DDTHH:mm:ss.SSSZZ', this.timezone));
    this.valueChange.emit(DATE);
  }
}
