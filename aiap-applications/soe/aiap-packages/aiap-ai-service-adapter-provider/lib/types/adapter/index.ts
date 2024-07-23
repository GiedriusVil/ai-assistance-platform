/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-adapter-provider-adapter';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const EventEmitter = require('events');

import {
  IAiServiceRequestV1,
  IAiServiceResponseV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeContextV1,
  ISoeUpdateSessionStateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  // request
  IConstructRequestForConfidenceCheckParamsV1,
  IConstructRequestParamsV1,
  ISendRequestForConfidenceCheckParamsV1,
  ISendRequestParamsV1,
  // response
  IFormatResponseParamsV1,
  IFormatResponseResponseV1,
  IRetrieveConfidenceParamsV1,
  IRetrieveConfidenceResponseV1,
  IRetrieveContextParamsV1,
  IRetrieveContextResponseV1,
  IRetrieveIntentsParamsV1,
  IRetrieveIntentsResponseV1,
  IRetrieveStateParamsV1,
  // state
  IStateIsBranchExitParamsV1,
  IStateIsBranchExitResponseV1,
} from '../params'

interface IAiServiceAdapterV1 {

  get request(): {
    constructOneForConfidenceCheck(
      context: ISoeContextV1,
      params: IConstructRequestForConfidenceCheckParamsV1,
    ): Promise<IAiServiceRequestV1>,
    constructOne(
      context: ISoeContextV1,
      params: IConstructRequestParamsV1,
    ): Promise<IAiServiceRequestV1>,
    sendOneForConfidenceCheck(
      context: ISoeContextV1,
      params: ISendRequestForConfidenceCheckParamsV1,
    ): Promise<IAiServiceResponseV1>,
    sendOne(
      context: ISoeContextV1,
      params: ISendRequestParamsV1,
    ): Promise<IAiServiceResponseV1>,
  }

  get response(): {
    formatOne(
      context: ISoeContextV1,
      params: IFormatResponseParamsV1,
    ): Promise<IFormatResponseResponseV1>,
    retrieveConfidence(
      context: ISoeContextV1,
      params: IRetrieveConfidenceParamsV1,
    ): Promise<IRetrieveConfidenceResponseV1>,
    retrieveContext(
      context: ISoeContextV1,
      params: IRetrieveContextParamsV1,
    ): Promise<IRetrieveContextResponseV1>,
    retrieveIntents(
      context: ISoeContextV1,
      params: IRetrieveIntentsParamsV1,
    ): Promise<IRetrieveIntentsResponseV1>,
    retrieveState(
      context: ISoeContextV1,
      params: IRetrieveStateParamsV1,
    ): Promise<ISoeUpdateSessionStateV1>,
  }

  get state(): {
    isBranchExit(
      context: ISoeContextV1,
      params: IStateIsBranchExitParamsV1,
    ): Promise<IStateIsBranchExitResponseV1>,
  }

}

abstract class AiServiceAdapterV1 extends EventEmitter {

}

export {
  AiServiceAdapterV1,
  IAiServiceAdapterV1,
}
