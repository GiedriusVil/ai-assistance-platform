/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-rules-datasource-provider-utils-convert-date-strings-to-date';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const convertDateStringsToDate = async (item) => {
    if(!lodash.isEmpty(item)){
        if(!lodash.isEmpty(item.expires)){
            item.expires = new Date(item.expires);
        }
        if(!lodash.isEmpty(item.effective)){
            item.effective = new Date(item.effective);
        }
    }
    return item;
}

module.exports = {
    convertDateStringsToDate,
  }
  
