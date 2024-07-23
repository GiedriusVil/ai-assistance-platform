/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Cell,
} from '@maxgraph/core';

export class MaxGraphBaseCell extends Cell {

  static getClassName() {
    return 'MaxGraphBaseCell';
  }

  public configuration: any;
  public data: any;

}
