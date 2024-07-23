/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/**
 * @sort constructs sort options for a single field
 * @param {*} params
 * @deprecated - Implementation seems to be legacy -> sort should follow -> sort: {field, direction}
 */
const fieldSort = (
  params: {
    sort: string,
    field: string,
  }
) => {
  const options = {};
  options[params.field] = params.sort === 'asc' ? 1 : -1;
  return options;
}

export {
  fieldSort,
}

