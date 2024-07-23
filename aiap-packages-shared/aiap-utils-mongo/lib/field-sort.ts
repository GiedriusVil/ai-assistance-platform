/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/**
 * @deprecated - Deprecated cause of wrong signature -> should follow ->  sort: {field, direction}
 */
const fieldSort = (
  params: {
    field: string,
    sort: string,
  }
) => {
  const RET_VAL = {};
  RET_VAL[params.field] = params.sort === 'asc' ? 1 : -1;
  return RET_VAL;
};

export {
  fieldSort,
};

