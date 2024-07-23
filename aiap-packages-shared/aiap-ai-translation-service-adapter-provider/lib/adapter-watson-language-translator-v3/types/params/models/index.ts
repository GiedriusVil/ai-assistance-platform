/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IContextV1,
  IAiTranslationServiceV1,
  IAiTranslationModelV1,
  IAiTranslationModelExampleV1,
  IAiTranslationModelExternalWLTV1,
} from '@ibm-aiap/aiap--types-server';

export interface ICreateOneParamsV1 {
  aiTranslationService: IAiTranslationServiceV1,
  aiTranslationModel: IAiTranslationModelV1,
  aiTranslationModelExamples: Array<IAiTranslationModelExampleV1>,
}

export interface IDeleteManyParamsV1 {
  aiTranslationService: IAiTranslationServiceV1,
  aiTranslationModels: Array<IAiTranslationModelV1>,
}

export interface IDeleteOneParamsV1 {
  aiTranslationService: IAiTranslationServiceV1,
  aiTranslationModel: IAiTranslationModelV1,
}

export interface IGetManyParamsV1 {
  aiTranslationService: IAiTranslationServiceV1,
  aiTranslationModels: Array<IAiTranslationModelV1>,
}

export interface IGetOneParamsV1 {
  aiTranslationService: IAiTranslationServiceV1,
  aiTranslationModel: IAiTranslationModelV1,
}
