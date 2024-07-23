/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `release-assistant-2023-03-30-doc-validations-add-action-id`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { ACTIONS } = require('./utils');

const { throwAcaError, formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const uuid = require('uuid/v4');

const addActionId = (audits) => {
  try {
    const AUDITS = lodash.cloneDeep(audits);

    const ACTION_TO_INDEX= Object.keys(ACTIONS).reduce((a, v, ind) => ({ ...a, [v]: ind}), {});

    let rollingActionIndex = -1;
    let actionId = uuid();

    for (const AUDIT of AUDITS) {

      const AUDIT_ACTION_INDEX = ACTION_TO_INDEX[AUDIT.action];
      if (
        (rollingActionIndex + 1) % 4 === AUDIT_ACTION_INDEX ||
        AUDIT_ACTION_INDEX === 0
      ) {
        rollingActionIndex = AUDIT_ACTION_INDEX;
        AUDIT.actionId = actionId;

      } else {
        const MESSAGE = `Encountered issues when checkin transaction consistency.`;
        throwAcaError(MODULE_ID, 'INCONSISTENCY_ERROR', MESSAGE, {rollingIndex: rollingActionIndex, nextIndex: AUDIT_ACTION_INDEX});
      }

      if (rollingActionIndex === 3) {
        actionId = uuid();
      }
    }

    return AUDITS;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(addActionId.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  addActionId,
};
