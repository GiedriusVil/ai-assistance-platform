/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

export interface StaticDimension {
  name: string;
  raw_data_name: string;
  db_name: string;
  ui_order: number;
  data: Array<any>;
}

export interface StaticDimensions {
  enabled?: string;
  values: Array<StaticDimension>;
}

interface Selection {
  name: string;
  db_name: string;
  value: string;
}

export interface StaticDimensionsSelection {
  values: Array<Selection>;
}
