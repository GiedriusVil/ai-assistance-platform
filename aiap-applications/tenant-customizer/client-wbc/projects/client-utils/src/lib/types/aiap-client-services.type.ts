/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export interface ExcelJson {
  data: Array<any>;
  header?: Array<string>;
  skipHeader?: boolean;
  origin?: string | number;
}
