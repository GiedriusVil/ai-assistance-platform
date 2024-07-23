/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  ATTACHMENT_TYPES,
  EVENT_TYPE
} from "client-utils";


import {
  ChatWidgetServiceV1,
  EventsServiceV1,
  GAcaPropsServiceV1,
  ParamsServiceV1,
  ClientServiceV2,
  StylesServiceV2,
  BotSocketIoServiceV2,
  LeftPanelServiceV1,
  AttachmentsServiceV2,
  ConfigServiceV2,
  DataServiceV2,
  SessionServiceV2,
  StorageServiceV2,
  LocalStorageServiceV1
} from "client-services";
import { TranslateService } from '@ngx-translate/core';

const CHANNEL = {
  DEFAULT: 'default',
  ZENDESK: 'zen_desk'
};

const FIRST_ATTACHMENTS_EXCEPTIONS = ['s2pDisplayPiAgreementModal', ATTACHMENT_TYPES.PI_AGREEMENT_MODAL];

@Component({
  selector: 'aca-chat-main-view',
  templateUrl: './main.view.html',
  styleUrls: ['./main.view.scss']
})
export class MainView implements OnInit, AfterViewInit, OnDestroy {

  static getClassName() {
    return 'MainView';
  }

  closeIcon: any;

  @Input() width: string;
  @Input() isHeaderMissing = false;

  constructor(
    private configService: ConfigServiceV2,
    private gAcaPropsService: GAcaPropsServiceV1,
    private eventsService: EventsServiceV1,
    private storageService: StorageServiceV2,
    private stylesService: StylesServiceV2,
    private paramsService: ParamsServiceV1,
    private sessionService: SessionServiceV2,
    private clientService: ClientServiceV2,
    public attachmentsService: AttachmentsServiceV2,
    private chatWidgetService: ChatWidgetServiceV1,
    private botSocketIoService: BotSocketIoServiceV2,
    private dataService: DataServiceV2,
    private leftPanelService: LeftPanelServiceV1,
    private translateService: TranslateService,
    private localStorageService: LocalStorageServiceV1,
  ) { }

  @ViewChild('main') main: ElementRef;
  @ViewChild('container') container: ElementRef;

  private eventsSubscription: Subscription;
  private messagesSubscription: Subscription;
  private chatWidgetSubscription: Subscription;
  conversationMessages: any[] = [];

  _state = {
    isSessionEnded: false,
    isBotTyping: false,
    footerEnabled: true,
    piResponseSelected: false,
    isLeftPanelEnabled: false,
    iconsEnabled: false,
    isAudioMessageBeingHandled: false,
    isGridEnabled: true
  }

  state = lodash.cloneDeep(this._state);

  config: any;

  resizeObserver: any;

