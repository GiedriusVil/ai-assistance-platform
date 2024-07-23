const addApplicationToWorkspace = require('../utils/addApplicationToWorkspace');

const NAME = 'application';
const INSTRUCTIONS = {
  description: 'Create a new AIAP application',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'New application\'s name:'
    },
    {
      type: 'input',
      name: 'fullName',
      message: 'New application\'s full name:'
    },
    {
      type: 'input',
      name: 'serverPort',
      message: 'New application\'s server port:'
    }
  ],
  actions: [
    {
      type: 'addMany',
      destination: './aiap-applications/{{dashCase name}}',
      base: `./template-generator/.plop-templates/${NAME}`,
      templateFiles: `./template-generator/.plop-templates/${NAME}/**/*`
    },
    {
      type: 'addApplicationToWorkspaces'
    }
  ]
}

module.exports = plop => {
  //action which is used in application generator
  //adds that application to project package.json workspaces
  plop.setActionType('addApplicationToWorkspaces', (answers, config, plop) => {
    const NAME_DASH_CASE = plop.getHelper('dashCase')(answers.name);
    addApplicationToWorkspace(NAME_DASH_CASE);
  });

  plop.setGenerator(NAME, INSTRUCTIONS);
}
