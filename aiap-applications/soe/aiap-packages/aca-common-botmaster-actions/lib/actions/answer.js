/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const answer = (config, AnswerStore) => ({
  replace: 'all',
  series: true,
  evaluate: 'step',
  controller: async function (params) {
    const id = params.attributes.id;
    const errorMessage = params.attributes.errorMessage || config.defaultErrorMessage;
    const handoverMessage = params.attributes.handoverMessage || config.defaulHandoverMessage;
    const skill = params.attributes.skill || config.defaultSkill;
    await AnswerStore.getAnswer(id)
      .then(answer => {
        const message = params.before + answer + params.after;
        params.bot.reply(params.update, message);
      })
      .catch(() => {
        const message = `${errorMessage} <handover skill="${skill}">${handoverMessage} ${params.update.message.text
          }</handover>`;
        params.bot.reply(params.update, message);
      });
  },
});

module.exports = {
  answer
};
