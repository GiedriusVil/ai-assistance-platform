import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { EventBusServiceV1 } from 'client-services';
import { CHAT_APP_BUTTON_EVENT, EVENT_TYPE, IEvent, _debugX, _errorX } from 'client-utils';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import { BotSocketIoServiceV2, ChatWidgetServiceV1, ClientServiceV2, ConfigServiceV2, GAcaPropsServiceV1, SessionServiceV2, StorageServiceV2 } from './services';
import { HostPageInfoService } from './services/host-page-info.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'chat-app-v3',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'chat-app-v3';

  static getClassName() {
    return 'AppComponent';
  }
  
  static getElementTag() {
    return 'chat-app-v3';
  }

  static getHTMLTagName() {
    return 'chat-app-v3';
  }


  state = {
    isModalOpen: false,
    isRightPanelOpen: true,

    columns: {
      rightPanel: 1,
      leftPanel: 1,
    },

    location: {
      top: 100,
      left: 100,
    },

    grid: {
      rows: {
        header: '50px',
        content: 'auto',
      },
      columns: {
        sideNav: '50px',
        leftPanel: '1fr',
        base: '2fr',
        rightPanel: '1fr',
      }
    },
    size: {
      width: '500px',
      height: '500px',
    },

    enabled: {
      leftPanel: true,
      rightPanel: true,
      sideNav: true,
    },
    isFullscreen: false,
    isDragEnabled: true,
  };

  styles: any;

  show = false;

  constructor(
    private eventBusService: EventBusServiceV1,
    private elementRef: ElementRef,
    private clientService: ClientServiceV2,
    private configService: ConfigServiceV2,
    private gAcaPropsService: GAcaPropsServiceV1,
    private sessionService: SessionServiceV2,
    private storageService: StorageServiceV2,
    private chatWidgetService: ChatWidgetServiceV1,
    private hostPageInfoService: HostPageInfoService,
    private botSocketIoService: BotSocketIoServiceV2,

    // TODO: ANBE To check if we could deal with changes in a better way
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  @Input('acaWidgetOptions') public acaWidgetOptions;

  ngOnInit(): void {
    this.elementRef.nativeElement.eventBus = this.eventBusService.getEventBus();

    // TODO: ANBE Some service that would deal with event that have nothing to do with the layout n stuff?
    this.eventBusService.subscribe?.((value: IEvent) => {
      switch (value.type) {
        case EVENT_TYPE.MOVE_CHAT_WINDOW: this.handleChatMoveEvent(value.data); break;
        case EVENT_TYPE.CLOSE_CHAT_WINDOW: this.handleChatCloseEvent(); break;
        case EVENT_TYPE.OPEN_CHAT_WINDOW: this.handleChatOpenEvent(); break;
        case EVENT_TYPE.SEND_MESSAGE: this.handleSendMessage(value.data); break;
        case EVENT_TYPE.SEND_AUDIO_MESSAGE: this.handleSendAudioMessage(value.data); break;
        case EVENT_TYPE.MESSAGE_RECEIVED: this.saveMessage(value.data); break;
        case EVENT_TYPE.AUDIO_MESSAGE_RECEIVED: this.saveAudioMessage(value.data); break;
        case EVENT_TYPE.LOAD_MESSAGES: this.loadMessages(value.data); break;
        case EVENT_TYPE.LOAD_SESSION: this.loadSession(value.data); break;
        case EVENT_TYPE.TOGGLE_RIGHT_PANEL: this.handleToggleRightPanel(); break;
        case EVENT_TYPE.TOGGLE_LEFT_PANEL: this.handleToggleLeftPanel(); break;
      }

      this.changeDetectorRef.detectChanges();
    });

    this.chatWidgetService.reloadWidgetOptions(this.acaWidgetOptions);
    this.handleChatWindowState();

    this.loadStyles();

    this.confirmIsClientReady();
  }

  handleChatWindowState() {
    const WIDGET_OPTIONS = this.chatWidgetService.getWidgetOptions();
    const LOCATION_OPTIONS = WIDGET_OPTIONS.windowPosition;
    try {
      if (
        WIDGET_OPTIONS?.opened
      ) {
        this.handleChatOpenEvent();
      }


      if (
        LOCATION_OPTIONS?.top
      ) {
        this.state.location.top = LOCATION_OPTIONS.top;
      }

      if (
        LOCATION_OPTIONS?.left
      ) {
        this.state.location.left = LOCATION_OPTIONS.left;
      }

    } catch (error) {
      _errorX(AppComponent.getClassName(), 'handleChatWindowState', {
        error: error,
      });
      throw error;
    }
  }

  // TOOD: ANBE POSIBILITY TO REPLACE WITH EXISTING EVENT BUS?
  @HostListener('window:message', ['$event'])
  chatAppOpenEventListener(event: any) {
    if (event?.data?.type === 'aiapChatAppClientOpen') {
      this.eventBusService.emit?.({
        type: EVENT_TYPE.OPEN_CHAT_WINDOW
      })
    }
  }

  handleChatOpenEvent() {
    this.requestHostPageInfo();
  }

  handleSendMessage(data: any) {
    this.clientService.postMessage(data);
  }

  handleSendAudioMessage(data: Blob) {
    this.clientService.postAudioMessage(data);
  }

  handleChatCloseEvent() {
    this.show = false;

    const EVENT = {
      type: 'aiapChatButtonShow',
      data: true
    };
    setTimeout(() => {
      // SAST_FIX ['postMessage']
      window['postMessage'](EVENT, '*')
    }, 0);

    this.chatWidgetService.handleChatWindowCloseEvent(true);

    // ANBE TESTING PURPOSES ONLY
    localStorage.removeItem('conversationToken');
  }

  handleChatMoveEvent(data: any) {
    if (!this.state.isDragEnabled) return;
    this.state.location.top += data.movementY;
    this.state.location.left += data.movementX;

    this.chatWidgetService.handleChatWindowMoveEvent(this.state.location);

    this.generateStyles();
  }


  private requestHostPageInfo() {
    const DATA_ITEM_REQS = ramda.path(['hostPageInfo', 'dataItemReqs'], this.configService.getConfig());
    const PARAMS = {
      dataItemReqs: DATA_ITEM_REQS
    };

    const HOST_PAGE_INFO = this.hostPageInfoService.getInfo(PARAMS);

    this.gAcaPropsService?.applyHostPageInfo(HOST_PAGE_INFO);
    const G_ACA_PROPS = this.gAcaPropsService.getGAcaProps();
    this.configService.setLanguage(G_ACA_PROPS?.isoLang);

    const LANGUAGE_SELECTED_IN_LANGUAGE_SELECTION_FORM = this.storageService.getUserSelectedLanguage();
    this.gAcaPropsService?.applyUserSelectedLanguage(LANGUAGE_SELECTED_IN_LANGUAGE_SELECTION_FORM?.code);

    this.authorizeSession();
  }

  private async authorizeSession() {
    const SESSION = await firstValueFrom(this.sessionService.authorize());

    this.gAcaPropsService.mergeGAcaProps(SESSION?.gAcaProps);
    const TOKEN = SESSION?.token?.value;


    this.storageService.setConversationToken(TOKEN);
    this.storageService.setChatCookie({ conversationToken: TOKEN });

    this.clientService.connect();


    // ANBE SEPERATE FUNCTION
    const GRID_CONFIGS = SESSION.engagement.chatApp.grid;

    this.state.size = {
      width: GRID_CONFIGS.width,
      height: GRID_CONFIGS.height,
    }
    this.state.grid = {
      rows: {
        header: GRID_CONFIGS.rows.header,
        content: GRID_CONFIGS.rows.content,
      },
      columns: {
        sideNav: GRID_CONFIGS.columns.sideNav,
        leftPanel: GRID_CONFIGS.columns.leftPanel,
        base: GRID_CONFIGS.columns.base,
        rightPanel: GRID_CONFIGS.columns.rightPanel,
      }
    };

    const LAYOUT_CONFIGS = SESSION.engagement.chatApp.layout;
    this.state.enabled = {
      leftPanel: LAYOUT_CONFIGS.leftPanel.enabled,
      rightPanel: LAYOUT_CONFIGS.rightPanel.enabled,
      sideNav: LAYOUT_CONFIGS.sideNav.enabled,
    }

    this.state.isFullscreen = SESSION.engagement.chatApp.isFullscreen ?? false;
    this.state.isDragEnabled = SESSION.engagement.chatApp.isDragEnabled ?? true;
    
    this.generateStyles();
    this.show = true;
    this.chatWidgetService.handleChatWindowOpenEvent(true);
  }

  // TODO: ANBE To service
  loadStyles() {
    // ANBE REMOVE HARDCODED
    const URL = 'http://localhost:3000/wbc-chat-app-v3/en-US/styles.css';
    
    const elCSSLink = document.createElement('link');
    elCSSLink.id = 'aiap-chat-app-styles';
    elCSSLink.rel = 'stylesheet';
    elCSSLink.href = URL;
    // elCSSLink.addEventListener('load', ON_LOAD_CSS_SUCCESS);
    // elCSSLink.addEventListener('error', ON_LOAD_CSS_ERROR);
    document.querySelector('body')?.before(elCSSLink);
  }


  handleToggleRightPanel() {
    this.state.columns.rightPanel = (this.state.columns.rightPanel + 1) % 2;
    this.generateStyles();
  }

  handleToggleLeftPanel() {
    this.state.columns.leftPanel = (this.state.columns.leftPanel + 1) % 2;
    this.generateStyles();
  }

  generateStyles() {
    const STYLES = {
      'top.px': this.state.isFullscreen ? 0 : this.state.location.top,
      'left.px': this.state.isFullscreen ? 0 : this.state.location.left,
  
      'grid-template-columns': `${this.state.enabled.sideNav ? this.state.grid.columns.sideNav : '0'} ${this.state.columns.leftPanel && this.state.enabled.leftPanel ? this.state.grid.columns.leftPanel : '0'} ${this.state.grid.columns.base} ${this.state.columns.rightPanel && this.state.enabled.rightPanel ? this.state.grid.columns.rightPanel : '0'}`,
      'grid-template-rows': `${this.state.grid.rows.header} ${this.state.grid.rows.content}`,

      width: this.state.isFullscreen ? '100vw' : this.state.size.width,
      height: this.state.isFullscreen ? '100vh' : this.state.size.height,
    };

    this.styles = STYLES;

    this.changeDetectorRef.detectChanges();
  }



  // TODO: ANBE EXTRACT TO SERVICES 
  messages: any = [];
  
  saveMessage(message: any) {
    this.messages.push(message);
  }

  saveAudioMessage(audioMessage: any) {
    this.messages.push(audioMessage);
  }

  loadMessages(callback:any) {
    callback(this.messages);
  }

  loadSession(callback:any) {
    callback(this.sessionService.getSession());
  }


  isReady() {
    // ANBE Add normal isReady check
    return true;
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
}
