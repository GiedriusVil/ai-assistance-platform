/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const matchFeedbackIds = (
  params: {
    score: any,
  },
  ids: Array<any>,
) => {
  let retVal = {};
  if (
    params?.score &&
    ids
  ) {
    retVal = {
      _id: {
        $in: ids
      }
    };
  }
  return retVal;
}

export {
  matchFeedbackIds,
}
