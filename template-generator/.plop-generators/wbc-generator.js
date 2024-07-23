const { inputRequired, inputNumber, appendWbcToChatAppAngularJson } = require('../utils/utils');

const INSTRUCTIONS = {
  description: 'Create a new AIAP application WBC',
  prompts: [
    {
      type: 'list',
      name: 'application',
      message: 'Choose application where to create a WBC:',
      choices: ['chat-app', 'conv-insights'],
    },
    {
      type: 'input',
      name: 'name',
      message: 'New WBC name without prefix:',
      validate: inputRequired('Name'),
    },
    {
      when(context) {
        return context.application !== 'chat-app';
      },
      type: 'input',
      name: 'version',
      message: 'Enter WBC version',
      validate: inputRequired('Version'),
    }
  ],
  actions: data => {
    const IS_CHAT_APP = data.application === 'chat-app';
    const PREFIX = IS_CHAT_APP ? '' : 'wbc-view-';
    const TEMPLATE = IS_CHAT_APP ? 'chat-app-wbc' : 'wbc';
    const VERSION = data.version ? data.version : 1;
    const ACTIONS = [
      {
        type: 'addMany',
        destination: `../aiap-applications/{{dashCase application}}/client-wbc/projects/aiap-${PREFIX}{{dashCase name}}-v${VERSION}`,
        base: `../.plop-templates/${TEMPLATE}`,
        templateFiles: `../.plop-templates/${TEMPLATE}/**/*`
      }
    ];

    if (IS_CHAT_APP) {
      ACTIONS.push({ type: 'appendWbcToChatAppAngularJson' });
    }
    return ACTIONS;
  }
};

module.exports = plop => {
  plop.setActionType('appendWbcToChatAppAngularJson', (answers, config, plop) => {
    const NAME_DASH_CASE = plop.getHelper('dashCase')(answers.name);
    appendWbcToChatAppAngularJson(`aiap-${NAME_DASH_CASE}`);
  });

  plop.setGenerator('wbc', INSTRUCTIONS);
};
