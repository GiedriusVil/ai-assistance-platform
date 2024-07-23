/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-utils-date-construct-month-list-from-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

export const mapDataToMonthList = (
  monthList: Array<any>,
  data: any,
) => {
  try {
    const RET_VAL = monthList.map((item) => {
      const SEARCH_FOR_DATA_ITEM = (tmpItem) => {
        let retVal = false;

        const ITEM_MONTH = lodash.isString(item?.month) ? parseInt(item?.month) : item?.month;
        const ITEM_YEAR = lodash.isString(item?.year) ? parseInt(item?.year) : item?.year;

        const TMP_ITEM_MONTH = lodash.isString(tmpItem?.month) ? parseInt(tmpItem?.month) : tmpItem?.month;
        const TMP_ITEM_YEAR = lodash.isString(tmpItem?.year) ? parseInt(tmpItem?.year) : tmpItem?.year;

        if (
          ITEM_MONTH + 1 === TMP_ITEM_MONTH &&
          ITEM_YEAR === TMP_ITEM_YEAR
        ) {
          retVal = true;
        }
        return retVal;
      }

      const DATA_ITEM = data.find(SEARCH_FOR_DATA_ITEM);

      let retVal = 0;
      if (
        DATA_ITEM?.count &&
        DATA_ITEM?.count > 0
      ) {
        retVal = DATA_ITEM?.count;
      }
      return retVal;
    });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(mapDataToMonthList.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
