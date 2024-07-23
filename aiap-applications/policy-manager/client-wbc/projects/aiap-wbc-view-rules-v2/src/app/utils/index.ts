/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import * as lodash from 'lodash';


export const RULES_CONDITION_VALUE_TYPE = {
  none: 'none',
  string: 'string',
  number: 'number',
  wbc: 'wbc',
  date: 'date',
};

export function isAnArray(value: string) {
  let retVal;

  try {
    const PARSED_VALUE = JSON.parse(value);
    retVal = lodash.isArray(PARSED_VALUE);
  } catch (error) {
    retVal = false;
  }

  return retVal;
}

export const ARRAY_OPERATORS = [
  'notIn',
  'in'
]
