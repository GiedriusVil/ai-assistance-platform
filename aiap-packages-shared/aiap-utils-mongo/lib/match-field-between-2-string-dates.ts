/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

/**
 * @matcher filters items where timestamp value is between dates
 * @param field name of field in structure
 * @param {*} params query params
 */
const matchFieldBetween2StringDates = (
  field: string,
  params: {
    queryDate: {
      from: any,
      to: any,
    }
  },
) => {
  const RET_VAL = {};

  const DATE_FROM = params?.queryDate?.from;
  const DATE_TO = params?.queryDate?.to;

  if (
    DATE_FROM &&
    DATE_TO
  ) {
    RET_VAL[field] = {};

    if (
      DATE_FROM
    ) {
      RET_VAL[field].$gte = DATE_FROM;
    }

    if (
      DATE_TO
    ) {
      RET_VAL[field].$lte = DATE_TO;
    }
  }
  return RET_VAL;
}

export {
  matchFieldBetween2StringDates,
} 
