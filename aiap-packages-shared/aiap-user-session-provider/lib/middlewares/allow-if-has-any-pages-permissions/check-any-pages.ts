/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'user-session-provider-middlewares-allow-if-has-any-pages-permissions-check-any-pages';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

export const checkAnyPages = (
  permissions: any,
  pages: any,
) => {
  try {
    if (
      !lodash.isEmpty(pages) &&
      lodash.isArray(pages)
    ) {
      const ALLOWED_PAGES = ramda.pathOr([], ['allowedPages'], permissions);
      let hasAnyPages = false;

      for (const PAGE of pages) {
        const IS_PAGE_ALLOWED = lodash.has(ALLOWED_PAGES, PAGE);
        if (
          IS_PAGE_ALLOWED
        ) {
          hasAnyPages = true;
          break;
        }
      }
      if (
        !hasAnyPages
      ) {
        const ACA_ERROR = {
          type: ACA_ERROR_TYPE.AUTHORIZATION_ERROR,
          message: `[${MODULE_ID}] Missing any ${pages} page permission!`
        };
        throw ACA_ERROR;
      }
    }
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(checkAnyPages.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
