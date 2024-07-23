/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const _retrieveFieldNameFromSort = (
  sort: {
    field: string,
  }
) => {
  let retVal = sort?.field;
  if (
    'id' === retVal
  ) {
    retVal = '_id';
  }
  return retVal;
}

const addSortCondition = (
  params: {
    sort?: {
      field: string,
      direction: string,
    }
  }
) => {
  const RET_VAL = [];
  const SORT = params?.sort;
  if (
    SORT
  ) {
    const FIELD = _retrieveFieldNameFromSort(SORT);
    const DIRECTION = SORT?.direction;
    if (
      FIELD &&
      DIRECTION
    ) {
      const SORT_CONDITION = {};
      SORT_CONDITION[FIELD] = DIRECTION === 'asc' ? 1 : -1;
      RET_VAL.push({
        $sort: SORT_CONDITION
      });
    }
  }
  return RET_VAL;
}

export {
  addSortCondition,
}
