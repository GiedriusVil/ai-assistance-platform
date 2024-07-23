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
  ClientServiceV1,
  ZendeskLiveAgentServiceV1,
  ConfigServiceV1,
  SessionServiceV1,
  StorageServiceV1,
  BasketServiceV1,
  EventsServiceV1,
  GAcaPropsServiceV1,
  ParamsServiceV1,
  EnvironmentServiceV1,
} from '.'

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
export class BotSocketIoServiceV1 {

  static getClassName() {
    return 'BotSocketIoServiceV1';
  }

  public clientService: ClientServiceV1;
  public conversationToken: any;

  private config: any;

  private selectedLanguage: Language;
  private session: any;
  private reconnectionAttempts = 5;
  private socket = null;
  private reconnectionSchedule: any = null;
  private stopUserTypingEvent: any = null;

  private ioOptions: any = {
    query: {},
    cookie: false
  };

  constructor(
    private configService: ConfigServiceV1,
    private eventsService: EventsServiceV1,
    private storageService: StorageServiceV1,
    private activatedRoute: ActivatedRoute,
    private paramsService: ParamsServiceV1,
    private gAcaPropsService: GAcaPropsServiceV1,
    private sessionService: SessionServiceV1,
    private zendeskLiveAgentService: ZendeskLiveAgentServiceV1,
    private basketService: BasketServiceV1,
    private injector: Injector,
    private router: Router,
    private environmentService: EnvironmentServiceV1,
  ) { }



  getClientService(): ClientServiceV1 {
    return this.injector.get<ClientServiceV1>(ClientServiceV1);
  }

