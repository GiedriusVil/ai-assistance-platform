/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `release-assistant-2023-03-30-doc-validations-group-audits`;

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const groupAudits = (audits) => {
  const RET_VAL = {};
  audits.forEach((audit) => {
    const KEY = _generateAuditKey(audit);

    if (lodash.isEmpty(RET_VAL[KEY])) {
      RET_VAL[KEY] = [];
    }

    RET_VAL[KEY].push(audit);
  });

  return RET_VAL;
}

const _generateAuditKey = (audit) => {
  const RET_VAL = `${audit.docNumber}:${audit.docExtId}`;
  return RET_VAL;
}

module.exports = {
  groupAudits,
};
