/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

import { transformStringToDate } from '@ibm-aiap/aiap-utils-date';

/**
 * @matcher filters items where timestamp value is between dates
 * @param field name of field in structure
 * @param {*} params query params
 */
const matchFieldBetween2Dates = (
  field: any,
  params: {
    queryDate?: any,
    dateRange?: any,
    query?: {
      filter?: {
        dateRange?: any,
      }
    }
  }
) => {
  const RET_VAL = {};
  const DATE_RANGE = params?.queryDate || params?.dateRange || params?.query?.filter?.dateRange;
  let dateFrom;
  let dateTo;
  if (
    !lodash.isEmpty(DATE_RANGE) &&
    lodash.isArray(DATE_RANGE) &&
    DATE_RANGE.length > 1
  ) {
    dateFrom = DATE_RANGE[0];
    dateTo = DATE_RANGE[1];
  } else if (
    !lodash.isEmpty(DATE_RANGE) &&
    lodash.isObject(DATE_RANGE)
  ) {
    dateFrom = DATE_RANGE?.from;
    dateTo = DATE_RANGE?.to;
  }

  if (
    !lodash.isEmpty(dateFrom) ||
    lodash.isDate(dateFrom) ||
    !lodash.isEmpty(dateTo) ||
    lodash.isDate(dateTo)
  ) {
    RET_VAL[field] = {};
    if (
      lodash.isDate(dateFrom)
    ) {
      RET_VAL[field].$gte = dateFrom;
    } else if (
      !lodash.isEmpty(dateFrom)
    ) {
      RET_VAL[field].$gte = transformStringToDate(dateFrom); // moment(params.queryDate.from).toDate();
    }

    if (
      lodash.isDate(dateTo)
    ) {
      RET_VAL[field].$lte = dateTo;
    } else if (
      !lodash.isEmpty(dateTo)
    ) {
      RET_VAL[field].$lte = transformStringToDate(dateTo);
    }
  }
  return RET_VAL;
}

export {
  matchFieldBetween2Dates,
}
