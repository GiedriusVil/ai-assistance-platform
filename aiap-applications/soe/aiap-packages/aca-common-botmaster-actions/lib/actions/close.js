/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const Close = () => ({
  replace: 'all',
  series: true,
  evaluate: 'step',
  controller: function (params) {
    if (
      params.bot.implements &&
      params.bot.implements.close
    ) {
      params.bot.closeConversation(params.update);
    }
  },
});

module.exports = { Close };
