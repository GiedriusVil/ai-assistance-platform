/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `genesys-service`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  execHttpGetRequest,
  execHttpPostRequest,
  execHttpDeleteRequest,
} from '@ibm-aca/aca-wrapper-http';


class GenesysService {

  configuration: any;
  session: any;

  constructor(configuration) {
    this.configuration = configuration;
    this.session = null;
  }

  getSession() {
    return this.session;
  }

  setSession(session) {
    this.session = session;
  }

  /**
 * Start conversation Genesys PureCloud response example 
    {
        "id": "c4c2e5a6-f01e-48ed-960a-68d48c3e0d05",
        "jwt": "eyJhbGciOi...",
        "eventStreamUri": "wss://{some.server.com}/v1/token/eyJhbGciOi[...]",
        "member": {
         "id": "8dd184ac-c481-4d67-bb33-bd6976b1b5f0"
        }
    }
 * 
 */

  async startChat() {
    let context;
    let params;
    let response;
    try {
      context = {};
      params = {
        url: `${this.configuration.uri}/api/v2/webchat/guest/conversations`,
        body: {
          organizationId: this.configuration.organizationId,
          deploymentId: this.configuration.deploymentId,
          routingTarget: {
            targetType: 'queue',
            targetAddress: this.configuration.queue,
          },
          //TODO: requires proper implementation to pass user profile information
          memberInfo: {
            displayName: 'Joe Dirt',
            avatarImageUrl: 'http://some-url.com/JoeDirtsFace',
            lastName: 'Joe',
            firstName: 'Dirt',
            email: 'joe.dirt@example.com',
            phoneNumber: '+12223334444',
            customFields: {
              some_field: 'arbitrary data',
              another_field: 'more arbitrary data',
            },
          },
        },
      }
      response = await execHttpPostRequest(context, params);

      // TODO Double Check might not work!
      this.session = response?.body;

      const RET_VAL = this.session;
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.startChat.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async postMessage(message) {
    let context;
    let params;
    let response;
    try {
      logger.info(`postMessage`, {
        conversationId: this.session.id,
        message: message
      });
      context = {};
      params = {
        headers: {
          Authorization: `Bearer ${this.session.jwt}`,
        },
        url: `${this.configuration.uri}/api/v2/webchat/guest/conversations/${this.session.id}/members/${this.session.member.id}/messages`,
        body: {
          body: message,
          botyType: 'standard',
        },
      };
      response = await execHttpPostRequest(context, params);
      logger.info('postMessage', { response });
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.postMessage.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async endChat(userClose) {
    let context;
    let params;
    let response;
    try {
      if (
        this.session &&
        userClose
      ) {
        logger.info(`[INFO] Ending the conversation`, { conversationId: this.session.id });
        context = {};
        params = {
          headers: {
            Authorization: `Bearer ${this.session.jwt}`,
          },
          url: `${this.configuration.uri}/api/v2/webchat/guest/conversations/${this.session.id}/members/${this.session.member.id}`,
        };
        response = await execHttpDeleteRequest(context, params);
        logger.info(`[INFO] Successfully ended the conversation`, {
          conversationId: this.session.id,
          response: response,
        });
      }
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.endChat.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async getMemberDetails(event) {
    let context;
    let params;
    let response;

    let retVal;
    try {
      logger.info(`getMemberDetails`, event);
      if (
        event.eventBody.sender.id != this.session.member.id
      ) {
        context = {};
        params = {
          headers: {
            Authorization: `Bearer ${this.session.jwt}`,
            url: `${this.configuration.uri}/api/v2/webchat/guest/conversations/${this.session.id}/members/${event.eventBody.sender.id}`,
          },
        };
        response = await execHttpGetRequest(context, params);
        logger.info(`getMemberDetails`, { response });
        if (
          response?.body?.displayName
        ) {
          retVal = {
            displayName: response?.body?.displayName,
            firstName: response?.body?.firstName,
            lastName: response?.body?.lastName,
          }
        }
      }
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.getMemberDetails.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

export {
  GenesysService,
};
