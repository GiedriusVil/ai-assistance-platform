/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  ATTACHMENT_TYPES,
} from "client-utils";

import {
  EventsServiceV1,
  GAcaPropsServiceV1,
  ParamsServiceV1,
  ClientServiceV1,
  StylesServiceV1,
  BotSocketIoServiceV1,
  AttachmentsServiceV1,
  ConfigServiceV1,
  DataServiceV1,
  SessionServiceV1,
  StorageServiceV1,
} from "client-services";

import { TranslateService } from '@ngx-translate/core';

const FIRST_ATTACHMENTS_EXCEPTIONS = [ATTACHMENT_TYPES.PI_AGREEMENT_MODAL];

@Component({
  selector: 'app-main-view',
  templateUrl: './main.view.html',
  styleUrls: ['./main.view.scss']
})
export class MainView implements OnInit, AfterViewInit, OnDestroy {

  static getClassName() {
    return 'MainView';
  }

  constructor(
    private configService: ConfigServiceV1,
    private gAcaPropsService: GAcaPropsServiceV1,
    private eventsService: EventsServiceV1,
    private storageService: StorageServiceV1,
    private stylesService: StylesServiceV1,
    private paramsService: ParamsServiceV1,
    private sessionService: SessionServiceV1,
    private clientService: ClientServiceV1,
    public attachmentsService: AttachmentsServiceV1,
    private botSocketIoService: BotSocketIoServiceV1,
    private dataService: DataServiceV1,
    private translateService: TranslateService,
  ) { }

  @ViewChild('main') main;
  @ViewChild('container') container;

  private eventsSubscription: Subscription;
  private messagesSubscription: Subscription;

  conversationMessages: any[] = [];

  isSessionEnded = false;
  isBotTyping = false;
  footerEnabled = true;
  piResponseSelected = false;
  config: any;
  state: any = {
    headerActions: {
      enabled: false
    },
    iconsEnabled: false,
  }

  ngOnInit() {
    this.initConfig();
    this.applyCustomCss();
    this.eventsSubscription = this.eventsService.eventsEmitter.subscribe(event => {
      if (event.hasOwnProperty('onFooterResize')) this.handleWindowResize(event['onFooterResize']);
      if (event.hasOwnProperty('onSessionEnded')) this.isSessionEnded = event['onSessionEnded'];
      if (event.hasOwnProperty('onBotTyping')) this.isBotTyping = event['onBotTyping'];
      if (event.hasOwnProperty('onInitialMaximize')) this.showAndInitChat();
      if (event.hasOwnProperty('onConversationRestore')) this.handleConversationRestore();
      if (event.hasOwnProperty('onConversationSave')) this.storageService.saveTranscript(this.conversationMessages);
      if (event.hasOwnProperty('onHeaderActionsShow')) this.resetHeaderActionsState(event['onHeaderActionsShow']);
    });
    this.messagesSubscription = this.eventsService.messagesEmitter.subscribe(event => {
      if (event) {
        const IS_TEXT = event.text;
        const IS_ATTACHMENT = !event.text && event.attachment && (this.conversationMessages.length > 0 || FIRST_ATTACHMENTS_EXCEPTIONS.includes(event.attachment.type));
        if (IS_TEXT || IS_ATTACHMENT) {
          const MESSAGE = this.sanitizeMessage(event);
          this.conversationMessages.push(MESSAGE);
        }

        this.storageService.saveTranscript(this.conversationMessages);
        this.scrollToBottom();
      }
    });

    const SESSION = this.sessionService.getSession();
    this.state.iconsEnabled = SESSION?.engagement?.chatApp?.messages?.icons?.enabled ?? false;
  }

  sanitizeMessage(message) {
    const SANITIZED_MESSAGE = lodash.cloneDeep(message);

    if (lodash.isEmpty(message?.wbc)) {
      const WBC_LOCATION = this.getWbcMessageLocation();
      SANITIZED_MESSAGE.wbc = WBC_LOCATION;
    }

    if (lodash.isEmpty(message?.configs)) {
      const WBC_CONFIGS = this.getWbcMessageConfigs(SANITIZED_MESSAGE);
      SANITIZED_MESSAGE.configs = WBC_CONFIGS;
    }

    return SANITIZED_MESSAGE;
  }

