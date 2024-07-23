/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const momentTz = require('moment-timezone');
const moment = require('moment');

const ValueReplace = () => ({
  replace: 'all',
  series: true,
  evaluate: 'step',
  controller: (params) => {
    const type = params.attributes.type;
    let valFromSession = params.update.session.replaceValue[type];
    if (valFromSession) {
      if (params.attributes.dateFormat && params.attributes.timeZone) {
        valFromSession = momentTz(valFromSession)
          .tz(params.attributes.timeZone)
          .format(params.attributes.dateFormat);
      } else if (params.attributes.dateFormat) {
        valFromSession = moment(valFromSession).format(params.attributes.dateFormat);
      }
      const message = params.before + valFromSession + params.after;
      params.bot.reply(params.update, message);
    } else {
      params.bot.reply(params.update, params.before + params.after);
    }
  },
});

module.exports = {
  ValueReplace,
};
