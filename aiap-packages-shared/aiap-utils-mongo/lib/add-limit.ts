/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const addLimit = (
  params: {
    limit: any,
  }
) => {
  const RET_VAL = [];
  const LIMIT = params?.limit;
  if (
    LIMIT
  ) {
    RET_VAL.push({
      $limit: Number(LIMIT)
    });
  }
  return RET_VAL;
}

export {
  addLimit,
}
