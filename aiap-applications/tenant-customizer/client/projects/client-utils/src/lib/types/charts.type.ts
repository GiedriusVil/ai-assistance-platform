/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import { ChartPoint } from 'chart.js';

export interface BasicTimeSeries extends Array<ChartPoint> {}
export interface LabeledTimeSeries {
  label: string;
  data: BasicTimeSeries;
}
export type TimeSeries = BasicTimeSeries | LabeledTimeSeries;
