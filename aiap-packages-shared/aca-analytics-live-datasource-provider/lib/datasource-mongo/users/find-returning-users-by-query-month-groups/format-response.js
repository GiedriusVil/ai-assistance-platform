/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const formatResponse = (records) => {
    const RET_VAL = [];
    if (
        !lodash.isEmpty(records) && 
        lodash.isArray(records)
    ) {
      for (let record of records) {
        let index = RET_VAL.findIndex(resultObject => resultObject.month === record.month && resultObject.year === record.year)
        if (index === -1) {
          RET_VAL.push(record);
        }
        else {
          RET_VAL[index].count += record.count;
        }
      }
    }
    return RET_VAL;
};

module.exports = {
  formatResponse,
};
