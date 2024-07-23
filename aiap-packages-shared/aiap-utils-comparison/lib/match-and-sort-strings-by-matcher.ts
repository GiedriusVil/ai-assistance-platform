/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const stringComparison = require('string-comparison');

export const matchAndSortStringsByMatcher = (
  values: any,
  matcher: any,
) => {
  const RET_VAL = stringComparison.cosine.sortMatch(matcher, values);
  return RET_VAL;
}
