/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const addTableLookUp = (
  from,
  localField,
  foreignField,
  as,
) => {
  const RET_VAL = [];
  if (
    from &&
    localField &&
    foreignField &&
    as
  ) {
    RET_VAL.push({
      $lookup: {
        from,
        localField,
        foreignField,
        as,
      }
    });
  }
  return RET_VAL;
}


export {
  addTableLookUp,
}
