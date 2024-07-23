/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  IQuerySortV1,
} from '@ibm-aiap/aiap--types-server';


export const addMultipleSortConditions = (
  query: {
    sort: IQuerySortV1,
  },
) => {
  const RET_VAL = [];
  const SORT = query?.sort;

  if (
    SORT
  ) {
    const FIELD = SORT?.field;
    const DIRECTION = SORT?.direction;

    if (
      FIELD &&
      DIRECTION
    ) {
      const SORT_CONDITION = {};
      SORT_CONDITION[FIELD] = DIRECTION === 'asc' ? 1 : -1;
      SORT_CONDITION[query?.sort?.fieldSecond] = DIRECTION === 'asc' ? 1 : -1;
      RET_VAL.push({
        $sort: SORT_CONDITION
      });
    }
  }
  return RET_VAL;
}
