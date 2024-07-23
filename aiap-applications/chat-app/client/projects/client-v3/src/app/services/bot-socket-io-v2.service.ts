/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { io } from 'socket.io-client';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  _warnX,
  _errorX,
  Language,
} from 'client-utils';

import {
  ClientServiceV2,
  ConfigServiceV2,
  SessionServiceV2,
  StorageServiceV2,
  GAcaPropsServiceV1,
} from '.'
import { EventBusServiceV1 } from 'client-services';
import { EVENT_TYPE } from 'client-utils';

const IO_OPTIONS_QUERY_PARAM_KEYS = {
  WA: 'wa',
  USER_AGENT: 'userAgent',
  LANGUAGE: 'language',
  SCREEN_RESOLUTION: 'screenResolution',
  TOKEN: 'token',
  X_ACA_CONVERSATION_TOKEN: 'x-aca-conversation-token',
  SKILL: 'skill',
  POC: 'poc',
  G_ACA_PROPS: 'gAcaProps'
};

@Injectable()
export class BotSocketIoServiceV2 {

  static getClassName() {
    return 'BotSocketIoServiceV2';
  }

  // ANBE
  // @ts-ignore
  public clientService: ClientServiceV2;
  public conversationToken: any;

  private selectedLanguage: any;
  private session: any;
  private reconnectionAttempts = 5;
  private socket: any = null;

  private ioOptions: any = {
    query: {},
    cookie: false
  };

  constructor(
    private configService: ConfigServiceV2,
    private storageService: StorageServiceV2,
    private sessionService: SessionServiceV2,
    private activatedRoute: ActivatedRoute,
    private gAcaPropsService: GAcaPropsServiceV1,
    private injector: Injector,
    private router: Router,
    private eventBusService: EventBusServiceV1,
  ) { }


  getClientService(): ClientServiceV2 {
    return this.injector.get<ClientServiceV2>(ClientServiceV2);
  }

  connect() {
    try {
      this.refreshIoOptions();
      this.clientService = this.getClientService();

      const hostname = this.configService.getHostName();
      const config: any = this.configService.getConfig();

      this.ioOptions.path = ramda.pathOr('', ['ioServer', 'path'], config);
      const ENGAGEMENT_IO_OPTIONS = ramda.path(['engagement', 'chatApp', 'socketOptions'], this.sessionService.getSession());

      _debugX(BotSocketIoServiceV2.getClassName(), 'connect', {
        hostname: hostname,
        config: config,
        this_ioOptions: this.ioOptions,
        ENGAGEMENT_IO_OPTIONS: ENGAGEMENT_IO_OPTIONS
      });

      this.ioOptions = {
        ...this.ioOptions,
        ...ENGAGEMENT_IO_OPTIONS
      };

      if (this.socket === null) {
        this.socket = io(`${hostname}`, this.ioOptions);
        this.socket.on('connect', () => {
          if (this.socket.id) {
            _debugX(BotSocketIoServiceV2.getClassName(), 'on_connect', { this_socket: this.socket });
          }
        });
        this.socket.on('reconnect_attempt', async (attempts: any) => {
          _debugX(BotSocketIoServiceV2.getClassName(), 'on_reconnect_attempt', { this_socket: this.socket });
          if (attempts === this.reconnectionAttempts) this.onError();
        });
        this.socket.on('ping', () => {
          this.socket.emit('pong', { beat: 1 });
        });
        this.socket.on('bot_status', async (state: any) => {
          _debugX(BotSocketIoServiceV2.getClassName(), 'on_bot_status', { this_socket: this.socket, state: state });
          if (state.status === 'offline') this.onError();
        });
        this.socket.on('error', async (err: any) => {
          _errorX(BotSocketIoServiceV2.getClassName(), 'on_error', { this_socket: this.socket, err: err });
          this.onError();
        });
        this.socket.on('disconnect', (reason: any) => {
          _debugX(BotSocketIoServiceV2.getClassName(), 'on_disconnect', { this_socket: this.socket, reason: reason });
        });
        this.socket.on('continue', (data: any) => {
          // ANBE COMPLETE THIS
          _debugX(BotSocketIoServiceV2.getClassName(), 'on_continue', { this_socket: this.socket, data: data });
        });
        this.socket.on('clear_room', (message: any) => {
          _debugX(BotSocketIoServiceV2.getClassName(), 'on_clear_room', { this_socket: this.socket, message: message });
          this.socket.emit('clear_room', message);
        });

        this.socket.on('init', (data: any) => {
          _debugX(BotSocketIoServiceV2.getClassName(), 'on_init', { this_socket: this.socket, data: data });
          this.session = data?.session;
          const TOKEN = data ? data.token : undefined;
          this.socket.io.opts.query[IO_OPTIONS_QUERY_PARAM_KEYS.X_ACA_CONVERSATION_TOKEN] = TOKEN

          this.clientService.postMessage(null);
        });
        this.socket.on('message', (message: any) => {
          _debugX(BotSocketIoServiceV2.getClassName(), 'on_message', { this_socket: this.socket, message: message });
          this.eventBusService.emit?.({
            type: EVENT_TYPE.MESSAGE_RECEIVED,
            data: message,
          });

        });
        this.socket.on('transcribedAudioMessage', (message: any) => {
          this.eventBusService.emit?.({
            type: EVENT_TYPE.MESSAGE_RECEIVED,
            data: message,
          });
        })
        this.socket.on('audioMessage', (message: any) => {
          _debugX(BotSocketIoServiceV2.getClassName(), 'audioMessage', { this_socket: this.socket, message: message });
          this.session = message?.session;
          this.eventBusService.emit?.({
            type: EVENT_TYPE.AUDIO_MESSAGE_RECEIVED,
            data: message,
          });
        });
        this.socket.connect();
      } else {
        if (this.socket.connected === false) {
          this.socket.connect();
        }
      }
    } catch (error) {
      _errorX(BotSocketIoServiceV2.getClassName(), 'connect', { error });
      throw error;
    }
  }