  getWbcMessageConfigs(message) {
    const RET_VAL = {
      host: message.wbc.js.host,
      path: message.wbc.js.path,
      language: this.translateService.getDefaultLang(),
    };

    return RET_VAL;
  }

  getWbcMessageLocation() {
    let retVal = {
      js: {
        host: '',
        path: '/client-wbc/aca-wbc-message/main.js',
      },
      css: {
        host: '',
        path: '/client-wbc/aca-wbc-message/styles.css',
      },
      assets: {
        host: '',
        path: '/client-wbc/aca-wbc-message/assets/',
      }
    }

    const MESSAGES_CONFIGS = ramda.pathOr({}, ['engagement', 'chatApp', 'messages'], this.sessionService.getSession());

    if (!lodash.isEmpty(MESSAGES_CONFIGS)) {
      retVal = lodash.merge(retVal, MESSAGES_CONFIGS);
    }
    return retVal;
  }

  ngAfterViewInit() {
    this.handleWindowResize();
    this.handlePreChat();
    this.handleConversationRestore();
  }

  ngOnDestroy() {
    this.messagesSubscription.unsubscribe();
    this.eventsSubscription.unsubscribe();
  }

  resetHeaderActionsState(enableHeaderActions: boolean = false): void {
    const STATE = lodash.cloneDeep(this.state);
    STATE.headerActions.enabled = enableHeaderActions;
    this.state = STATE;
    this.handleWindowResize();
  }

  handleWindowResize(footerHeight: number = 58) {
    if (this.main) {
      const SESSION = this.sessionService.getSession();
      const SESSION_ENGAGEMENT_CHAT_APP = ramda.path(['engagement', 'chatApp'], SESSION);
      const HEADER_HEIGHT = ramda.pathOr(50, ['headerHeight'], SESSION_ENGAGEMENT_CHAT_APP);
      const HEADER_ACTIONS_HEIGHT = ramda.pathOr(0, ['headerActionsHeight'], SESSION_ENGAGEMENT_CHAT_APP);

      let headerAndActionsHeight = HEADER_HEIGHT;
      if (this.state.headerActions.enabled) {
        headerAndActionsHeight += HEADER_ACTIONS_HEIGHT;
      }
      const MAIN_HEIGHT = window.innerHeight - (headerAndActionsHeight + footerHeight);
      setTimeout(() => {
        this.main.nativeElement.style.height = `${MAIN_HEIGHT}px`;
        this.main.nativeElement.style.top = `${headerAndActionsHeight}px`;
      }, 0);

      setTimeout(() => {
        this.scrollToBottom();
      }, 0);
    } else {
      setTimeout(() => {
        this.handleWindowResize(footerHeight);
      }, 250);
    }
  }

  handlePreChat() {
    const preChatEnabled = ramda.pathOr(false, ['prechat'], this.configService.get());
    const minimized = ramda.pathOr(false, ['minimized'], this.paramsService.get());
    if (preChatEnabled) {
      this.eventsService.eventEmit({ onPreChatShow: true });
    } else if (minimized) {
      this.hideChat();
    } else {
      this.eventsService.eventEmit({ onClientConnect: true });
    }
  }

  hideChat() {
    this.main.nativeElement.style.display = 'none';
    this.footerEnabled = false;
  }

