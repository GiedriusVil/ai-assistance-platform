/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'DecimalPlaces',
})
export class DecimalPlacesPipe implements PipeTransform {
  transform(value: any, places?: number): any {
    if (typeof value !== 'number') return value;
    places = places ? places : 2;
    const multiplier = Math.pow(10, places);
    value = Math.round(value * multiplier) / multiplier;
    return value;
  }
}
