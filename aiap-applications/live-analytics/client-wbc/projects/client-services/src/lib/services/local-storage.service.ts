/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import moment from 'moment';
import * as ramda from 'ramda';

const defaultFilters = () => {
  return {
    dateFrom: moment().subtract(7, 'days').format('MM/DD/YYYY'),
    dateTo: moment().format('MM/DD/YYYY'),
    rangeLength: 'month',
    conversationId: null,
    confidence: 0.5,
    showSystemMessages: true
  };
};

@Injectable()
export class LocalStorageServiceV1 {

  constructor() { }

  set(key: string, data) {
    const temp = this.get(key);
    localStorage.setItem(key, JSON.stringify(ramda.mergeAll([temp, data])));
  }

  get(key: string) {
    let data = JSON.parse(localStorage.getItem(key));
    if (key == 'filters') {
      data = ramda.mergeLeft(data, defaultFilters());
    }
    return data;
  }
}
