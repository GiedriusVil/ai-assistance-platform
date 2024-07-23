/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import lodash from '@ibm-aca/aca-wrapper-lodash';

export const compare2Strings = (
  strA: string,
  strB: string,
) => {
  if (
    !lodash.isString(strA)
  ) {
    throw new Error(`Provided paramater [strA: ${strA}] must be typeof String!`);
  }
  if (
    !lodash.isString(strB)
  ) {
    throw new Error(`Provided paramater [strA: ${strB}] must be typeof String!`);
  }
}
