/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-soe-engine-botmaster';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import http from 'node:http';
import EventEmitter from 'node:events';

import {
  ISoeMiddlewareIncomingV1,
  ISoeMiddlewareOutgoingV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  Middleware,
} from './middleware';

import {
  AbstractBotV1
} from './abstract-bot-v1';

/**
 * The Botmaster class to rule them all
 */
export class Botmaster extends EventEmitter {

  settings: { [key: string | number | symbol]: any };
  middleware: Middleware;
  bots: AbstractBotV1[];
  __serverRequestListeners: { [key: string | number | symbol]: any };
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

  constructor(
    settings: {
      [key: string | number | symbol]: any
    },
  ) {
    super();
    this.settings = settings || {};
    this.__throwPotentialUnsupportedSettingsErrors();
    this.__setupServer();
    this.middleware = new Middleware();

    // this is used for mounting routes onto bot classes "mini-apps""
    this.__serverRequestListeners = {};
    // default useDefaultMountPathPrepend to true
    if (this.settings.useDefaultMountPathPrepend === undefined) {
      this.settings.useDefaultMountPathPrepend = true;
    }
    this.bots = [];
  }

  __throwPotentialUnsupportedSettingsErrors() {
    const unsupportedSettings = ['botsSettings', 'app'];

    for (const settingName of unsupportedSettings) {
      if (this.settings[settingName]) {
        throw new Error(`Starting botmaster with ${settingName} is no longer supported.`);
      }
    }
  }

  __setupServer() {
    if (this.settings.server && this.settings.port) {
      throw new Error('IncompatibleArgumentsError: Please specify only one of port and server');
    }
    if (this.settings.server) {
      this.server = this.settings.server;
    } else {
      const port = lodash.has(this, 'settings.port') ? this.settings.port : 3000;
      this.server = this.__listen(port);
    }
    this.__setupServersRequestListeners();
  }

  __setupServersRequestListeners() {
    const nonBotmasterListeners = this.server.listeners('request').slice(0);
    this.server.removeAllListeners('request');

    this.server.on('request', (req, res) => {
      // run botmaster requestListeners first
      for (const path in this.__serverRequestListeners) {
        if (req.url.indexOf(path) === 0) {
          const requestListener = this.__serverRequestListeners[path];
          return requestListener.call(this.server, req, res);
        }
      }
      // then run the non-botmaster ones
      if (nonBotmasterListeners.length > 0) {
        for (const requestListener of nonBotmasterListeners) {
          requestListener.call(this.server, req, res);
        }
      } else {
        // just return a 404
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: `Couldn't ${req.method} ${req.url}` }));
      }
    });
  }

  __listen(port: number) {
    const server = http.createServer();
    server.listen(port, '0.0.0.0', () => {
      // running it for the public
      const serverMsg = `server parameter not specified. Running new server on port: ${port}`;
      logger.info(serverMsg);
      this.emit('listening', serverMsg);
    });

    return server;
  }

  addBot(bot: AbstractBotV1) {
    if (bot.requiresWebhook) {
      const path = this.__getBotWebhookPath(bot);
      this.__serverRequestListeners[path] = bot.requestListener;
    }
    bot.master = this;
    this.bots.push(bot);
    bot.on('error', (params) => {
      logger.error(`${bot?.type} bot error: `, params.error.message);
      this.emit('error', params.bot, params.error, params.update);
    });

    logger.debug(`added bot of type: ${bot.type} with id: ${bot.id}`);

    return this;
  }

  __getBotWebhookPath(bot: AbstractBotV1) {
    const webhookEndpoint = bot.webhookEndpoint.replace(/^\/|\/$/g, '');

    const path = this.settings.useDefaultMountPathPrepend ? `/${bot.type}/${webhookEndpoint}` : `/${webhookEndpoint}`;

    return path;
  }

  getBot(options: { id?: any, type?: any }) {
    if (!options || (!options.type && !options.id) || (options.type && options.id)) {
      throw new Error("'getBot' needs exactly one of type or id");
    }
    let retVal;
    if (
      options.id
    ) {
      retVal = lodash.find(this.bots, { id: options.id });
    } else {
      retVal = lodash.find(this.bots, { type: options.type });
    }
    return retVal;
  }

  getBots(botType: string) {
    if (typeof botType !== 'string' && !((botType as any) instanceof String)) {
      throw new Error("'getBots' takes in a string as only parameter");
    }

    const foundBots = [];
    for (const bot of this.bots) {
      if (bot.type === botType) {
        foundBots.push(bot);
      }
    }

    return foundBots;
  }

  removeBot(bot: AbstractBotV1) {
    if (bot.requiresWebhook) {
      const path = this.__getBotWebhookPath(bot);
      delete this.__serverRequestListeners[path];
    }
    lodash.remove(this.bots, bot);
    bot.removeAllListeners();

    logger.debug(`removed bot of type: ${bot.type} with id: ${bot.id}`);

    return this;
  }

  use(
    middleware: ISoeMiddlewareIncomingV1 | ISoeMiddlewareOutgoingV1
  ) {
    this.middleware.__use(middleware);
    return this;
  }

  useWrapped(
    incomingMiddleware: ISoeMiddlewareIncomingV1,
    outgoingMiddleware: ISoeMiddlewareOutgoingV1,
  ) {
    this.middleware.__useWrapped(incomingMiddleware, outgoingMiddleware);

    return this;
  }
}