  async onError() {
    await this.router.navigateByUrl('/error');
  }

  postAudioMessage(audioMessage: any) {
    const PAYLOAD = {
      message: {
        audio: audioMessage?.audio,
        timestamp: audioMessage?.timestamp ? audioMessage?.timestamp : new Date().getTime(),
        sender_action: audioMessage?.sender_action,
      },
      engagement: this.session?.engagement,
      gAcaProps: this.gAcaPropsService.getGAcaProps(),
      clientSideInfo: {
        ...this.configService.getEnvironment(),
        selectedLanguage: this.selectedLanguage
      }
    };
    this.socket.emit('audioMessage', PAYLOAD);
  }
  postMessage(message: any) {
    const payload = {
      message: {
        text: message?.text ? message.text : '',
        timestamp: message?.timestamp ? message.timestamp : new Date().getTime(),
        sender_action: message?.sender_action,
      },
      engagement: this.session?.engagement,
      gAcaProps: this.gAcaPropsService.getGAcaProps(),
      confirmations: {
        piAgreement: message?.confirmations?.hasOwnProperty('piConfirmation') ? message.confirmations.piConfirmation : this.storageService.getPiConfirmation()
      },
      clientSideInfo: {
        ...this.configService.getEnvironment(),
        selectedLanguage: this.selectedLanguage
      }
    };

    this.eventBusService.emit?.({
      type: EVENT_TYPE.MESSAGE_RECEIVED,
      data: payload,
    });

    _debugX(BotSocketIoServiceV2.getClassName(), 'postMessage', { payload: payload });
    this.socket.emit('message', payload);
  }

  refreshIoOptions(): void {
    const JWT_TOKEN_ENCODED = this.storageService.getConversationToken();

    // ACA parameters
    this.ioOptions.query[IO_OPTIONS_QUERY_PARAM_KEYS.WA] = this.activatedRoute.snapshot.queryParamMap.get('wa') || undefined;

    // Conversation session details
    this.ioOptions.query[IO_OPTIONS_QUERY_PARAM_KEYS.USER_AGENT] = window.navigator.userAgent;
    this.ioOptions.query[IO_OPTIONS_QUERY_PARAM_KEYS.LANGUAGE] = this.configService.getLanguage();
    this.ioOptions.query[IO_OPTIONS_QUERY_PARAM_KEYS.SCREEN_RESOLUTION] = `${screen.width}x${screen.height}`;

    // Setting conversation token, if available
    if (JWT_TOKEN_ENCODED) {
      this.ioOptions.query[IO_OPTIONS_QUERY_PARAM_KEYS.X_ACA_CONVERSATION_TOKEN] = JWT_TOKEN_ENCODED;
    }

    // inContact specific parameters
    this.ioOptions.query[IO_OPTIONS_QUERY_PARAM_KEYS.TOKEN] = this.activatedRoute.snapshot.queryParamMap.get('token') || 'default';
    this.ioOptions.query[IO_OPTIONS_QUERY_PARAM_KEYS.SKILL] = this.activatedRoute.snapshot.queryParamMap.get('skill') || 'default';
    this.ioOptions.query[IO_OPTIONS_QUERY_PARAM_KEYS.POC] = this.activatedRoute.snapshot.queryParamMap.get('poc') || 'default';
  }
}
