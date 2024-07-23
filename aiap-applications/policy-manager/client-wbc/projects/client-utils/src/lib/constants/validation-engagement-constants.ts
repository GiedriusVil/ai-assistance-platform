/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export const DEFAULT_VALIDATION_ENGAGEMENTS_SCHEMA_V1 = `
const Joi = require('@ibm-aca/aca-wrapper-joi');
    
const SCHEMA = Joi.object({
    
});

module.exports = {
    SCHEMA,
}
`;

export const DEFAULT_VALIDATION_ENGAGEMENTS_ACTIONS_V1 = `
{
  "version": "0.0.1",
  "grid": {
    "rows": [
      {
        "columns": [
          {
            "wbc": {
              "host": "http://localhost:3002",
              "path": "/path/to/main.js",
              "tag": "tag-to-be-used"
            }
          }
        ]
      }
    ]
  }
}
`;
