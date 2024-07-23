const fs = require('fs');
const lodash = require('lodash')

const PACKAGE_JSON = require('../../package.json');

const addApplicationToWorkspace = (appName) => {
  let newPackageJson = lodash.cloneDeep(PACKAGE_JSON);
  const WORKSPACE_ENTRIES = [
    `aiap-applications/${appName}/packages/*`,
    `aiap-applications/${appName}/aiap-packages/*`,
  ]

  WORKSPACE_ENTRIES.forEach(entry => {
    if(!newPackageJson.workspaces.includes(entry)) {
      newPackageJson.workspaces.push(entry);
    }
  })

  if(!lodash.isEqual(PACKAGE_JSON, newPackageJson)) {
    fs.writeFileSync('./package.json', JSON.stringify(newPackageJson, null, 2) + '\n');
    console.log(`Added application [${appName}] to ai-assistance-platform workspaces!`);
  } else {
    console.log(`Application [${appName}] was not added to ai-assistance-platform workspaces, because it's entries already exist!`);
  }
}

module.exports = addApplicationToWorkspace;
