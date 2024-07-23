/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-classification-catalog-datasource-provider-catalogs-find-many-by-query-aggregate-query`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const {
  addSortCondition,
  addPagination,
  matchAttributeByRegex
} = require('@ibm-aiap/aiap-utils-mongo');


const _matcher = (params) => {
  const FILTER = ramda.path(['filter'], params);
  const FILTER_SEARCH = ramda.path(['search'], FILTER);
  const RET_VAL = {
    $match: {
      $and: [
        {
          $or: [
            matchAttributeByRegex('name', FILTER_SEARCH),
          ]
        }
      ]
    },
  };
  return RET_VAL;
}

const aggregateQuery = (params) => {
  try {
    const RET_VAL = [
      _matcher(params)
    ];
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
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(aggregateQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  aggregateQuery,
}
