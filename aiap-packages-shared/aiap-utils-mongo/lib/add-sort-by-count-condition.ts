/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const addSortByCountCondition = (
  params: {
    sort: {
      field: string,
      direction: string,
    }
  }
): Array<any> => {
  const RET_VAL = [];
  const SORT = params?.sort;
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
      RET_VAL.push({
        $sortByCount: SORT_CONDITION
      });
    }
  }
  return RET_VAL;
}

export {
  addSortByCountCondition,
}
