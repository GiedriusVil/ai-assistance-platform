/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import {Injectable} from '@angular/core';
import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '-';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    let day;
    let month;
    if(date){
      if (date.day < 10) {
        day = '0' + date.day;
      } else {
        day = date.day;
      }
      if (date.month < 10) {
        month = '0' + date.month;
      } else {
        month = date.month;
      }
    }
    return date ? day + this.DELIMITER + month + this.DELIMITER + date.year : '';
  }
}