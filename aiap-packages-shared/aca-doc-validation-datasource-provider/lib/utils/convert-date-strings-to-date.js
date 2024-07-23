/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-doc-validation-datasource-provider-utils-convert-date-strings-to-date';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const convertDateStringsToDate = async (item) => {
    if(!lodash.isEmpty(item)){
        if(!lodash.isEmpty(item.expirationDate)){
            item.expirationDate = new Date(item.expirationDate);
        }
        if(!lodash.isEmpty(item.effectiveDate)){
            item.effectiveDate = new Date(item.effectiveDate);
        }
    }
    return item;
}

module.exports = {
    convertDateStringsToDate,
  }
  
