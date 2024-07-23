/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, ViewChild, ElementRef, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  ModalService,
} from '../../services';

import {
  ChatWidgetServiceV1,
  ClientServiceV2,
  ConfigServiceV2,
  EventBusServiceV1,
  EventsServiceV1,
  LeftPanelServiceV1,
  SessionServiceV2,
} from 'client-services';

import {
  EVENT_TYPE,
  IEvent,
  _debugX,
} from 'client-utils';

const enum Status {
  OFF = 0,
  RESIZE = 1,
  MOVE = 2
}

@Component({
  selector: 'aca-chat-window-panel',
  templateUrl: './chat-window.panel.html',
  styleUrls: ['./chat-window.panel.scss']
})
export class ChatWindowPanel implements OnInit, AfterViewInit {

  static getClassName() {
    return 'ChatWindow';
  }

  static getHTMLTagName() {
    const RET_VAL = 'aca-chat-window-panel';
    return RET_VAL;
  }

  static getInnerElementId() {
    const RET_VAL = 'chat--window--inner';
    return RET_VAL;
  }
  innerElementId = ChatWindowPanel.getInnerElementId();

  session: any;
  layouts: any[] = [];
  config: any;

  @ViewChild('box') public box: ElementRef<HTMLDivElement>;
  @ViewChild('chatBody') public chatBody: ElementRef;

  @Input('width') public width: number;
  @Input('height') public height: number;
  @Input('left') public left: number;
  @Input('top') public top: number;
  @Input('zoom') public zoom = 100;

  public mouse: { x: number, y: number };
  public status: Status = Status.OFF;

  private boxPosition: { left: number, top: number };
  private mouseClick: { x: number, y: number, left: number, top: number };

  chatWidgetSubscription;

  _state = {
    showChatBox: true,
    isLeftPanelEnabled: false,
    isSessionReady: false,
    resizeEnabled: true,
    dragEnabled: true,
    isFullscreen: false,
    isGridEnabled: true,
    tabTitle: undefined,
    favIcon: undefined,
  };

  state = lodash.cloneDeep(this._state);

  constructor(
    private sessionService: SessionServiceV2,
    private chatWidgetService: ChatWidgetServiceV1,
    private modalService: ModalService,
    private eventsService: EventsServiceV1,
    public leftPanelService: LeftPanelServiceV1,
    private configService: ConfigServiceV2,
    private eventBusService: EventBusServiceV1,
    public clientService: ClientServiceV2,
    private elementRef: ElementRef,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.initConfig();
    this.setupChatWidgetSubscribtion();
    this.setStateValuesOnSessionEvent();
    this.subscribeToEvents()
    this.setStyles();
    this.session = this.sessionService.getSession();
    this.addHeaderEvents();
  }

  setupChatWidgetSubscribtion() {
    this.chatWidgetSubscription = this.chatWidgetService.subscribe((event: any) => {
      _debugX(ChatWindowPanel.getClassName(), 'event', { event });
      if (event.type === ChatWidgetServiceV1.EVENT.CHAT_WINDOW_MINIMIZE) {
        this.state.showChatBox = !event?.data;
        this.setChatBodyGrid();
      }

      if (event.type === ChatWidgetServiceV1.EVENT.LEFT_PANEL_OPEN || event.type === ChatWidgetServiceV1.EVENT.LEFT_PANEL_CLOSE) {
        this.setChatBodyGrid();
      }
    });
  }

