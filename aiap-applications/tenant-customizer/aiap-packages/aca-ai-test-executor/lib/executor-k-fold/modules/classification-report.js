/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/

const dfd = require('@ibm-aca/aca-wrapper-danfojs-node');

const classificationReportFromDict = (report, column) => {
    const DATAFRAME = new dfd.DataFrame(report);
    DATAFRAME.addColumn('class', column, { inplace: true });
    return DATAFRAME;
};

module.exports = classificationReportFromDict;
