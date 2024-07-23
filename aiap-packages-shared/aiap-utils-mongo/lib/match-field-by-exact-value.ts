/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import ramda from '@ibm-aca/aca-wrapper-ramda';

const matchFieldByExactValue = (
  field: string,
  filter: any,
  options: any,
) => {
  const RET_VAL = {};
  const IS_STRICT_MATCH = ramda.path(['strict', field], options);
  const FIELD_VALUE = ramda.path([field], filter);
  if (
    IS_STRICT_MATCH
  ) {
    RET_VAL[field] = { $eq: FIELD_VALUE };
  } else if (
    FIELD_VALUE
  ) {
    RET_VAL[field] = { $eq: FIELD_VALUE };
  }
  return RET_VAL;
};

export {
  matchFieldByExactValue,
}
