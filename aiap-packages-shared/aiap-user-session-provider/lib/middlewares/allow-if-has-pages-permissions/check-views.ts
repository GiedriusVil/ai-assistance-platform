/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'user-session-provider-middlewares-allow-if-has-session-permissions-check-views';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  ACA_ERROR_TYPE,
  createAcaError,
} from '@ibm-aca/aca-utils-errors';

const _exactMatch = (
  view: any,
  allowedViews: any,
) => {
  const RET_VAL = lodash.has(allowedViews, view);
  return RET_VAL;
}

const _partialMatch = (
  view: any,
  allowedViews: any,
) => {
  const RET_VAL = Object.keys(allowedViews)?.some(allowedView => view === allowedView.replace(/V\d+$/, ''))
  return RET_VAL;
}

export const checkViews = (
  permissions: any,
  views: any,
) => {
  let hasAllViews = true;
  let missingView;
  try {
    if (
      !lodash.isEmpty(views) &&
      lodash.isArray(views)
    ) {
      const ALLOWED_VIEWS = permissions?.allowedViews || [];
      for (const VIEW of views) {
        let isViewAllowed = false;

        if (
          VIEW.match(/V\d+$/)
        ) {
          const WITHOUT_VERSION = VIEW.replace(/V\d+$/, '');
          isViewAllowed = _exactMatch(VIEW, ALLOWED_VIEWS) || _exactMatch(WITHOUT_VERSION, ALLOWED_VIEWS);
        } else {
          isViewAllowed = _partialMatch(VIEW, ALLOWED_VIEWS);
        }

        if (
          !isViewAllowed
        ) {
          hasAllViews = false;
          missingView = VIEW;
          break;
        }
      }
      if (
        !hasAllViews
      ) {
        const MESSAGE = `Missing ${missingView} view persmission!`;
        const ACA_ERROR = createAcaError(
          MODULE_ID,
          ACA_ERROR_TYPE.AUTHORIZATION_ERROR,
          MESSAGE
        );
        throw ACA_ERROR;
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(checkViews.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
