/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const capitalizeFirst = ramda.compose(
  ramda.join(''),
  ramda.juxt([
    ramda.compose(
      ramda.toUpper,
      ramda.head
    ),
    ramda.compose(
      ramda.toLower,
      ramda.tail
    ),
  ])
);

const GetCustomerName = {
  replace: 'all',
  series: true,
  evaluate: 'step',
  controller: function (params) {
    let message;
    const prefix = params.attributes.prefix;
    const suffix = params.attributes.suffix;
    if (
      params.update.customerName &&
      ramda.has('firstname', params.update.customerName)
    ) {
      const customerName = `${capitalizeFirst(ramda.defaultTo('')(params.update.customerName.firstname))}`.trim();
      message = params.before.trim() + (prefix || '') + customerName + (suffix || '') + params.after;
    } else {
      message = params.before.trim() + params.after;
    }
    params.bot.reply(params.update, message);
  },
};

module.exports = {
  GetCustomerName,
};
