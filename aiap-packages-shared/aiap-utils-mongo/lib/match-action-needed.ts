/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const matchActionNeeded = (
  params: {
    actionNeeded: any,
  }
) => {
  const RET_VAL: any = {};
  if (
    params?.actionNeeded
  ) {
    RET_VAL.dialogNodes = 'Anything else';
  }
  return RET_VAL;
}

export {
  matchActionNeeded,
}
