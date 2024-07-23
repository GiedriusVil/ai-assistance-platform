/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
export const TENANT_CONFIGURATION_SCHEMA = {
  type: 'object',
  properties: {
    notifications: {
      oneOf: [
        {
          type: 'boolean',
        },
        {
          type: 'object',
          properties: {
            error: { type: 'boolean' },
            info: { type: 'boolean' },
            success: { type: 'boolean' },
            warning: { type: 'boolean' }
          }
        }
      ]
    },
  }
};
