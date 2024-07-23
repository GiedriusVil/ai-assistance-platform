/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v1-messages-send-one-for-test';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

// import {
//   ACA_ERROR_TYPE,
//   formatIntoAcaError,
//   throwAcaError,
//   appendDataToError,
// } from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ISendMessageParamsV1,
  ISendMessageResponseV1,
} from '../../types';

import {
  AiServiceClientV1WaV1,
} from '..';

import {
  sendOne,
} from './send-one';

const sendOneForTest = async (
  client: AiServiceClientV1WaV1,
  context: IContextV1,
  params: ISendMessageParamsV1,
): Promise<ISendMessageResponseV1> => {

  const PARAMS = lodash.cloneDeep(params);

  // {
  //   workspaceId: WORKSPACE_ID,
  //     input: { 'text': TEXT },
  //   alternateIntents: true,
  //     context: { 'metadata': { user_id: 'wa-testing-tool' } },
  //   userId: 'wa-testing-tool'
  // }

  // TODO -> LEGO -> FIX later
  const RET_VAL = await sendOne(client, context, PARAMS);
  return RET_VAL;
}

export {
  sendOneForTest,
}
