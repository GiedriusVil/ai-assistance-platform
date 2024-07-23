/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const setAttribute = (
  field: any,
  value: any,
) => {
  const RET_VAL = {};
  if (
    field &&
    value
  ) {
    RET_VAL['$set'] = {};
    RET_VAL['$set'][field] = value;
  }
  return RET_VAL;
};

export {
  setAttribute,
}
