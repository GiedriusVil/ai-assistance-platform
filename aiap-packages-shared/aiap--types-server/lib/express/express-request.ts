/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import Express from 'express';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IExpressRequestV1 extends Express.Request {
  files?: Array<any>;
}
