/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable, Injector } from '@angular/core';

import * as lodash from 'lodash';

import {
  ClientServiceV2,
  BotSocketIoServiceV2,
  StorageServiceV2,
  EventsServiceV1,
  GAcaPropsServiceV1,
} from '.';

import zChat from 'zendesk-web-sdk';

import {
  _infoX,
  _errorX,
  LIVE_CHAT_TYPE,
  Z_CHAT_EVENT_TYPE,
  Z_CHAT_CONNECTION_STATUS,
  Z_CHAT_ACCOUNT_STATUS
} from "client-utils";

@Injectable()
export class ZendeskLiveAgentServiceV2 {
  public liveChatInitiated = false;
  public preChatFormDisplayed = false;
  public departmentsChecked = false;
  public agentsJoined = 0;
  public clientService: ClientServiceV2;
  public botSocketIoService: BotSocketIoServiceV2;

  constructor(
    private eventsService: EventsServiceV1,
    private gAcaProps: GAcaPropsServiceV1,
    private storageService: StorageServiceV2,
    private injector: Injector
  ) { }

  static getClassName() {
    return 'ZendeskLiveAgentServiceV2';
  }

  getClientService(): ClientServiceV2 {
    return this.injector.get<ClientServiceV2>(ClientServiceV2);
  }

  getBotSocketIoService(): BotSocketIoServiceV2 {
    return this.injector.get<BotSocketIoServiceV2>(BotSocketIoServiceV2);
  }

  connect(apiKey: string): void {
    zChat.init({
      account_key: apiKey
    });
    _infoX(ZendeskLiveAgentServiceV2.getClassName(), 'connect', { INITIALIZED: true });

    this.clientService = this.getClientService();
    this.botSocketIoService = this.getBotSocketIoService();
    this.setListeners();
  }

  setListeners(): void {
    zChat.on('connection_update', status => {
      this.connectionUpdate(status);
    });

    zChat.on('chat', event_data => {
      this.chat(event_data);
    });

    zChat.on('error', err => {
      this.handleError(err);
    });
  }

  handleError(err: any): void {
    _errorX('[ZENDESK LIVE CHAT] Error:', err);
  }

  connectionUpdate(status: string): void {
    switch (status) {
      case Z_CHAT_CONNECTION_STATUS.CONNECTED:
        _infoX('[ZENDESK LIVE CHAT] status connection:', Z_CHAT_CONNECTION_STATUS.CONNECTED);

        this.checkAccountStatus();
        break;

      case Z_CHAT_CONNECTION_STATUS.CONNECTING:
        _infoX('[ZENDESK LIVE CHAT] status connection:', Z_CHAT_CONNECTION_STATUS.CONNECTING);
        break;

      case Z_CHAT_CONNECTION_STATUS.CLOSED:
        _infoX('[ZENDESK LIVE CHAT] status connection:', Z_CHAT_CONNECTION_STATUS.CLOSED);
        break;
    }
  }

  checkAccountStatus(): void {
    const ACCOUNT_STATUS = this.getAccountStatus();

    switch (ACCOUNT_STATUS) {
      case Z_CHAT_ACCOUNT_STATUS.ONLINE:
        _infoX('[ZENDESK LIVE CHAT] account status:', Z_CHAT_ACCOUNT_STATUS.ONLINE);

        if (!this.departmentsChecked) {
          this.getAvailableDepartments();
        }
        break;

      case Z_CHAT_ACCOUNT_STATUS.OFFLINE:
      case Z_CHAT_ACCOUNT_STATUS.AWAY:
        _infoX('[ZENDESK LIVE CHAT] account status:', ACCOUNT_STATUS);

        const MESSAGE = 'Sorry, in this moment agents are away / offline. Please reach them out later or open a ticket.';
        this.rejectionMessage(MESSAGE);
        break;
    }
  }

  getAccountStatus(): string {
    return zChat.getAccountStatus();
  }

  getAvailableDepartments(): void {
    try {
      const ONLINE_DEPARTMENTS = [];
      const DEPARTMENTS = zChat.getAllDepartments();

      if (DEPARTMENTS) {
        DEPARTMENTS.forEach(department => {
          if (department.status === Z_CHAT_ACCOUNT_STATUS.ONLINE) {
            ONLINE_DEPARTMENTS.push(department);
          }
        });

        if (ONLINE_DEPARTMENTS) {
          this.fillDepartmentsInDropdown(ONLINE_DEPARTMENTS);
          this.departmentsChecked = true;
          _infoX(ZendeskLiveAgentServiceV2.getClassName(), 'getAvailableDepartments', { ONLINE_DEPARTMENTS });
        } else {
          const MESSAGE = 'Sorry. In this moment there are not available departments. Please, come back later or open a ticket.';
          this.rejectionMessage(MESSAGE);
        }
      }
    } catch (error) {
      _errorX(ZendeskLiveAgentServiceV2.getClassName(), 'getAvailableDepartments', { error });
    }
  }

  fillDepartmentsInDropdown(departments: any[]): void {
    const ATTACHMENTS = [];

    departments.forEach(department => {
      const ATTACHMENT = {
        title: department.name,
        type: 'postback',
        payload: department.id
      };

      ATTACHMENTS.push(ATTACHMENT);
    });

    const DROPDOWN_DEPS = {
      type: LIVE_CHAT_TYPE.BOT,
      timestamp: new Date().getTime(),
      attachment: {
        attachments: ATTACHMENTS,
        buttonName: 'Please select a department',
        type: 'dropdown'
      }
    };

    this.eventsService.messageEmit(DROPDOWN_DEPS);
    this.preChatFormDisplayed = true;
  }