  async applyCustomCss() {
    const G_ACA_PROPS = this.gAcaPropsService.getGAcaProps();
    const TENANT_ID = ramda.path(['tenantId'], G_ACA_PROPS);
    const TENANT_HASH = ramda.path(['tenantHash'], G_ACA_PROPS);
    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const ACA_ERROR = {
        type: 'VALIDATION_ERROR',
        message: ` Missing required params.tenantId attribute!`
      };
      throw ACA_ERROR;
    }
    const ENGAGEMENT_ID = ramda.path(['engagementId'], G_ACA_PROPS);
    const ASSISTANT_ID = ramda.path(['assistantId'], G_ACA_PROPS);
    await this.stylesService.applyCustomCss({
      tenantId: TENANT_ID,
      tenantHash: TENANT_HASH,
      engagementId: ENGAGEMENT_ID,
      assistantId: ASSISTANT_ID
    });
  }

  showAndInitChat() {
    this.eventsService.eventEmit({ onClientConnect: true });
    this.main.nativeElement.style.display = 'block';
    this.footerEnabled = true;
  }

  /**
   *  Sets the behavior for a scrolling box when scrolling is triggered
   * @param behavior default is 'smooth' and 'auto' to scroll instantly
   */
  scrollToBottom(behavior = 'smooth') {
    setTimeout(() => {
      this.main.nativeElement.scrollTo({
        top: this.main.nativeElement.scrollHeight,
        behavior: behavior,
        left: 0
      });
    }, 0);
  }


  handleUserActionEvent(event: any): void {
    // TODO - TOO much of log messages
    // _debugX(MainView.getClassName(), 'handleUserActionEvent', {
    //   event
    // });
    const EVENT_TYPE = ramda.path(['type'], event);
    const EVENT_DATA = ramda.path(['data'], event);
    switch (EVENT_TYPE) {
      case 'POST_MESSAGE':
        this.clientService.postMessage(EVENT_DATA);
        break;
      case 'SCROLL_TO_BOTTOM':
        this.scrollToBottom();
        break;
      case 'FEEDBACK':
        const FEEDBACK_DATA = this.constructFeedback(EVENT_DATA);
        this.dataService.postFeedback(FEEDBACK_DATA).subscribe(
          () => { },
          err => console.error(err)
        );
        break;
      default:
        break;
    }
  }

  handleConversationRestore() {
    const conversation = this.storageService.getTranscript();
    _debugX(MainView.getClassName(), 'handleConversationRestore', { conversation });
    if (conversation) {
      const SANITIZED_CONVERSATION = conversation.map((message) => this.sanitizeMessage(message));
      this.mapFeedbackScore(SANITIZED_CONVERSATION);
      this.conversationMessages = SANITIZED_CONVERSATION;
    }
    this.eventsService.eventEmit({ onBotTyping: false });
    this.scrollToBottom('auto');
  }

  isBotOrAgentTypingIcon(): string {
    let retVal = 'persona-icon icon--bot';
    const IS_DEFAULT_BOT_CHANNEL_ACTIVE = this.clientService.isDefaultBotChannelActive();
    if (!IS_DEFAULT_BOT_CHANNEL_ACTIVE) {
      retVal = 'persona-icon icon--agent';
    }
    return retVal;
  }

  isBotOrAgentTyping(): string {
    let retVal = 'message--row message--float clearfix message--break bot';
    const IS_DEFAULT_BOT_CHANNEL_ACTIVE = this.clientService.isDefaultBotChannelActive();
    if (!IS_DEFAULT_BOT_CHANNEL_ACTIVE) {
      retVal = 'message--row message--float clearfix message--break agent';
    }
    return retVal;
  }

  constructFeedback(data) {
    const G_ACA_PROPS: any = this.gAcaPropsService.getGAcaProps();
    const TOKEN = this.botSocketIoService.conversationToken;
    const FEEDBACK_DATA = ramda.path(['feedback'], data);
    const DATA = {
      token: TOKEN,
      gAcaProps: G_ACA_PROPS,
      feedback: {
        assistant: G_ACA_PROPS.assistantId,
        tenant: G_ACA_PROPS.tenantId,
        conversationToken: this.botSocketIoService.conversationToken,
        ...FEEDBACK_DATA
      }
    };
    return DATA;
  }

  private initConfig(): void {
    this.config = this.configService.getConfig();
  }

  /** Transform feedbackScore based on structure  */
  private mapFeedbackScore(conversation) {
    conversation.forEach(item => {
      const feedbackScore = item?.feedback?.attachments[0]?.score;
      if (feedbackScore) {
        item.feedback.feedbackScore = feedbackScore;
      }
    });
  }
}