  connect() {
    const ENVIORNMENT = this.environmentService.getEnvironment();

    this.refreshIoOptions();
    this.clientService = this.getClientService();
    const config: any = this.configService.getConfig();
    this.ioOptions.path = ramda.pathOr('', ['ioServer', 'path'], config);
    const hostname = ENVIORNMENT.hostUrl;
    const SESSION = this.sessionService.getSession();
    const ENGAGEMENT_IO_OPTIONS = SESSION?.engagement?.chatApp?.service?.botSocketIo?.socketOptions;

    _debugX(BotSocketIoServiceV1.getClassName(), 'connect', {
      hostname: hostname,
      config: config,
      this_ioOptions: this.ioOptions,
      ENGAGEMENT_IO_OPTIONS: ENGAGEMENT_IO_OPTIONS
    });

    this.ioOptions = {
      ...this.ioOptions,
      ...ENGAGEMENT_IO_OPTIONS
    };
    // this.ioOptions.query[IO_OPTIONS_QUERY_PARAM_KEYS.G_ACA_PROPS] = this.gAcaPropsService.getGAcaPropsJSONString();

    if (this.socket === null) {
      this.socket = io(`${hostname}`, this.ioOptions);
      this.socket.on('connect', () => {
        if (this.socket.id) {
          _debugX(BotSocketIoServiceV1.getClassName(), 'on_connect', { this_socket: this.socket });
          this.eventsService.eventEmit({ onBotTyping: true });
          this.eventsService.eventEmit({ onSessionEnded: false });
        }
      });
      // [LEGO] How come next 2 events are same? 
      this.socket.on('reconnect_attempt', () => {
        _debugX(BotSocketIoServiceV1.getClassName(), 'on_reconnect_attempt', { this_socket: this.socket });
      });
      this.socket.on('reconnect_attempt', async (attempts: any) => {
        _debugX(BotSocketIoServiceV1.getClassName(), 'on_reconnect_attempt', { this_socket: this.socket });
        if (attempts === this.reconnectionAttempts) this.onError();
      });
      this.socket.on('ping', () => {
        this.socket.emit('pong', { beat: 1 });
      });
      this.socket.on('bot_status', async (state: any) => {
        _debugX(BotSocketIoServiceV1.getClassName(), 'on_bot_status', { this_socket: this.socket, state: state });
        if (state.status === 'offline') this.onError();
      });
      this.socket.on('error', async (err: any) => {
        _errorX(BotSocketIoServiceV1.getClassName(), 'on_error', { this_socket: this.socket, err: err });
        console.error('Socket.io error:', err);
        console.error('Socket.io error:', this.socket);
        this.onError();
      });
      this.socket.on('disconnect', (reason: any) => {
        _debugX(BotSocketIoServiceV1.getClassName(), 'on_disconnect', { this_socket: this.socket, reason: reason });
        this.eventsService.eventEmit({ onBotTyping: false });
        this.eventsService.eventEmit({ onSessionEnded: true });
      });
      this.socket.on('continue', (data: any) => {
        _debugX(BotSocketIoServiceV1.getClassName(), 'on_continue', { this_socket: this.socket, data: data });
        this.session = data?.session;
        const TOKEN = data ? data.token : undefined;
        const TRANSCRIPT = data ? data.transcript : undefined;

        this.socket.io.opts.query[IO_OPTIONS_QUERY_PARAM_KEYS.X_ACA_CONVERSATION_TOKEN] = TOKEN;

        this.storageService.updatePrevConversation(TOKEN);
        this.mapTranscriptOnContinue(TRANSCRIPT);
        this.storageService.saveTranscript(TRANSCRIPT);
        this.conversationToken = TOKEN;
        this.sessionService.updateSession(this.session);

        if (this.isWidget()) this.setWidgetState();
        this.eventsService.eventEmit({ onConversationRestore: true });
      });
      this.socket.on('clear_room', (message: any) => {
        _debugX(BotSocketIoServiceV1.getClassName(), 'on_clear_room', { this_socket: this.socket, message: message });
        this.socket.emit('clear_room', message);
      });
      this.socket.on('transfer_on_client_side', (message: any) => {
        _debugX(BotSocketIoServiceV1.getClassName(), 'on_transfer_on_client_side', { this_socket: this.socket, message: message });
        this.session = message?.session;
        const TOKEN = ramda.path(['session', 'token', 'value'], message);
        const ZENDESK_API_KEY = ramda.path(['sender_action', 'apikey'], message);
        this.storageService.setConversationToken(TOKEN);
        this.storageService.setChatCookie({
          conversationToken: TOKEN
        });
        this.conversationToken = TOKEN;
        this.eventsService.eventEmit({ onBotTyping: false });
        if (ZENDESK_API_KEY) {
          this.zendeskLiveAgentService.connect(ZENDESK_API_KEY);
        }
      });
      this.socket.on('transfer_to_bot', (message: any) => {
        _debugX(BotSocketIoServiceV1.getClassName(), 'on_transfer_to_bot', { this_socket: this.socket, message: message });
        const TOKEN = ramda.path(['session', 'token', 'value'], message);
        this.storageService.setConversationToken(TOKEN);
        this.storageService.setChatCookie({
          conversationToken: TOKEN
        });
        this.conversationToken = TOKEN;
        this.clientService.handleIncomingMessage(message);
      });
      this.socket.on('init', (data: any) => {
        _debugX(BotSocketIoServiceV1.getClassName(), 'on_init', { this_socket: this.socket, data: data });
        this.session = data?.session;
        const TOKEN = data ? data.token : undefined;
        const TRANSCRIPT = data ? data.transcript : undefined;

        this.socket.io.opts.query[IO_OPTIONS_QUERY_PARAM_KEYS.X_ACA_CONVERSATION_TOKEN] = TOKEN

        this.storageService.clearAll();
        this.storageService.setConversationToken(TOKEN);
        this.storageService.saveTranscript(TRANSCRIPT);
        this.storageService.setChatCookie({
          conversationToken: TOKEN
        });
        this.conversationToken = TOKEN;
        this.sessionService.updateSession(this.session);
        if (this.isWidget()) this.setWidgetState();

        this.clientService.postMessage(null);
      });
      this.socket.on('message', (message: any) => {
        _debugX(BotSocketIoServiceV1.getClassName(), 'on_message', { this_socket: this.socket, message: message });
        this.session = message?.session;
        const TOKEN = ramda.path(['session', 'token', 'value'], message);
        if (!lodash.isEmpty(TOKEN)) {
          this.storageService.setConversationToken(TOKEN);
          this.storageService.setChatCookie({
            conversationToken: TOKEN
          });
        }
        this.clientService.handleIncomingMessage(message);
      });
      this.socket.on('transfer_to_channel', (data: any) => {
        _debugX(BotSocketIoServiceV1.getClassName(), 'on_transfer_to_channel', { this_socket: this.socket, data: data });
        this.session = data?.session;
        const TOKEN = ramda.path(['session', 'token', 'value'], data);
        this.storageService.setConversationToken(TOKEN);
        this.storageService.setChatCookie({
          conversationToken: TOKEN
        });
        this.conversationToken = TOKEN;
        this.sessionService.updateSession(this.session);
        this.eventsService.eventEmit({ onTransferToChannel: true });
      });
      this.socket.connect();
    } else {
      if (this.socket.connected === false) {
        this.socket.connect();
      }
    }

    this.scheduleReconnection();
  }

