/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

export const constructQueryDateRangeFromRequest = (
  request: any,
) => {
  let retVal;
  const DATE_FROM = request?.query?.from;
  const DATE_TO = request?.query?.to;
  if (
    !lodash.isEmpty(DATE_FROM) &&
    !lodash.isEmpty(DATE_TO)
  ) {
    retVal = {
      from: DATE_FROM,
      to: DATE_TO
    };
  }
  return retVal;
}
