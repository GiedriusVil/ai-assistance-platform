/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
  IEngagementChangeV1,
  IEngagementV1
} from '@ibm-aiap/aiap--types-server';

import {
  IDeleteEngagementsByIdsParamsV1,
  IDeleteEngagementsByIdsResponseV1,
  IFindEngagementByIdParamsV1,
  IFindEngagementChangeByIdParamsV1,
  IFindEngagementLiteByIdParamsV1,
  IFindEngagementsByQueryParamsV1,
  IFindEngagementsByQueryResponseV1,
  IFindEngagementsChangesByQueryParamsV1,
  IFindEngagementsChangesByQueryResponseV1,
  ISaveEngagementChangeParamsV1,
  ISaveEngagementParamsV1
} from '../params';

export interface IDatasourceEngagementsV1 {
  get engagements(): {
    findOneLiteById(
      context: IContextV1,
      params: IFindEngagementLiteByIdParamsV1,
    ): Promise<IEngagementV1>,
    deleteManyByIds(
      context: IContextV1,
      params: IDeleteEngagementsByIdsParamsV1,
    ): Promise<IDeleteEngagementsByIdsResponseV1>,
    findManyByQuery(
      context: IContextV1,
      params: IFindEngagementsByQueryParamsV1,
    ): Promise<IFindEngagementsByQueryResponseV1>,
    findOneById(
      context: IContextV1,
      params: IFindEngagementByIdParamsV1,
    ): Promise<IEngagementV1>,
    saveOne(
      context: IContextV1,
      params: ISaveEngagementParamsV1,
    ): Promise<IEngagementV1>,
  }

  get engagementsChanges(): {
    findManyByQuery(
      context: IContextV1,
      params: IFindEngagementsChangesByQueryParamsV1,
    ): Promise<IFindEngagementsChangesByQueryResponseV1>,
    findOneById(
      context: IContextV1,
      params: IFindEngagementChangeByIdParamsV1,
    ): Promise<IEngagementChangeV1>,
    saveOne(
      context: IContextV1,
      params: ISaveEngagementChangeParamsV1,
    ): Promise<IEngagementChangeV1>,
  }
}