  async onError() {
    this.eventsService.eventEmit({ onBotTyping: false });
    this.eventsService.eventEmit({ onSessionEnded: true });
    await this.router.navigateByUrl('/error');
  }

  handleIncomingMessage(incoming: any) {
    // TODO: action tags should be handled here
    const sender_action = ramda.pathOr(undefined, ['sender_action'], incoming);
    const action = ramda.pathOr(undefined, ['sender_action', 'type'], incoming);

    switch (action) {
      case 'typing_on':
        this.eventsService.eventEmit({ onBotTyping: true });
        break;
      case 'typing_off':
        this.eventsService.eventEmit({ onBotTyping: false });
        break;
      case 'disable_input':
        this.eventsService.eventEmit({ onInputDisable: ramda.pathOr(false, ['sender_action', 'status'], incoming) });
        break;
      case 'close':
        this.eventsService.eventEmit({ onSessionEnded: true });
        break;
    }

    if (!['typing_on', 'typing_off'].includes(sender_action)) {
      const BASKET = ramda.path(['basket'], incoming);
      this.basketService.broadcast(BasketServiceV1.EVENT.CHANGED, BASKET);
    }

    let attachment = ramda.pathOr(undefined, ['message', 'attachment'], incoming);

    // TODO: survey should not be comming as attachment
    if (attachment && ramda.includes(attachment['type'], ['survey'])) attachment = undefined;

    let text = ramda.pathOr(undefined, ['message', 'text'], incoming);
    if (ramda.includes(text, ['SYSTEM_MESSAGE', 'EMPTY_MESSAGE'])) text = undefined;

    if (text || attachment) {
      this.eventsService.eventEmit({ onBotTyping: false });
      this.eventsService.eventEmit({ onAudioPlay: true });

      if (attachment) {
        // TODO: for debug purposes, to see exact attachment object

      }

      const payload = ramda.mergeDeepRight(
        {
          conversationId: ramda.pathOr(incoming?.sender_action?.data?.conversationId, ['recipient', 'id'], incoming),
          messageId: ramda.pathOr(incoming?.sender_action?.data?.messageId, ['traceId', 'messageId'], incoming),
          utteranceId: ramda.pathOr(incoming?.sender_action?.data?.utteranceId, ['traceId', 'utteranceId'], incoming),
          text: text,
          sender_action: sender_action,
          attachment: attachment,
        },
        {
          type: ramda.pathOr('bot', ['type'], incoming),
          timestamp: new Date().getTime()
        }
      );
      _debugX(BotSocketIoServiceV1.getClassName(), 'handleIncomingMessage', { payload });
      this.eventsService.messageEmit(payload);
    }
  }

  reconnect() {
    try {
      _debugX(BotSocketIoServiceV1.getClassName(), 'reconnect', { this_socket: this.socket });
      this.disconnectChat();
      this.socket = null;
      this.clearReconnectionSchedule();
      this.connect();
    } catch (error) {
      const ACA_ERROR = {
        type: 'SYSTEM_ERROR',
        message: error?.message,
        error: error
      };
      throw ACA_ERROR;
    }
  }

  disconnectChat() {
    this.socket.disconnect();
  }

  getSession() {
    return this.session;
  }

  isWidget() {
    return ramda.pathOr(false, ['widget'], this.paramsService.get());
  }

  setWidgetState() {
    const EVENT = {
      type: 'onSetWidgetState',
      expire: this.storageService.getConversationExpiration()
    };
    _debugX(BotSocketIoServiceV1.getClassName(), 'setWidgetState', { EVENT });
    setTimeout(() => window.parent.postMessage(EVENT, '*'), 0);
  }

  disconnectFromWidget() {
    if (
      lodash.isEmpty(this.socket)
    ) {
      _warnX(BotSocketIoServiceV1.getClassName(), 'Skipping disconnectFromWidget - this.socket is empty!');
      return;
    }
    this.socket.emit('disconnectFromWidget');
  }

  private transformMetadata(jwt: any) {
    //TODO handle JWT
    return { profile: {} };
  }

