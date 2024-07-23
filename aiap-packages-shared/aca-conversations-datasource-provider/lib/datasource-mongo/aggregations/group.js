/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const groupAndSum = (sumField, groupValue = 0)  => ({
  $group: {
    _id: groupValue,
    [sumField]: {
      $sum: 1
    }
  }
});

module.exports = {
  groupAndSum
};
