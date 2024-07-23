/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-buy-rules-engine-provider-json-rule-engine-operator-array-does-not-contain';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

class ArrayDoesNotContainOperator {

  static NAME = 'arrayDoesNotContain';

  static executor(fact, expect) {
		try {
			if (!lodash.isArray(fact)) {
				return false;
			}
      const RET_VAL = fact.every(val => {
				const CAN_INCLUDE = lodash.isArray(val) || lodash.isString(val);
				return CAN_INCLUDE && !val.includes(expect)
			})
			return RET_VAL;
		} catch (error) {
			const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
			logger.info('executor', { ACA_ERROR });
			throw ACA_ERROR;
		}
	}
}

module.exports = {
    ArrayDoesNotContainOperator,
}
