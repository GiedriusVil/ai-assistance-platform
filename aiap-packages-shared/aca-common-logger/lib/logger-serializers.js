/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { dataMaskingService } = require('@ibm-aca/aca-data-masking-provider');

function replaceByPattern(update) {
  if (!lodash.isEmpty(update?.message?.text)) {
    const TENANT_ID = update?.gAcaProps?.tenantId;
    const OPTIONS = {
      tenantId: TENANT_ID,
    };
    update.message.text = dataMaskingService.mask(update?.message?.text, OPTIONS);
  }
}

const clone = (update) => {
  const RET_VAL = ramda.compose(
    ramda.omit(['raw']),
    lodash.cloneDeep
  )(update);
  return RET_VAL;
}

const cloneAndGetFresh = (update) => {
  const upd = clone(update);
  if (
    typeof update.getTraceId === 'function'
  ) {
    upd.traceId = update.getTraceId(update);
  }
  return upd;
}

const update = (update) => {
  const upd = cloneAndGetFresh(update);
  replaceByPattern(upd);
  return upd;
}

const trace = (update) => {
  const RET_VAL = { ...cloneAndGetFresh(update).traceId };
  return RET_VAL;
}

module.exports = {
  update,
  trace,
};
