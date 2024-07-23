/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

const handler = (
  flatHandler: {
    name: any,
    method: any,
  }
) => {
  const RET_VAL = {
    name: flatHandler?.name,
    method: flatHandler?.method,
  }
  return RET_VAL;
}

const handlers = (
  flatHandlers: Array<any>,
) => {
  const RET_VAL = [];
  if (
    lodash.isArray(flatHandlers) &&
    !lodash.isEmpty(flatHandlers)
  ) {
    for (const FLAT_HANDLER of flatHandlers) {
      if (
        !lodash.isEmpty(FLAT_HANDLER)
      ) {
        RET_VAL.push(handler(FLAT_HANDLER));
      }
    }
  }
  return RET_VAL;
}

export const transformRawConfiguration = async (
  rawConfiguration: any,
  provider: any,
) => {
  const HANDLERS_FLAT = provider.getKeys(
    'TENANT_EVENT_STREAM_HANDLER',
    [
      'NAME',
      'METHOD',
    ]
  );
  const HANDLERS = handlers(HANDLERS_FLAT);
  const RET_VAL = provider.isEnabled('TENANT_EVENT_STREAM_HANDLER_ENABLED', false, {
    handlers: HANDLERS,
  });
  return RET_VAL;
}
