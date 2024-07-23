/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-utils-audit-methods-append-audit-info`;

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

const appendAuditInfo = (
  context: IContextV1,
  object: any,
) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const CONTEXT_USER_NAME = context?.user?.username;
  const OBJECT_CREATED = object?.created;
  const ACTION_DATE = new Date();

  try {
    if (
      lodash.isObject(object)
    ) {
      if (
        lodash.isEmpty(OBJECT_CREATED) ||
        !lodash.isObject(OBJECT_CREATED)
      ) {
        object.created = {
          user: {
            id: CONTEXT_USER_ID,
            name: CONTEXT_USER_NAME,
          },
          date: ACTION_DATE,
        }
      }
      object.updated = {
        user: {
          id: CONTEXT_USER_ID,
          name: CONTEXT_USER_NAME,
        },
        date: ACTION_DATE,
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, object });
    throw ACA_ERROR;
  }
}


export {
  appendAuditInfo,
}
