/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

export interface IHasFuncFindOneByIdV1 {
  findOneById(
    context: IContextV1,
    params: {
      id: string,
    },
  ): Promise<any>;
}
