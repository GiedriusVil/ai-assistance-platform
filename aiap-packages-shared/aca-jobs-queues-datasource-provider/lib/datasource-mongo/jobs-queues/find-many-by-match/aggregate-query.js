/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-jobs-queues-datasource-provider-jobs-queues-find-many-by-match-aggregate-query`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

const aggregateQuery = (params) => {
  const INPUT = ramda.path(['input'], params);
  const NAME = `$name`;
  const SORT = {
    'jobsQueue.name': 1,
  };

  try {
    const RET_VAL = [
      {
        $match: {
          [NAME]: {
            $regex: INPUT,
            $options: 'i'
          }
        },
      }, {
        $group: {
          _id: {
            catalog: {
              id: '$id',
              name: NAME,
              supplierName: '$supplierName'
            },
          }
        }
      }, {
        $replaceRoot: {
          newRoot: '$_id'
        }
      }, {
        $sort: SORT
      }, {
        $limit: Number(ramda.pathOr(5, ['limit'], params))
      }
    ];

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { params });
    logger.error(aggregateQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

module.exports = {
  aggregateQuery
};
