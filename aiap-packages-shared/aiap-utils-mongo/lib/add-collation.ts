/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-mongo-utils-add-collation';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

/**
 * Add collation to aggregated query to sort uppercase text as lowercase text
 * Collation allows users to specify language-specific rules for string comparison, such as rules for lettercase and accent marks
 * After method call the spread operator for aggregate() should be used
 * @param {*} params aggregated query
 */
const addCollation = (
  params: any,
) => {
  const RET_VAL = [];
  if (
    params
  ) {
    const COLLATION = {
      'collation': {
        'locale': 'en',
      }
    };
    RET_VAL.push(params);
    RET_VAL.push(COLLATION);
  }

  return RET_VAL;
};

export {
  addCollation
}
