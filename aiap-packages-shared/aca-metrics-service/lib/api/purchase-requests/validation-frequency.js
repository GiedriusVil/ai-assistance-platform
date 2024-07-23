/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-metrics-service-purchase-requests-validation-frequency';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaMetricsDatasourceByContext } = require('@ibm-aca/aca-metrics-datasource-provider');
const { getAcaOrganizationsDatasourceByContext } = require('@ibm-aca/aca-organizations-datasource-provider');

const PERCENTAGE_FULL_SHARE = 100;
const DEFAULT_PERCENTAGE_PRECISION = 1;
const _round = ( number ) => parseFloat( parseFloat( number ).toFixed( DEFAULT_PERCENTAGE_PRECISION ) );
const _percentage = (partialValue, totalValue) => _round((PERCENTAGE_FULL_SHARE * partialValue) / totalValue);

const _calculatePercentages = (ranges) => {
  const RET_VAL = [];
  const ALL_RANGES_TOTAL = lodash.sumBy(ranges, r => r.count);

  for (let range of ranges) {
    const RANGE_NAME = ramda.path(['range'], range);
    const RANGE_COUNT = ramda.path(['count'], range);
    const RANGE_PERCENTAGE = _percentage(RANGE_COUNT, ALL_RANGES_TOTAL);

    RET_VAL[RANGE_NAME] = {
      'count': RANGE_COUNT,
      'percentage': RANGE_PERCENTAGE
    };
  }

  return RET_VAL;
}

const validationFrequency = async (context, params) => {
    const RET_VAL = {
      items: [],
    };
    try {
        const METRICS_DATASOURCE = getAcaMetricsDatasourceByContext(context);
        const FREQUENCIES_BY_BUYER = await METRICS_DATASOURCE.purchaseRequests.validationFrequency(context, params);
        const ORGANIZATIONS_DATASOURCE = getAcaOrganizationsDatasourceByContext(context);

        for (let frequency of FREQUENCIES_BY_BUYER) {

            const BUYER_ID = ramda.path(['_id'], frequency);
            const RANGES_ARR = ramda.path(['ranges'], frequency);
            const RANGES_OBJ = _calculatePercentages(RANGES_ARR);
            const ORGANIZATION = await ORGANIZATIONS_DATASOURCE.organizations.findOneById(context, {'id': BUYER_ID});
            const BUYER_NAME = ramda.path(['name'], ORGANIZATION);

            RET_VAL.items.push({
              'buyer': BUYER_ID,
              'buyerName': BUYER_NAME,
              ...RANGES_OBJ,
            });
        }

        return RET_VAL;
    } catch(error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', {ACA_ERROR});
        throw ACA_ERROR;
    }
}

module.exports = {
    validationFrequency,
}
