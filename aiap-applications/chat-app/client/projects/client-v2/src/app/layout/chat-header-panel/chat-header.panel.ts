/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

import * as ramda from 'ramda';

import {
  ModalService,
} from '../../services';

import {
  ChatWidgetServiceV1,
  EventsServiceV1,
  GAcaPropsServiceV1,
  ClientServiceV2,
  LeftPanelServiceV1,
  ConfigServiceV2,
  DataServiceV2,
  SessionServiceV2,
  StorageServiceV2,
} from "client-services";

import {
  _debugX,
  CHAT_WINDOW_STATE
} from "client-utils";

@Component({
  selector: 'aca-chat-header-panel',
  templateUrl: './chat-header.panel.html',
  styleUrls: ['./chat-header.panel.scss'],
})
export class ChatHeaderPanel implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'ChatHeaderPanel';
  }

  private _destroyed$: Subject<void> = new Subject();

  @ViewChild('headerBar') headerBar;
  @ViewChild('headerBarButtonsLeft') headerBarButtonsLeft;
  @ViewChild('headerBarTitle') headerBarTitle;
  @ViewChild('headerBarButtonsRight') headerBarButtonsRight;
  @ViewChild('headerBarCollapseButton') headerBarCollapseButton;

  CHAT_WINDOW_STATE_TEXT = CHAT_WINDOW_STATE;

  audioEnabled = false;
  expandWidget = false;

  isExpanded = false;
  widgetReset = false;
  parentWidth: number;

  config = {};
  surveyEnabled = false;
  minimized = false;
  initialMinimized = false;

  state: any = {
    header: {
      title: '[Header] ACA Virtual Agent'
    }
  }

  chatAssestsUrl: string = undefined;

  subscriptions: any = {
    events: undefined,
    session: undefined,
  }

  icons = [];

  constructor(
    private configService: ConfigServiceV2,
    private eventsService: EventsServiceV1,
    private sessionService: SessionServiceV2,
    private dataService: DataServiceV2,
    private storageService: StorageServiceV2,
    private clientService: ClientServiceV2,
    private gAcaPropsService: GAcaPropsServiceV1,
    private chatWidgetService: ChatWidgetServiceV1,
    private modalService: ModalService,
    public leftPanelService: LeftPanelServiceV1,
  ) { }

  closeLeftPanel() {
    if (this.isMinimized()) {
      this.handleMinimizeMaximizeState();
    }
    this.chatWidgetService.broadcast(ChatWidgetServiceV1.EVENT.LEFT_PANEL_CLOSE, true);
  }

  ngOnInit() {
    const SESSION = this.sessionService.getSession();
    this.setHeaderTitle(SESSION?.engagement);
    this.initData();
    this.subscribeToEvents();
    this.setPrevData();
    this.getAssetsUrl();
    this.getIcons();
  }

  ngAfterViewInit() {
    this.handleVariables();
  }

  ngOnDestroy() {
    if (
      this.state?.subscriptions?.session
    ) {
      this.state?.subscriptions?.session.unsubscribe();
    }
    if (
      this.state?.subscriptions?.events
    ) {
      this.state?.subscriptions?.events.unsubscribe();
    }
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  getAssetsUrl() {
    this.chatAssestsUrl = this.chatWidgetService.getChatAppHostUrl() + "/en-US/assets";
  }

  getIcons() {
    this.icons['closeLeftPanelIcon'] = this.getIcon('exit-right.svg', 'closeLeftPanelIcon');
    this.icons['vaLogo'] = this.getIcon('va-logo-white.svg', 'vaLogo');
    this.icons['surveyPenIcon'] = this.getIcon('pen.svg', 'surveyPenIcon');
    this.icons['transcriptTransform'] = this.getIcon('journal-plus.svg', 'transcriptTransform');
    this.icons['volumeUp'] = this.getIcon('volume-up-filled.svg', 'volumeUp');
    this.icons['volumeMute'] = this.getIcon('volume-mute-filled.svg', 'volumeMute');
    this.icons['download'] = this.getIcon('download.svg', 'download');
    this.icons['minimize'] = this.getIcon('subtract.svg', 'minimize');
    this.icons['maximize'] = this.getIcon('maximize.svg', 'maximize');
    this.icons['close'] = this.getIcon('close.svg', 'close');
  }

  private subscribeToEvents() {
    this.subscriptions.session = this.eventsService.sessionEmitter
      .subscribe((session) => {
        const ENGAGEMENT = session?.engagement;
        this.setHeaderTitle(ENGAGEMENT);
        this.getIcons();
      });
  }

  private handleVariables(): void {
    this.handleAudio();
    this.expandWidget = ramda.pathOr(false, ['expandWidget'], this.config);
  }

  private handleAudio(): void {
    const RAW_WIDGET_AUDIO = localStorage.getItem('widgetAudio');
    if (RAW_WIDGET_AUDIO) {
      this.audioEnabled = JSON.parse(RAW_WIDGET_AUDIO);
    } else {
      this.audioEnabled = ramda.pathOr(false, ['audioEnabled'], this.config);
    }
  }

  private setHeaderTitle(engagement: any) {
    _debugX(ChatHeaderPanel.getClassName(), 'setHeaderTitle', { engagement });
    this.state.header.title = engagement?.assistantDisplayName;
  }

  isFeatureEnabled(name: string): boolean {
    const RET_VAL = ramda.pathOr(false, ['engagement', 'chatApp', 'header', name], this.sessionService.getSession());
    return RET_VAL;
  }

  onClose(event: Event) {
    _debugX(ChatHeaderPanel.getClassName(), 'onClose', { event });
    event.preventDefault();
    const MINIMIZED = this.isMinimized();
    if (MINIMIZED) {
      this.chatWidgetService.setChatWindowMinimized(false);
      this.clientService.disconnectFromWidget();
    } else {
      this.eventsService.eventEmit({ onWidgetClose: true });
    }
  }

  isMinimized(): boolean {
    return this.chatWidgetService.getWidgetOptions().minimized;
  }

  handleMinimizeMaximizeState() {
    const MINIMIZED = this.isMinimized();
    this.chatWidgetService.broadcast(ChatWidgetServiceV1.EVENT.CHAT_WINDOW_MINIMIZE, !MINIMIZED)
  }

  onMinimizeMaximize(event: Event) {
    event.preventDefault();
    this.handleMinimizeMaximizeState();
  }

  onAudio(event: Event): void {
    event.preventDefault();
    this.audioEnabled = !this.audioEnabled;
    localStorage.setItem('widgetAudio', JSON.stringify(this.audioEnabled));
  }

  getIcon(fileName, propertyName) {
    const CHAT_ASSETS_URL = this.chatWidgetService.getChatAppHostUrl() + "/en-US/assets";
    const FILE_NAME = ramda.pathOr(fileName,
      ['engagement', 'chatApp', 'assets', 'icons', 'chatWindow', 'headerPanel', propertyName, 'fileName'],
      this.sessionService.getSession());
    return `${CHAT_ASSETS_URL}/${FILE_NAME}`;
  }

  showSurvey() {
    if (this.isMinimized()) {
      this.handleMinimizeMaximizeState();
    }
    this.eventsService.eventEmit({ onSurveyShow: true });
  }

  showTranscriptTransform() {
    if (this.isMinimized()) {
      this.handleMinimizeMaximizeState();
    }
    this.eventsService.eventEmit({ onTestCasesShow: true });
  }

  private initData() {
    this.config = this.configService.get();
  }

  private setPrevData() {
    this.surveyEnabled = this.storageService.isSurveySubmitted() && this.config['surveyEnabled'];
  }
}
