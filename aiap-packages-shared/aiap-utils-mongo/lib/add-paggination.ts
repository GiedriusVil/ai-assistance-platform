/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const addPagination = (
  params: {
    pagination: {
      page: any,
      size: any,
    }
  }
) => {
  const RET_VAL = [];
  const PAGINATION = params?.pagination;

  if (
    PAGINATION
  ) {
    const PAGE = PAGINATION?.page;
    const SIZE = PAGINATION?.size;
    if (
      PAGE &&
      SIZE
    ) {
      RET_VAL.push({
        $skip: (Number(PAGE) - 1) * Number(SIZE)
      });
    }
    if (
      SIZE
    ) {
      RET_VAL.push({
        $limit: Number(SIZE)
      });
    }
  }
  return RET_VAL;
}

export {
  addPagination,
}
