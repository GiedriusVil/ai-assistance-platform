/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const matchFalsePositiveIntents = (
  params: {
    falsePositiveIntents: any,
  },
) => {
  let retVal = {};
  if (
    params?.falsePositiveIntents
  ) {
    retVal = {
      topIntentFalsePositive: true
    };
  }
  return retVal;
}

export {
  matchFalsePositiveIntents,
}
