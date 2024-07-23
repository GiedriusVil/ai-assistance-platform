/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

/**
 * @sort constructs sort options for a single field
 * @param {*} params
 */
const fieldSort = params => {
  const options = {};
  options[params.field] = params.sort === 'asc' ? 1 : -1;
  return options;
};

module.exports = {
  fieldSort,
};
