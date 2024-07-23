/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  SoeBotV1,
} from '@ibm-aiap/aiap-soe-bot';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

interface ISoeActionTagParamsV1 {
  update: ISoeUpdateV1,
  bot: SoeBotV1,
  attributes: any,
  before: any,
}

export {
  ISoeActionTagParamsV1,
}
