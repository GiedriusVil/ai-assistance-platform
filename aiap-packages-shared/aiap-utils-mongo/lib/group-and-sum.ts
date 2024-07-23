/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/**
 * 
 * @param sumField 
 * @param groupValue 
 * @returns 
 * 
 * @deprecated -> Strange implementation does not follow used principles!
 */
const groupAndSum = (
  sumField: string,
  groupValue: number = 0,
) => ({
  $group: {
    _id: groupValue,
    [sumField]: {
      $sum: 1
    }
  }
});

export {
  groupAndSum,
}

