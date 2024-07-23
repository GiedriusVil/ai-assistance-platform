/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IExpressRequestV1,
} from './express-request';

export interface IExpressRequestWithFileV1 extends IExpressRequestV1 {
  file: any;
}