  ngAfterViewInit() {
    this.loadBox();
    this.setStyles();
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  private loadBox() {
    const { left, top } = this.box.nativeElement.getBoundingClientRect();
    this.boxPosition = { left, top };
  }

  handleChatWindowInitialized(data) {

  }

  setStatus(event: MouseEvent, status: number) {
    this.status = status;
    if (status === 1) {
      event.stopPropagation();
    } else if (status === 2) {
      this.mouseClick = { x: event.clientX, y: event.clientY, left: this.left, top: this.top };
    } else {
      const MINIMIZED = this.isMinimized();
      if (MINIMIZED) {
        this.chatWidgetService.broadcast(ChatWidgetServiceV1.EVENT.CHAT_WINDOW_MINIMIZE, !MINIMIZED)
      }
      this.loadBox();
    }
  }

  isViewActive(name) {
    let retVal = false;
    const CHAT_VIEWS = this.chatWidgetService.getWidgetOptions().views;
    for (let i = 0; i < CHAT_VIEWS.length; i++) {
      if (name === CHAT_VIEWS[i].name && CHAT_VIEWS[i].isActive) {
        retVal = true;
      }
    }
    return retVal;
  }

  isMinimized() {
    return this.chatWidgetService.getWidgetOptions().minimized;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouse = { x: event.clientX, y: event.clientY };

    if (this.state.resizeEnabled && this.status === Status.RESIZE) this.resize();
    else if (this.state.dragEnabled && this.status === Status.MOVE && !this.isMinimized()) this.move();
  }

  private resize() {
    this.width = Number(this.mouse.x > this.boxPosition.left) ? this.mouse.x - this.boxPosition.left : 0;
    this.height = Number(this.mouse.y > this.boxPosition.top) ? this.mouse.y - this.boxPosition.top : 0;
    this.chatWidgetService.setChatWindowSize(this.height, this.width);
  }

  private move() {
    this.left = this.mouseClick.left + (this.mouse.x - this.mouseClick.x);
    this.top = this.mouseClick.top + (this.mouse.y - this.mouseClick.y);
    this.chatWidgetService.setChatWindowPosition(this.top, this.left);
  }

  chatHeaderActionsEnabled(): boolean {
    const BUY_HEADER = this.sessionService.getSession()?.engagement?.chatApp?.headerActions;
    const CHAT = BUY_HEADER?.chat;
    const BASKET = BUY_HEADER?.basket;
    const SURVEY = BUY_HEADER?.survey;
    const PROFILE = BUY_HEADER?.profile;
    const IS_ENABLED = CHAT || BASKET || SURVEY || PROFILE;
    if (IS_ENABLED === true && !this.isMinimized()) {
      return true;
    } else {
      return false;
    }
  }

  getBoxMinWidth() {
    if (lodash.isEmpty(this.box)) {
      return 0;
    }
    const WIDTH = getComputedStyle(this.box.nativeElement).minWidth.replace('px', '');
    const RET_VAL = parseInt(WIDTH);
    return RET_VAL;
  }

  isLoadingViewVisible() {
    let retVal = this.isViewActive('aca-loading-view') || !this.state.isSessionReady;
    retVal &&= !this.isViewActive('aca-authorization-error-view');
    return retVal;
  }

  getMainViewHeight() {
    const SESSION_ENGAGEMENT_CHAT_APP = this.sessionService.getSession()?.engagement?.chatApp;
    const HEADER_ACTIONS_HEIGHT = ramda.pathOr(0, ['headerActionsHeight'], SESSION_ENGAGEMENT_CHAT_APP);
    const HEADER_HEIGHT = ramda.pathOr(0, ['headerHeight'], SESSION_ENGAGEMENT_CHAT_APP);
    const FOOTER_HEIGHT = ramda.pathOr(0, ['footerHeight'], SESSION_ENGAGEMENT_CHAT_APP);
    const HEIGHT = this.height - HEADER_HEIGHT - FOOTER_HEIGHT - HEADER_ACTIONS_HEIGHT;
    return this.state.isFullscreen ? `100%` : `${HEIGHT}px`;
  }

  getMainViewWidth() {
    return this.state.isFullscreen ? '100%' : `${this.width}px`;
  }

  getWindowPanelWidth() {
    const WIDTH = this.state.isLeftPanelEnabled && this.chatWidgetService.getWidgetOptions().leftPanelOpened ? this.width + this.leftPanelService.leftPanelWidth() : this.width;
    return this.state.isFullscreen ? '100%' : WIDTH + 'px'
  }

  getChatWindowStyles() {
    const LEFT = this.state.isLeftPanelEnabled && this.chatWidgetService.getWidgetOptions().leftPanelOpened ? this.left - this.leftPanelService.leftPanelWidth() : this.left;
    return {
      width: this.getWindowPanelWidth(),
      transform: this.state.isFullscreen ? 'translate3d(0px, 0px, 0px)' : 'translate3d(' + LEFT + 'px,' + this.top + 'px,' + '0px)',
      height: this.state.isFullscreen ? '100%' : `${this.height}px`,
      zoom: `${this.zoom}%`
    }
  }

  private addHeaderEvents() {
    this.eventBusService.subscribe((event: IEvent) => {
      if (event.type === EVENT_TYPE.WBC_HEADER_INITIALIZED && this.state.dragEnabled) {
        const ELEMENT = this.elementRef.nativeElement.querySelector('.aiap-header');
        ELEMENT.addEventListener('mousedown', (event: MouseEvent) => {
          ELEMENT.classList.add('cursor-grab');
          this.setStatus(event, 2);
        });
        ELEMENT.addEventListener('mouseup', (event: MouseEvent) => {
          ELEMENT.classList.remove('cursor-grab');
          this.setStatus(event, 0);
        });
      }
    });
  }

  private subscribeToEvents() {
    this.eventsService.sessionEmitter.subscribe((session: any) => {
      this.setStateValuesOnSessionEvent();
      this.setStyles();
      this.setPageTabStyles();
      this.session = this.sessionService.getSession();
    });
  }

  private setStateValuesOnSessionEvent() {
    this.state.isSessionReady = !lodash.isEmpty(this.sessionService.getSession());
    this.state.isLeftPanelEnabled = this.leftPanelService.leftPanelEnabled();
    this.state.resizeEnabled = this.sessionService.getSession()?.engagement?.chatApp?.resizeEnabled ?? true;
    this.state.dragEnabled = this.sessionService.getSession()?.engagement?.chatApp?.dragEnabled ?? true;
    this.state.isFullscreen = this.sessionService.getSession()?.engagement?.chatApp?.isFullscreen ?? false;
    this.state.isGridEnabled = this.sessionService.getSession()?.engagement?.chatApp?.grid?.enabled ?? true;
    this.state.tabTitle = this.sessionService.getSession()?.engagement?.chatApp?.tabTitle ?? undefined;
    this.state.favIcon = this.sessionService.getSession()?.engagement?.chatApp?.favIcon ?? undefined;
    this.layouts = this.sessionService.getSession()?.engagement?.chatApp?.grid?.layouts;
  }

  private setStyles() {
    const GRID_CONFIG = this.sessionService.getSession()?.engagement?.chatApp?.grid;
    if (GRID_CONFIG && !lodash.isEmpty(this.box)) {
      const GRID_TEMPLATE_COLUMNS = GRID_CONFIG?.columns ? Object.values(GRID_CONFIG.columns).join(' ') : 'auto';
      const GRID_TEMPLATE_ROWS = GRID_CONFIG?.rows ? Object.values(GRID_CONFIG.rows).join(' ') : 'auto';
      this.box.nativeElement.style.display = 'grid';
      this.box.nativeElement.style.gridTemplateColumns = GRID_TEMPLATE_COLUMNS;
      this.box.nativeElement.style.gridTemplateRows = GRID_TEMPLATE_ROWS;
      this.chatBody.nativeElement.style.gridRow = GRID_CONFIG?.contentGrid?.row;
      this.chatBody.nativeElement.style.gridColumn = GRID_CONFIG?.contentGrid?.column;
      this.setChatBodyGrid();
    }
  }

  private setPageTabStyles() {
    if (this.state.tabTitle && this.state.isFullscreen) {
      this.titleService.setTitle(this.state.tabTitle);
    }
    if (this.state.favIcon && this.state.isFullscreen) {
      const FAVICON = document.getElementById('aiap-favicon');
      FAVICON.setAttribute('href', this.state.favIcon);
    }
  }

  private setChatBodyGrid() {
    let HEADER_ACTIONS_HEIGHT = 0;
    const SESSION_ENGAGEMENT_CHAT_APP = ramda.path(['engagement', 'chatApp'], this.sessionService.getSession());
    let GRID_TEMPLATE_AREAS = `"main"`;
    if (this.state.isLeftPanelEnabled && !this.chatHeaderActionsEnabled()) {
      GRID_TEMPLATE_AREAS = `"sidebar button main"`
    }
    if (!this.state.isLeftPanelEnabled && this.chatHeaderActionsEnabled()) {
      GRID_TEMPLATE_AREAS = `"header" "main"`
    }
    if (this.state.isLeftPanelEnabled && this.chatHeaderActionsEnabled()) {
      GRID_TEMPLATE_AREAS = this.chatWidgetService.getWidgetOptions().leftPanelOpened ? `"sidebar button header" "sidebar button main"` : `"button header" "button main"`;
    }
    if (this.chatHeaderActionsEnabled()) {
      HEADER_ACTIONS_HEIGHT = ramda.pathOr(50, ['headerActionsHeight'], SESSION_ENGAGEMENT_CHAT_APP);
      this.chatBody.nativeElement.style.gridTemplateRows = `${HEADER_ACTIONS_HEIGHT}px auto`;
    }
    this.chatBody.nativeElement.style.gridTemplateColumns = this.state.isLeftPanelEnabled && this.chatWidgetService.getWidgetOptions().leftPanelOpened ? this.leftPanelService.leftPanelWidth() + 'px' + ' 0 auto' : 'auto';
    this.chatBody.nativeElement.style.gridTemplateAreas = GRID_TEMPLATE_AREAS;
  }

  private initConfig(): void {
    this.config = this.configService.getConfig();
  }
}
