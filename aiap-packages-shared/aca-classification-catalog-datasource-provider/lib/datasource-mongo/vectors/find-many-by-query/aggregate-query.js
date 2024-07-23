/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const {
  addSortCondition,
  addPagination,
} = require('@ibm-aiap/aiap-utils-mongo');

// At this moment not used - include later...
// const _matcher = (context, params) => {
//   const RET_VAL = {
//     $match: {
//       $and: [
//         // ...
//       ]
//     },
//   };
//   return RET_VAL;
// }

const aggregateQuery = (context, params) => {
  const RET_VAL = [];
  // RET_VAL.push(_matcher(context, params));
  RET_VAL.push({
    $facet: {
      items: [
        ...addSortCondition(params),
        ...addPagination(params)
      ],
      total: [
        {
          $count: 'count',
        }
      ]
    }
  });
  RET_VAL.push(
    {
      $set: { tempTotal: { $arrayElemAt: ['$total', 0] } }
    }
  );
  RET_VAL.push(
    {
      $project: {
        items: 1,
        total: { $ifNull: ['$tempTotal.count', 0] },
      }
    }
  );
  return RET_VAL;
}

module.exports = {
  aggregateQuery,
}
