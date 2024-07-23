/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const getDateToString = (format, dateField, params) => ({
  $dateToString: {
    format: format,
    date: dateField,
    timezone: params.timezone
  }
});

module.exports = {
  getDateToString
};
