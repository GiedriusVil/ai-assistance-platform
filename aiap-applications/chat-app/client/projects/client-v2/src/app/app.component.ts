/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, OnInit, NgZone, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { catchError, take } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  HostPageInfoService,
  HTMLElementsService,
} from './services';
import {
  ChatWidgetServiceV1,
  EventsServiceV1,
  GAcaPropsServiceV1,
  ClientServiceV2,
  StylesServiceV2,
  LeftPanelServiceV1,
  ConfigServiceV2,
  SessionServiceV2,
  StorageServiceV2,
  EventBusServiceV1,
  LocalStorageServiceV1,
} from "client-services";

import {
  CHAT_APP_BUTTON_EVENT,
  EVENT_TYPE,
  WINDOW_EVENT_TYPES,
  IEvent,
  _debugX,
  _errorX,
  SENDER_ACTIONS
} from "client-utils";

@Component({
  selector: 'aca-chat-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  static getClassName() {
    return 'AppComponent';
  }

  static getHTMLTagName() {
    const RET_VAL = 'aca-chat-app'
    return RET_VAL;
  }

  static getWbcId() {
    return 'aca-wbc-chat-app';
  }

  @Input() host: string;
  @Input('acaWidgetOptions') public acaWidgetOptions;

  @HostListener('window:message', ['$event'])
  handleChatOpenEvent(event) {
    if (event?.data?.type === WINDOW_EVENT_TYPES.OPEN_CHAT_CLIENT) {
      _debugX(AppComponent.getClassName(), WINDOW_EVENT_TYPES.OPEN_CHAT_CLIENT, { event });
      this.chatWidgetService.broadcast(ChatWidgetServiceV1.EVENT.CHAT_WINDOW_OPEN, event?.data?.data);
    }

    if (event?.data?.type === WINDOW_EVENT_TYPES.OPEN_CHAT_PREVIEW_MODE_OPEN) {
      _debugX(AppComponent.getClassName(), WINDOW_EVENT_TYPES.OPEN_CHAT_PREVIEW_MODE_OPEN, { event });
      this.handleChatWindowPreviewOpen(event?.data?.data);
    }

    if (event?.data?.type === WINDOW_EVENT_TYPES.OPEN_CHAT_PREVIEW_MODE_CLOSE) {
      _debugX(AppComponent.getClassName(), WINDOW_EVENT_TYPES.OPEN_CHAT_PREVIEW_MODE_CLOSE, { event });
      this.chatWidgetService.broadcast(ChatWidgetServiceV1.EVENT.CHAT_PREVIEW_MODE, false);
      this.chatWidgetService.broadcast(ChatWidgetServiceV1.EVENT.CHAT_WINDOW_CLOSE, true);
    }
  }

  title = 'aca-wbc-chat-app';

  private eventsSubscription: Subscription;
  private eventBusSubscription: Subscription;

  _state = {
    chatWidgetSubscription: undefined,
    previewMode: {
      enabled: false,
      data: null,
    },
  }

  state: any = lodash.cloneDeep(this._state);

  constructor(
    public ngZone: NgZone,
    public chatWidgetService: ChatWidgetServiceV1,
    private configService: ConfigServiceV2,
    private storageService: StorageServiceV2,
    private eventsService: EventsServiceV1,
    private sessionService: SessionServiceV2,
    private gAcaPropsService: GAcaPropsServiceV1,
    private clientService: ClientServiceV2,
    private hostPageInfoService: HostPageInfoService,
    private htmlElementsService: HTMLElementsService,
    private stylesService: StylesServiceV2,
    private leftPanelService: LeftPanelServiceV1,
    private eventBusService: EventBusServiceV1,
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private localStorageService: LocalStorageServiceV1
  ) { }

  ngOnInit() {
    this.registerAcaJqueryPlugin();
    this.elementRef.nativeElement.eventBus = this.eventBusService.getEventBus();
    // const NEW_STATE = lodash.cloneDeep(this._state);
    this.chatWidgetService.reloadWidgetOptions(this.acaWidgetOptions);
    this.htmlElementsService.loadDependenciesJS();
    this.htmlElementsService.loadDependenciesCSS();
    this.setChatWidgetSubscription();
    //
    this.handleChatWindowState();
    //
    this.confirmIsClientReady();
  }

  ngOnDestroy(): void {
    this.chatWidgetService.destroy(this._state.chatWidgetSubscription);
  }

  setChatWidgetSubscription() {
    this._state.chatWidgetSubscription = this.chatWidgetService.subscribe((event: any) => {
      _debugX(AppComponent.getClassName(), 'event', { event });
      if (event.type === ChatWidgetServiceV1.EVENT.CHAT_WINDOW_OPEN) {
        this.handleChatWindowOpen();
      }
      if (event.type === ChatWidgetServiceV1.EVENT.CHAT_WINDOW_CLOSE) {
        this.handleChatWindowClose();
      }
      if (event.type === ChatWidgetServiceV1.EVENT.CHAT_WINDOW_MINIMIZE) {
        //this.handleChatWindowMinimize(event?.data);
      }
    });
  }

  private registerAcaJqueryPlugin() {
    window['acaJqueryPluginReference'] = {
      component: this,
      ngZone: this.ngZone,
      sendMessage: (message: any) => {
        this.clientService.postMessage(message);
      },
      openNewTab: (params: any) => {
        try {
          const EVENT = {
            type: 'onOpenNewTab',
            url: params?.url,
          };
          _debugX(AppComponent.getClassName(), 'onOpenNewTab', { EVENT });
          setTimeout(() => {
            // SAST_FIX ['postMessage']
            window.parent['postMessage'](EVENT, '*');
          }, 0);
        } catch (error) {
          _errorX(AppComponent.getClassName(), 'openNewTab', { error, params });
        }
      },
      emitEventBusEvent: (event: IEvent) => {
        this.eventBusService.emit(event);
        _debugX(AppComponent.getClassName(), 'emitEventBusEvent', { event });
      }
    };
  }

  handleChatWindowOpen() {
    this.initEventBus();
    this.subscribeToEvents();
    this.requestHostPageInfo();
  }

  handleChatWindowClose() {
    this.eventsSubscription.unsubscribe();
    this.eventBusSubscription.unsubscribe();
    this.storageService.clearTranscript();
    this.leftPanelService.resetLeftPanelState();
  }

  handleChatClose(event) {
    _debugX(AppComponent.getClassName(), 'handleChatClose', { event });
    if (this.state.previewMode.enabled) {
      this.chatWidgetService.broadcast(ChatWidgetServiceV1.EVENT.CHAT_PREVIEW_MODE, false);
      this.chatWidgetService.broadcast(ChatWidgetServiceV1.EVENT.CHAT_WINDOW_CLOSE, true);
      return;
    }
    const MINIMIZED = this.isMinimized();
    if (MINIMIZED) {
      this.chatWidgetService.setChatWindowMinimized(false);
      this.clientService.disconnectFromWidget();
    } else {
      this.changeDetectorRef.detectChanges();
      this.eventsService.eventEmit({ onWidgetClose: true });
    }
  }

  handleMinimizeMaximizeState() {
    const MINIMIZED = this.isMinimized();
    this.chatWidgetService.broadcast(ChatWidgetServiceV1.EVENT.CHAT_WINDOW_MINIMIZE, !MINIMIZED);
    this.changeDetectorRef.detectChanges();
  }

  isMinimized(): boolean {
    return this.chatWidgetService.getWidgetOptions().minimized;
  }

  emitHeaderButtonEvent(data: any) {
    if (this.isMinimized()) {
      this.handleMinimizeMaximizeState();
    }
    this.changeDetectorRef.detectChanges();
    this.eventsService.eventEmit(data);
  }

  handleLanguageChange(data: any) {
    this.setLanguage(data?.iso2 || 'en');
    this.translateService.get('chat_app_language_change.text').pipe(take(1)).subscribe(text => {
      const MESSAGE = {
        sender_action: {
          type: SENDER_ACTIONS.LANGUAGE_CHANGE,
          data: text,
        }
      };
      this.gAcaPropsService.applyUserSelectedLanguage(data);
      this.clientService.postMessage(MESSAGE);
      const TRANSCRIPT: any[] = this.storageService.getTranscript();
      if (!TRANSCRIPT.find(message => message?.type === 'user')) {
        this.clientService.postMessage(null);
      }
    });
  }

  setLanguage(iso2: string) {
    this.translateService.use(iso2);
    this.translateService.setDefaultLang(iso2);
    this.localStorageService.setChatAppStateParameter('language', iso2);
    this.changeDetectorRef.detectChanges();
    _debugX(AppComponent.getClassName(), 'setLanguage', { iso2 });
  }

  handleChatWindowState() {
    const OPENEND = ramda.path(['opened'], this.chatWidgetService.getWidgetOptions());
    try {
      if (
        OPENEND
      ) {
        this.handleChatWindowOpen();
      }
    } catch (error) {
      _errorX(AppComponent.getClassName(), 'handleChatWindowState', {
        error: error,
        opened: OPENEND,
      });
      throw error;
    }
  }

  handleQuickLinkEvent(id: any) {
    const QUICK_LINKS_DATA = this.localStorageService.getItem('aiap-header-quick-links');
    const CURRENT_LANGUAGE = this.localStorageService.getChatAppStateParameter('language');
    const QUICK_LINKS = QUICK_LINKS_DATA?.find(data => data?.language === CURRENT_LANGUAGE)?.links;
    const QUICK_LINK = QUICK_LINKS?.find(link => link?.id === id);
    _debugX(AppComponent.getClassName(), 'handleQuickLinkEvent', { QUICK_LINKS_DATA, CURRENT_LANGUAGE });
    if (QUICK_LINK && Object.prototype.hasOwnProperty.call(QUICK_LINK, 'event')) {
      this.emitHeaderButtonEvent({ onContentShow: QUICK_LINK.event?.data });
    }
    if (QUICK_LINK?.url) {
      window.open(QUICK_LINK?.url, '_blank');
    }
  }

  private initEventBus() {
    this.eventBusSubscription?.unsubscribe(); 
    this.eventBusSubscription = this.eventBusService.subscribe?.((value: IEvent) => {
      switch (value.type) {
        case EVENT_TYPE.CLOSE_CHAT_WINDOW: this.handleChatClose(value); break;
        case EVENT_TYPE.MINIMIZE_CHAT_WINDOW: this.handleMinimizeMaximizeState(); break;
        case EVENT_TYPE.TEST_CASE_SHOW: this.emitHeaderButtonEvent({ onTestCasesShow: true }); break;
        case EVENT_TYPE.SHOW_SURVEY_MODAL: this.emitHeaderButtonEvent({ onSurveyShow: true }); break;
        case EVENT_TYPE.OPEN_CONTENT_MODAL: this.emitHeaderButtonEvent({ onContentShow: value.data }); break;
        case EVENT_TYPE.LANGUAGE_CHANGE: this.handleLanguageChange(value.data); break;
        case EVENT_TYPE.OPEN_QUICK_LINK: this.handleQuickLinkEvent(value.data); break;
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  private subscribeToEvents(): void {
    window.addEventListener('message', event => {
      if (event?.data?.hostPageInfo) {
        this.handleHostPageInfoEvent(event);
      }
    });
    this.eventsSubscription = this.eventsService.eventsEmitter.subscribe((event) => {
      if (event.hasOwnProperty('onClientConnect')) {
        this.handleClientConnectEvent(event);
      }
    });
  }

  private handleHostPageInfoEvent(event: any) {
    this.gAcaPropsService?.applyHostPageInfo(event.data.hostPageInfo);
    this.updateUserSelectedLanguage();
    this.authorizeSession();
  }

  private async authorizeSession() {
    if (this.state.previewMode.enabled) {
      this.sessionService.setSession(this.setPreviewModeSession());
      this.applyCustomCss();
      this.chatWidgetService.broadcast(ChatWidgetServiceV1.EVENT.CHAT_WINDOW_INITIALIZED, true);
      this.eventsService.sessionEmit(this.setPreviewModeSession());
    } else {
      this.sessionService.authorize()
      .pipe(
        catchError((error: any) => this.handleAuthorizationError(error))
        ).subscribe(async (session: any) => {
          _debugX(AppComponent.getClassName(), 'authorizeSession', { session });
          this.gAcaPropsService.mergeGAcaProps(session?.gAcaProps);
          const TOKEN = session?.token?.value;
          this.storageService.setConversationToken(TOKEN);
          this.storageService.setChatCookie({ conversationToken: TOKEN });
          this.eventsService.sessionEmit(session);
          const G_ACA_PROPS = this.gAcaPropsService.getGAcaProps();
          this.setLanguage(G_ACA_PROPS?.userSelectedLanguage?.iso2);
          const CONNECT_EVENT = {
            onClientConnect: true,
            gAcaProps: G_ACA_PROPS
          };
          this.applyCustomCss();
          this.eventsService.eventEmit(CONNECT_EVENT);
          this.chatWidgetService.broadcast(ChatWidgetServiceV1.EVENT.CHAT_WINDOW_INITIALIZED, true);
        });
    }
  }

  private handleAuthorizationError(error: any) {
    _debugX(AppComponent.getClassName(), 'handleAuthorizationError', { error });
    // TO_BE_ADDED

    const AUTHORIZATION_ERROR_VIEW = 'aca-authorization-error-view';
    this.chatWidgetService.broadcast(ChatWidgetServiceV1.EVENT.CHAT_VIEW_CHANGE, AUTHORIZATION_ERROR_VIEW);
    return of();
  }

  private handleClientConnectEvent(event: any) {
    _debugX(AppComponent.getClassName(), 'handleClientConnectEvent', { event });
    if (event?.gAcaProps) {
      this.clientService.connect();
    }
  }

  async applyCustomCss() {
    try {
      const CHAT_APP_HOST_URL = this.chatWidgetService.getChatAppHost();
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
        assistantId: ASSISTANT_ID,
        chatAppHostUrl: CHAT_APP_HOST_URL,
      });
    } catch (error) {
      _debugX(AppComponent.getClassName(), 'ERROR', { error });
    }
  }

  private requestHostPageInfo() {
    const DATA_ITEM_REQS = ramda.path(['hostPageInfo', 'dataItemReqs'], this.configService.getConfig());
    const PARAMS = {
      dataItemReqs: DATA_ITEM_REQS
    };
    _debugX(AppComponent.getClassName(), 'requestHostPageInfo', { PARAMS });
    const HOST_PAGE_INFO = this.hostPageInfoService.getInfo(PARAMS);

    this.gAcaPropsService?.applyHostPageInfo(HOST_PAGE_INFO);
    this.updateUserSelectedLanguage();
    this.authorizeSession();
  }

  isReady() {
    const RET_VAL =
      this.htmlElementsService.areLoadedJSDependencies() &&
      this.htmlElementsService.areLoadedCSSDependencies();
    return RET_VAL;
  }

  confirmIsClientReady() {
    const CHECK_INTERVAL = 250;
    let time = 0;
    const INTERVAL_ID = setInterval(() => {
      time = time + CHECK_INTERVAL;
      if (this.isReady()) {
        clearInterval(INTERVAL_ID);
        _debugX(AppComponent.getClassName(), 'confirmIsClientReady', true);
        this.broadcastChatAppReadyEvent();
      }
      if (time >= 10000) {
        clearInterval(INTERVAL_ID);
        _errorX(AppComponent.getClassName(), 'confirmIsClientReady -> JS and CSS dependencies were not loaded properly!');
      }
    }, CHECK_INTERVAL)
  }

  broadcastChatAppReadyEvent() {
    setTimeout(() => {
      // SAST_FIX ['postMessage']
      window['postMessage']({ type: CHAT_APP_BUTTON_EVENT.CHAT_APP_CLIENT_READY }, '*')
    }, 0);
  }

  addUserSelectedLanguageToGACAProps(selectedLanguage: { name: string, iso2: string }) {
    this.gAcaPropsService?.applyUserSelectedLanguage(selectedLanguage);
  }

  getUserSelectedLanguage(): { name: string, iso2: string } {
    const LANGUAGE_SELECTED_IN_LANGUAGE_SELECTION_FORM = this.storageService.getUserSelectedLanguage();
    return LANGUAGE_SELECTED_IN_LANGUAGE_SELECTION_FORM;
  }

  private handleChatWindowPreviewOpen(data: any) {
    this.state.previewMode.enabled = true;
    this.state.previewMode.data = data;
    this.chatWidgetService.broadcast(ChatWidgetServiceV1.EVENT.CHAT_PREVIEW_MODE, true);
    this.handleChatWindowOpen();
  }

  private updateUserSelectedLanguage() {
    const G_ACA_PROPS = this.gAcaPropsService.getGAcaProps();
    const USER_SELECTED_LANGUAGE = this.getUserSelectedLanguage();
    const ISO2 = USER_SELECTED_LANGUAGE?.iso2 || G_ACA_PROPS?.isoLang;
    this.configService.setLanguage(ISO2);
    this.setLanguage(ISO2);
    this.addUserSelectedLanguageToGACAProps(USER_SELECTED_LANGUAGE);
  }

  private setPreviewModeSession() {
    const G_ACA_PROPS = this.gAcaPropsService.getGAcaProps();
    G_ACA_PROPS.tenantHash = this.state.previewMode.data?.tenant?.tenantHash;
    G_ACA_PROPS.tenantId = this.state.previewMode.data?.tenant?.tenantId;
    G_ACA_PROPS.engagementId = this.state.previewMode.data?.engagement?.id;
    this.gAcaPropsService.mergeGAcaProps(G_ACA_PROPS);
    const SESSION = {
      gAcaProps: G_ACA_PROPS,
      engagement: this.state.previewMode.data?.engagement,
      tenant: this.state.previewMode.data?.tenant,
    }
    _debugX(AppComponent.getClassName(), 'previewMode', { G_ACA_PROPS, SESSION });
    return SESSION;
  }
}
