const fs = require('fs');
const path = require('path');

/**
 * Input validator - ensure input is not empty.
 *
 * @param {string} name - the name of the required field
 * @returns {any} A function to required the given field
 */
const inputRequired = name => {
  return value => (/.+/.test(value) ? true : `${name} is required`);
};

/**
 * Append wbc angular json configuration to chat-app client-wbc angular.json file
 * 
 * @param {string} wbc - the name of WBC
 */
const appendWbcToChatAppAngularJson = (wbc) => {
  const PATH = path.join(__dirname, '../../aiap-applications/chat-app/client-wbc/angular.json');
  const ANGULAR_JSON = JSON.parse(fs.readFileSync(PATH).toString());
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
  fs.writeFileSync(PATH, JSON.stringify(ANGULAR_JSON, null, 2) + '\n');
};

module.exports = {
  inputRequired,
  appendWbcToChatAppAngularJson,
};
