/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

import {
  IAiServiceV1,
  IAiServiceRequestV1,
  IAiServiceResponseV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

export interface IConstructRequestForConfidenceCheckParamsV1 {
  text: string,
  update: ISoeUpdateV1,
  aiService: IAiServiceV1,
}

export interface IConstructRequestParamsV1 {
  update: ISoeUpdateV1,
}

export interface ISendRequestForConfidenceCheckParamsV1 {
  aiService: IAiServiceV1,
  aiServiceRequest: IAiServiceRequestV1,
}

export interface ISendRequestParamsV1 {
  aiService: IAiServiceV1,
  aiServiceRequest: IAiServiceRequestV1,
}

export interface IFormatResponseParamsV1 {
  aiServiceResponse: IAiServiceResponseV1,
}

export interface IFormatResponseResponseV1 {
  text: string,
}

export interface IRetrieveConfidenceParamsV1 {
  update: ISoeUpdateV1,
  aiServiceResponse: IAiServiceResponseV1,
}

export interface IRetrieveConfidenceResponseV1 {
  confidence: number,
}

export interface IRetrieveContextParamsV1 {
  update: ISoeUpdateV1,
  aiServiceResponse: IAiServiceResponseV1,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRetrieveContextResponseV1 {

}

export interface IRetrieveIntentsParamsV1 {
  update: ISoeUpdateV1,
  aiServiceResponse: IAiServiceResponseV1,
}


export interface IRetrieveIntentsResponseV1 {
  intents: any,
}

export interface IRetrieveStateParamsV1 {
  update: ISoeUpdateV1,
  aiServiceResponse: IAiServiceResponseV1,
}

export interface IStateIsBranchExitParamsV1 {
  update: ISoeUpdateV1,
}

export interface IStateIsBranchExitResponseV1 {
  value: boolean,
}