  ngOnInit() {
    this.initConfig();
    this.setupChatWidgetSubscribtion();
    this.eventsSubscription = this.eventsService.eventsEmitter.subscribe(event => {
      if (event.hasOwnProperty('onSessionEnded')) this.state.isSessionEnded = event['onSessionEnded'];
      if (event.hasOwnProperty('onBotTyping')) this.state.isBotTyping = event['onBotTyping'];
      if (event.hasOwnProperty('onConversationRestore')) this.handleConversationRestore();
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

    this.state.isLeftPanelEnabled = this.leftPanelService.leftPanelEnabled();
    const SESSION = this.sessionService.getSession();
    this.state.iconsEnabled = SESSION?.engagement?.chatApp?.messages?.icons?.enabled ?? false;
    this.state.isGridEnabled = (SESSION?.engagement?.chatApp?.grid?.enabled && SESSION?.engagement?.chatApp?.grid?.rows?.footer) ?? true;
    this.closeIcon = `${this.chatWidgetService.getChatAppHostUrl()}/en-US/assets/close.svg`;
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
    const HOST = this.configService.getHostName()
    let retVal = {
      js: {
        host: HOST,
        path: '/client-wbc/aca-wbc-message/main.js',
      },
      css: {
        host: HOST,
        path: '/client-wbc/aca-wbc-message/styles.css',
      },
      assets: {
        host: HOST,
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
    this.handlePreChat();
    this.handleConversationRestore();
    this.scrollToBottom();
    this.handlePreviewMode();
  }

  ngOnDestroy() {
    this.messagesSubscription.unsubscribe();
    this.eventsSubscription.unsubscribe();
  }

  setupChatWidgetSubscribtion() {
    this.chatWidgetSubscription = this.chatWidgetService.subscribe((event: any) => {
      _debugX(MainView.getClassName(), 'event', { event });
      if (event.type === ChatWidgetServiceV1.EVENT.CHAT_WINDOW_MINIMIZE) {
        this.hideChat(!event?.data);
      }

      if (event.type === ChatWidgetServiceV1.EVENT.CHAT_WINDOW_CLOSE) {
        this.conversationMessages = [];
      }
    });
  }

  chatHeaderActionsEnabled(): boolean {
    const BUY_HEADER = ramda.path(['engagement', 'chatApp', 'headerActions'], this.sessionService.getSession());
    const CHAT = ramda.path(['chat'], BUY_HEADER);
    const BASKET = ramda.path(['basket'], BUY_HEADER);
    const SURVEY = ramda.path(['survey'], BUY_HEADER);
    const PROFILE = ramda.path(['profile'], BUY_HEADER);
    const IS_ENABLED = CHAT || BASKET || SURVEY || PROFILE;
    if (IS_ENABLED === true) {
      return true;
    } else {
      return false;
    }
  }

  isLeftPanelButtonVisible() {
    const RET_VAL = this.leftPanelService.isButtonVisible();
    return RET_VAL;
  }

  getWidth() {
    const FULL_SCREEN_ENABLED = ramda.pathOr(false, ['engagement', 'chatApp', 'isFullscreen'], this.sessionService.getSession());
    return FULL_SCREEN_ENABLED &&
      this.leftPanelService.leftPanelEnabled() &&
      this.leftPanelService.isLeftPanelVisible()
      ? `calc(100vw - ${this.leftPanelService.leftPanelWidth()}px)`
      : FULL_SCREEN_ENABLED ? '100%' : this.width;
  }

  handlePreChat() {
    const preChatEnabled = ramda.pathOr(false, ['prechat'], this.configService.get());
    const minimized = ramda.pathOr(false, ['minimized'], this.chatWidgetService.getWidgetOptions());
    if (preChatEnabled) {
      this.eventsService.eventEmit({ onPreChatShow: true });
    } else if (minimized) {
      this.hideChat(!minimized);
    } else {
      this.eventsService.eventEmit({ onClientConnect: true });
    }
  }

  hideChat(data = true) {
    this.state.footerEnabled = data;
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

  instantScrollToBottom(): void {
    this.scrollToBottom('auto');
  }

  piAgreementClicked(message): void {
    this.clientService.postMessage(message);
    this.state.piResponseSelected = true;
  }

  handleUserActionEvent(event: any): void {
    // TODO --> LEGO too much of log messages
    // _debugX(MainView.getClassName(), 'handleUserActionEvent', {
    //   event
    // });
    const USER_EVENT_TYPE = ramda.path(['type'], event);
    const EVENT_DATA = ramda.path(['data'], event);
    switch (USER_EVENT_TYPE) {
      case 'POST_MESSAGE':
        this.clientService.postMessage(EVENT_DATA);
        break;
      case 'SCROLL_TO_BOTTOM':
        this.scrollToBottom();
        break;
      case 'INSTANT_SCROLL_TO_BOTTOM':
        this.instantScrollToBottom();
        break;
      case 'FEEDBACK':
        const FEEDBACK_DATA = this.constructFeedback(EVENT_DATA);
        this.dataService.postFeedback(FEEDBACK_DATA).subscribe({
          error: err => console.error(err)
        });
        break;
      case 'IS_AUDIO_MESSAGE_PLAYING':
        this.eventsService.eventEmit({ 'audioMessagePlaying': event?.data });
        break;
      default:
        break;
    }
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

  handleConversationRestore() {
    const conversation = this.storageService.getTranscript();
    _debugX(MainView.getClassName(), 'handleConversationRestore', { conversation });
    if (conversation) {
      this.mapFeedbackScore(conversation);
      const SANITIZED_CONVERSATION = conversation.map((message) => this.sanitizeMessage(message));
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

  onClose(event: Event) {
    event.preventDefault();
    if (this.chatWidgetService.getWidgetOptions().minimized) {
      this.chatWidgetService.setChatWindowMinimized(false);
      this.clientService.disconnectFromWidget();
    } else {
      this.eventsService.eventEmit({ onWidgetClose: true });
    }
  }

  isGridPlacementEnabled(placement: string): boolean {
    const CHAT_APP_GRID_SESSION = this.sessionService.getSession()?.engagement?.chatApp?.grid
    return this.state.isGridEnabled && CHAT_APP_GRID_SESSION?.layouts?.find(layout => layout?.placement === placement) && CHAT_APP_GRID_SESSION?.enabled;
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

  private handlePreviewMode() {
    const PREVIEW_MODE = this.localStorageService.getChatAppStateParameter('previewMode');
    if (PREVIEW_MODE) {
      const ANSWER = this.localStorageService.getItem('aiap-answer-preview');
      const MESSAGE = {
        type: 'bot',
        text: ANSWER?.text,
        timestamp: new Date().getTime()
      };
      _debugX(MainView.getClassName(), 'handlePreviewMode', { ANSWER });
      this.eventsService.messageEmit(MESSAGE);
    }
  }
}