  postMessage(message: any) {
    if (this.session?.channel?.id === 'default') {
      this.eventsService.eventEmit({ onBotTyping: true });
    }
    this.eventsService.messageEmit(message);

    const payload = {
      message: {
        text: message?.text ? message.text : '',
        timestamp: message?.timestamp ? message.timestamp : new Date().getTime(),
        sender_action: message?.sender_action,
      },
      engagement: ramda.path(['engagement'], this.session),
      gAcaProps: this.gAcaPropsService.getGAcaProps(),
      confirmations: {
        piAgreement: message?.confirmations?.hasOwnProperty('piConfirmation') ? message.confirmations.piConfirmation : this.storageService.getPiConfirmation()
      },
      clientSideInfo: {
        ...this.configService.getEnvironment(),
        selectedLanguage: this.selectedLanguage
      }
    };

    _debugX(BotSocketIoServiceV1.getClassName(), 'postMessage', { payload: payload });

    this.socket.emit('message', payload);
  }

  /** Map to previous transcript structure */
  private mapTranscriptOnContinue(transcript: any[]) {
    transcript.forEach(item => {
      if (item?.sender_action?.data) {
        item.messageId = ramda.pathOr(item?.sender_action?.data?.messageId, ['traceId', 'messageId'], item);
        item.conversationId = item.sender_action.data.conversationId;
      }
    });
  }

  refreshIoOptions(): void {
    const JWT_TOKEN_ENCODED = this.storageService.getConversationToken();
    const CONFIGURATION: any = this.configService.get();

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

    if (CONFIGURATION?.io) {
      this.reconnectionAttempts = CONFIGURATION.io.reconnectionAttempts;
    }

    // inContact specific parameters
    this.ioOptions.query[IO_OPTIONS_QUERY_PARAM_KEYS.TOKEN] = this.activatedRoute.snapshot.queryParamMap.get('token') || 'default';
    this.ioOptions.query[IO_OPTIONS_QUERY_PARAM_KEYS.SKILL] = this.activatedRoute.snapshot.queryParamMap.get('skill') || 'default';
    this.ioOptions.query[IO_OPTIONS_QUERY_PARAM_KEYS.POC] = this.activatedRoute.snapshot.queryParamMap.get('poc') || 'default';
  }

  scheduleReconnection() {
    try {
      if (lodash.isNil(this.reconnectionSchedule)) {
        const SESSION = this.sessionService.getSession();
        const RECONNECTION_OPTIONS = SESSION?.engagement?.chatApp?.service?.botSocketIo?.reconnection;

        const RECONNECTION_ENABLED = RECONNECTION_OPTIONS?.enabled || false;
        const RECONNECTION_INTERVAL = RECONNECTION_OPTIONS?.interval;

        _debugX(BotSocketIoServiceV1.getClassName(), 'scheduleReconnection', {
          this_socket: this.socket,
          reconnection_options: RECONNECTION_OPTIONS
        });

        if (RECONNECTION_ENABLED) {
          this.reconnectionSchedule = setTimeout(() => {
            if (
              !lodash.isEmpty(this.socket?.id)
            ) {
              this.reconnect();
            }
          }, RECONNECTION_INTERVAL);
        }
      } else {
        _warnX(BotSocketIoServiceV1.getClassName(), 'Skipping scheduleReconnection - already scheduled!');
      }
    } catch (error) {
      const ACA_ERROR = {
        type: 'SYSTEM_ERROR',
        message: error?.message,
        error: error
      };
      throw ACA_ERROR;
    }
  }

  clearReconnectionSchedule() {
    if (!lodash.isNil(this.reconnectionSchedule)) {
      clearTimeout(this.reconnectionSchedule);
    }
    this.reconnectionSchedule = null;
  }

  scheduleStopUserTypingEvent() {
    this.stopUserTypingEvent = setTimeout(() => {
      if (!lodash.isEmpty(this.socket?.id)) {
        this.handleUserTyping(false);
      }
    }, 5000);
  }

  handleUserTyping(isUserTyping: boolean) {
    if (lodash.isNil(this.stopUserTypingEvent)) {
      this.scheduleStopUserTypingEvent();
      this.socket.emit('user_typing', isUserTyping);
    } else {
      clearTimeout(this.stopUserTypingEvent);
      switch (isUserTyping) {
        case true:
          this.scheduleStopUserTypingEvent();
          break;
        case false:
          this.stopUserTypingEvent = null;
          this.socket.emit('user_typing', isUserTyping);
          break;
      }
    }
  }
}
