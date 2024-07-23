/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'conv-insights-client-wbc-angular-json';

const path = require('path');
const fsExtra = require('fs-extra');

const ANGULAR_JSON = {
  $schema: './node_modules/@angular/cli/lib/config/schema.json',
  version: 1,
  newProjectRoot: 'projects',
  cli: {
    analytics: false
  },
  projects: {}
}

const appendClientSharedLibrary = (library) => {
  const LIBRARY = {
    projectType: 'library',
    root: `../../../aiap-packages-shared-angular/projects/${library}`,
    sourceRoot: `../../../aiap-packages-shared-angular/projects/${library}/src`,
    prefix: 'lib',
    architect: {
      build: {
        builder: '@angular-devkit/build-angular:ng-packagr',
        options: {
          tsConfig: `../../../aiap-packages-shared-angular/projects/${library}/tsconfig.lib.json`,
          project: `../../../aiap-packages-shared-angular/projects/${library}/ng-package.json`,
        },
        configurations: {
          production: {
            tsConfig: `../../../aiap-packages-shared-angular/projects/${library}/tsconfig.lib.prod.json`,
          }
        }
      },
      test: {
        builder: '@angular-devkit/build-angular:karma',
        options: {
          main: `../../../aiap-packages-shared-angular/projects/${library}/src/test.ts`,
          tsConfig: `../../../aiap-packages-shared-angular/projects/${library}/tsconfig.spec.json`,
          karmaConfig: `../../../aiap-packages-shared-angular/projects/${library}/karma.conf.js`,
        }
      }
    }
  };
  ANGULAR_JSON.projects[library] = LIBRARY;
}

const appendClientLibrary = (library) => {
  const LIBRARY = {
    projectType: 'library',
    root: `projects/${library}`,
    sourceRoot: `projects/${library}/src`,
    prefix: 'lib',
    architect: {
      build: {
        builder: '@angular-devkit/build-angular:ng-packagr',
        options: {
          tsConfig: `projects/${library}/tsconfig.lib.json`,
          project: `projects/${library}/ng-package.json`,
        },
        configurations: {
          production: {
            tsConfig: `projects/${library}/tsconfig.lib.prod.json`
          }
        },
        defaultConfiguration: 'production',
      },
      test: {
        builder: `@angular-devkit/build-angular:karma`,
        options: {
          main: `projects/${library}/src/test.ts`,
          tsConfig: `projects/${library}/tsconfig.spec.json`,
          karmaConfig: `projects/${library}/karma.conf.js`
        }
      }
    }
  };
  ANGULAR_JSON.projects[library] = LIBRARY;
}

const appendWbc = (wbc) => {
  const WBC = {
    projectType: 'application',
    schematics: {
      '@schematics/angular:component': {
        style: 'scss'
      },
      '@schematics/angular:application': {
        strict: true
      }
    },
    root: `projects/${wbc}`,
    sourceRoot: `projects/${wbc}/src`,
    prefix: 'aiap',
    architect: {
      build: {
        builder: 'ngx-build-plus:browser',
        options: {
          aot: true,
          outputPath: `dist/${wbc}`,
          index: `projects/${wbc}/src/index.html`,
          main: `projects/${wbc}/src/main.ts`,
          polyfills: `projects/${wbc}/src/polyfills.ts`,
          tsConfig: `projects/${wbc}/tsconfig.app.json`,
          preserveSymlinks: true,
          assets: [
            {
              glob: '**/*',
              input: 'node_modules/monaco-editor',
              output: 'assets/monaco'
            },
            `projects/${wbc}/src/favicon.ico`,
            `projects/${wbc}/src/assets`
          ],
          styles: [
            `projects/${wbc}/src/styles.scss`
          ],
          stylePreprocessorOptions: {
            includePaths: [
              `projects/${wbc}/src/styles`,
              `projects/${wbc}/src/styles/components`
            ]
          },
          scripts: []
        },
        configurations: {
          production: {
            budgets: [
              {
                type: 'initial',
                maximumWarning: '15mb',
                maximumError: '20mb'
              },
              {
                type: 'anyComponentStyle',
                maximumWarning: '500kb',
                maximumError: '1mb'
              }
            ],
            fileReplacements: [
              {
                replace: `projects/${wbc}/src/environments/environment.ts`,
                with: `projects/${wbc}/src/environments/environment.prod.ts`,
              }
            ],
            aot: true,
            optimization: false,
            buildOptimizer: false,
            outputHashing: 'all',
            sourceMap: true,
            namedChunks: false,
            vendorChunk: false
          },
          development: {
            budgets: [
              {
                type: 'initial',
                maximumWarning: '15mb',
                maximumError: '20mb'
              },
              {
                type: 'anyComponentStyle',
                maximumWarning: '500kb',
                maximumError: '1mb'
              }
            ],
            fileReplacements: [
              {
                replace: `projects/${wbc}/src/environments/environment.ts`,
                with: `projects/${wbc}/src/environments/environment.prod.ts`,
              }
            ],
            aot: true,
            optimization: false,
            buildOptimizer: false,
            outputHashing: 'all',
            sourceMap: true,
            namedChunks: false,
            vendorChunk: false
          }
        },
        defaultConfiguration: 'production'
      },
      serve: {
        builder: '@angular-devkit/build-angular:dev-server',
        configurations: {
          production: {
            browserTarget: `${wbc}:build:production`,
          },
          development: {
            browserTarget: `${wbc}:build:development`,
          }
        },
        defaultConfiguration: 'development'
      },
      'extract-i18n': {
        builder: '@angular-devkit/build-angular:extract-i18n',
        options: {
          browserTarget: `${wbc}:build`,
        }
      },
      test: {
        builder: `@angular-devkit/build-angular:karma`,
        options: {
          main: `projects/${wbc}/src/test.ts`,
          polyfills: `projects/${wbc}/src/polyfills.ts`,
          tsConfig: `projects/${wbc}/tsconfig.spec.json`,
          karmaConfig: `projects/${wbc}/karma.conf.js`,
          inlineStyleLanguage: `scss`,
          assets: [
            `projects/${wbc}/src/favicon.ico`,
            `projects/${wbc}/src/assets`,
          ],
          styles: [
            `projects/${wbc}/src/styles.scss`,
          ],
          scripts: []
        }
      }
    }
  };
  ANGULAR_JSON.projects[wbc] = WBC;
}

const appendWbcs = () => {
  const DIR_PROJECTS = fsExtra.readdirSync(path.resolve(`${__dirname}/projects`));

  if (
    DIR_PROJECTS &&
    DIR_PROJECTS.length > 0
  ) {
    for (const DIR_PROJECT of DIR_PROJECTS) {

      if (
        DIR_PROJECT &&
        DIR_PROJECT.startsWith('aiap-wbc')
      ) {
        appendWbc(DIR_PROJECT);
      }
    }
  }
}

appendClientSharedLibrary('client-shared-carbon');
appendClientSharedLibrary('client-shared-utils');
appendClientSharedLibrary('client-shared-services');
appendClientSharedLibrary('client-shared-components');
appendClientSharedLibrary('client-shared-views');

appendClientLibrary('client-utils');
appendClientLibrary('client-services');
appendClientLibrary('client-components');
appendClientLibrary('client-views');

appendWbcs();


console.log(MODULE_ID,
  {
    ANGULAR_JSON,
  });

fsExtra.writeJSONSync('angular.json', ANGULAR_JSON,
  {
    spaces: 2,
  }
);