  postMessage(message: any): void {
    const IS_NOT_CHATTING = this.preChatFormCalled();

    switch (IS_NOT_CHATTING) {
      case true:
        this.startChat(parseInt(message?.text));
        break;

      case false:
        this.postUserMessage(message?.text);
        this.typingToAgent(false);
        break;
    }

    this.eventsService.messageEmit(message);
  }

  startChat(departmentId: number): void {
    const SESSION = this.botSocketIoService.getSession();
    const VISITOR_INFO = {
      display_name: `${SESSION.user.firstName} ${SESSION.user.lastName}`,
      email: SESSION.user.email
    };

    zChat.clearVisitorDefaultDepartment(() => {
      zChat.setVisitorInfo(VISITOR_INFO, () => {
        zChat.setVisitorDefaultDepartment(departmentId, () => {
          zChat.addTags(['VA'], () => {
            this.liveChatInitiated = true;
            this.preChatFormDisplayed = false;
            const TRANSCRIPT = this.constructTranscript();
            const MESSAGE = this.prepareMessage('<strong>Transcripts were sent to the agent</strong>', LIVE_CHAT_TYPE.USER);
            this.postUserMessage(TRANSCRIPT);
            this.eventsService.messageEmit(MESSAGE);
          });
        });
      });
    });
  }

  constructTranscript() {
    const TRANCRIPT = this.storageService.getTranscript();
    let retVal = 'Hello';

    if (!lodash.isEmpty(TRANCRIPT)) {
      TRANCRIPT.forEach(msg => {
        retVal += `${msg['type']}: ${msg['text']}\n\n`;
      });
    }

    return retVal.trim();
  }

  postUserMessage(message: string): void {
    zChat.sendChatMsg(message);
    _infoX('[ZENDESK LIVE CHAT] User message sent successfully:', message);
  }

  chat(event_data: any): void {
    _infoX('[ZENDESK LIVE CHAT] chat event:', event_data);

    switch (event_data.type) {
      case Z_CHAT_EVENT_TYPE.MSG:
        const MSG_PAYLOAD = this.prepareMessage(event_data.msg, LIVE_CHAT_TYPE.AGENT);
        this.clientService.handleIncomingMessage(MSG_PAYLOAD);
        break;

      case Z_CHAT_EVENT_TYPE.QUEUE_POSITION:
        const POSITION = `Queue position: ${event_data.queue_position}`;
        const POSITION_PAYLOAD = this.prepareMessage(POSITION, LIVE_CHAT_TYPE.NOTIFICATION);
        this.clientService.handleIncomingMessage(POSITION_PAYLOAD);
        break;

      case Z_CHAT_EVENT_TYPE.MEMBER_JOIN:
        if (this.isAgent(event_data.nick)) this.agentsJoined += 1;
        const MEMBER_JOIN = event_data.nick === 'visitor' ? 'You have joined' : `${event_data.display_name} has joined`;
        const MEMBER_JOIN_PAYLOAD = this.prepareMessage(MEMBER_JOIN, LIVE_CHAT_TYPE.NOTIFICATION);
        this.clientService.handleIncomingMessage(MEMBER_JOIN_PAYLOAD);
        break;

      case Z_CHAT_EVENT_TYPE.TYPING:
        this.eventsService.eventEmit({ onBotTyping: event_data.typing });
        break;

      case Z_CHAT_EVENT_TYPE.MEMBER_LEAVE:
        if (this.isAgent(event_data.nick)) {
          this.agentsJoined -= 1;
          if (this.agentsJoined === 0) this.endLiveChat();
        }
        const MEMBER_LEAVE = event_data.nick === 'visitor' ? 'You have left the chat' : `${event_data.display_name} has left the chat`;
        const MEMBER_LEAVE_PAYLOAD = this.prepareMessage(MEMBER_LEAVE, LIVE_CHAT_TYPE.NOTIFICATION);
        this.clientService.handleIncomingMessage(MEMBER_LEAVE_PAYLOAD);
        break;
    }
  }

  prepareMessage(message: string, type: string): any {
    const RET_VAL = {
      text: message,
      timestamp: new Date().getTime(),
      type: type
    };

    return RET_VAL;
  }

  handleIncomingMessage(message: string): void {
    this.eventsService.messageEmit(message);
  }

  typingToAgent(isTyping: boolean): void {
    zChat.sendTyping(isTyping);
  }

  isAgent(nickname) {
    return nickname.startsWith('agent:');
  }

  removeListeners(eventType: string): void {
    zChat.un(eventType, () => {
      _infoX(ZendeskLiveAgentServiceV2.getClassName(), 'removeListeners', { eventType });
    });
  }

  endLiveChat(): void {
    this.liveChatInitiated = false;
    const CLEAR_DEPARTMENT = {
      clear_dept_id_on_chat_ended: true
    };

    zChat.endChat(CLEAR_DEPARTMENT, () => {
      _infoX(ZendeskLiveAgentServiceV2.getClassName(), 'endLiveChat', { END: true });
      this.departmentsChecked = false;
      this.returnToBotConversation();
    });
  }

  rejectionMessage(message: string) {
    const MESSAGE = this.prepareMessage(message, LIVE_CHAT_TYPE.BOT);
    this.clientService.handleIncomingMessage(MESSAGE);
    this.returnToBotConversation();
  }

  returnToBotConversation() {
    const MESSAGE = this.prepareMessage('End session with Zendesk Agent', LIVE_CHAT_TYPE.USER);
    this.botSocketIoService.postMessage(MESSAGE);
  }

  disconnectFromWidget() {
    // TODO: Implement this method
  }

  isLiveChatInitiated(): boolean {
    return this.liveChatInitiated;
  }

  preChatFormCalled(): boolean {
    return this.preChatFormDisplayed;
  }

  disconnectChat(): void {
    this.endLiveChat();
  }
}
