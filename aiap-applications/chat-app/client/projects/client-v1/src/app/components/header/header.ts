/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

import * as ramda from 'ramda';

import {
  EventsServiceV1,
  GAcaPropsServiceV1,
  ParamsServiceV1,
  ClientServiceV1,
  ConfigServiceV1,
  DataServiceV1,
  SessionServiceV1,
  StorageServiceV1,
} from "client-services";

import {
  WidgetParams, CHAT_WINDOW_STATE, _debugX
} from "client-utils";

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'HeaderComponent';
  }

  private _destroyed$: Subject<void> = new Subject();

  @ViewChild('headerBar') headerBar;
  @ViewChild('headerBarButtonsLeft') headerBarButtonsLeft;
  @ViewChild('headerBarTitle') headerBarTitle;
  @ViewChild('headerBarButtonsRight') headerBarButtonsRight;
  @ViewChild('headerBarCollapseButton') headerBarCollapseButton;
  @ViewChild('minimizeButton') minimizeButton;

  CHAT_WINDOW_STATE_TEXT = CHAT_WINDOW_STATE.MINIMIZE;

  audioEnabled = false;
  expandWidget = false;
  params: WidgetParams;

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

  subscriptions: any = {
    events: undefined,
    session: undefined,
  }

  constructor(
    private configService: ConfigServiceV1,
    private eventsService: EventsServiceV1,
    private sessionService: SessionServiceV1,
    private dataService: DataServiceV1,
    private paramsService: ParamsServiceV1,
    private storageService: StorageServiceV1,
    private clientService: ClientServiceV1,
    private gAcaPropsService: GAcaPropsServiceV1
  ) { }


  ngOnInit() {
    const SESSION = this.sessionService.getSession();
    this.setHeaderTitle(SESSION?.engagement);
    this.initData();
    this.subscribeToEvents();
    this.setPrevData();
  }

  ngAfterViewInit() {
    this.handleWindowResize();
    this.handleVariables();
    this.toggleMinimizedStyle();
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

  setInitialMinizeParams() {
    this.minimized = ramda.pathOr(false, ['minimized'], this.params);
    this.initialMinimized = ramda.pathOr(false, ['minimized'], this.params);
  }

  private subscribeToEvents() {
    this.subscriptions.events = this.eventsService.eventsEmitter
      .subscribe(event => {
        if (event.hasOwnProperty('onWidgetResize')) this.handleWindowResize();
        if (event.hasOwnProperty('onSurveyShow')) {
          this.surveyEnabled = event['onSurveyShow'];
          if (event['onSurveyShow'] === false) this.handleWindowResize();
        }
      });
    this.subscriptions.session = this.eventsService.sessionEmitter
      .subscribe((session) => {
        const ENGAGEMENT = session?.engagement;
        this.setHeaderTitle(ENGAGEMENT);
      });

    window.addEventListener('message', event => {
      if (event.data['widgetWidth']) {
        this.parentWidth = event.data['widgetWidth'];
      }
      if (event.data['widgetReset']) {
        this.widgetReset = event.data['widgetReset'];
      }
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

  handleExpand() {
    if (this.headerBarCollapseButton && this.expandWidget && this.isWidget()) {
      if (this.widgetReset) {
        this.isExpanded = false;
        this.widgetReset = false;
        this.headerBarCollapseButton.nativeElement.style.display = 'none';
      }
      if (this.isExpanded) {
        if (this.parentWidth > 576) {
          this.headerBarCollapseButton.nativeElement.style.display = 'block';
        } else {
          this.headerBarCollapseButton.nativeElement.style.display = 'none';
        }
      } else {
        if (this.parentWidth > 576) {
          this.headerBarCollapseButton.nativeElement.style.display = 'none';
        }
      }
    }
  }

  handleWindowResize() {
    if (this.headerBar) {
      const headerBarWidth = this.headerBar.nativeElement.clientWidth;
      const headerBarButtonsLeftWidth = this.headerBarButtonsLeft ? this.headerBarButtonsLeft.nativeElement.clientWidth - 15 : 0;
      let headerBarButtonsRightWidth = this.headerBarButtonsRight ? this.headerBarButtonsRight.nativeElement.clientWidth - 15 : 0;
      const headerBarTitleWidth = headerBarWidth - headerBarButtonsLeftWidth - headerBarButtonsRightWidth - 30;
      setTimeout(() => {
        this.headerBarTitle.nativeElement.style.width = `${headerBarTitleWidth}px`;
        this.handleExpand();
      }, 250);
    } else {
      setTimeout(() => {
        this.handleWindowResize();
      }, 250);
    }
  }

  isWidget() {
    const widget = ramda.pathOr(false, ['widget'], this.params);
    return !!widget;
  }

  private setHeaderTitle(engagement: any) {
    _debugX(HeaderComponent.getClassName(), 'setHeaderTitle', { engagement });
    this.state.header.title = engagement?.assistantDisplayName;
  }

  isFeatureEnabled(name: string): boolean {
    const RET_VAL = ramda.pathOr(false, ['engagement', 'chatApp', 'header', name], this.sessionService.getSession());
    return RET_VAL;
  }

  onClose(event: Event) {
    event.preventDefault();
    if (this.minimized) {
      this.clientService.disconnectFromWidget();
    } else {
      this.eventsService.eventEmit({ onWidgetClose: true });
    }
  }

  showTranscriptTransform() {
    this.eventsService.eventEmit({ onTranscriptTransform: true });
  }

  toggleMinimizedStyle() {
    let transform = 'rotate(0deg)';
    let CHAT_WINDOW_STATE_TEXT = CHAT_WINDOW_STATE.MINIMIZE;
    if (this.minimized) {
      transform = 'rotate(180deg)';
      CHAT_WINDOW_STATE_TEXT = CHAT_WINDOW_STATE.RESTORE;
    }
    this.CHAT_WINDOW_STATE_TEXT = CHAT_WINDOW_STATE_TEXT;
    this.minimizeButton.nativeElement.style.transform = transform;
  }

  handleInitialMinimizeState() {
    this.eventsService.eventEmit({ onInitialMaximize: true });
    this.initialMinimized = false;
  }

  handleMinimizeState() {
    this.minimized = !this.minimized;
    this.toggleMinimizedStyle();
    setTimeout(() => {
      // SAST_FIX ['postMessage']
      window.parent['postMessage']({ type: 'onWidgetMinimize' }, '*')
    }, 0);
  }

  onMinimize(event: Event) {
    event.preventDefault();
    if (this.initialMinimized) this.handleInitialMinimizeState();
    this.handleMinimizeState();
  }

  onExpand(event: Event) {
    event.preventDefault();
    this.isExpanded = true;
    this.headerBarCollapseButton.nativeElement.style.display = 'block';

    setTimeout(() => {
      // SAST_FIX ['postMessage']
      window.parent['postMessage']({ type: 'onWidgetExpand' }, '*');
    }, 0);
  }

  onCollapse(event: Event) {
    event.preventDefault();
    this.isExpanded = false;
    this.headerBarCollapseButton.nativeElement.style.display = 'none';

    setTimeout(() => {
      // SAST_FIX ['postMessage']
      window.parent['postMessage']({ type: 'onWidgetCollapse' }, '*');
    }, 0);
  }

  onAudio(event: Event): void {
    event.preventDefault();
    this.audioEnabled = !this.audioEnabled;
    localStorage.setItem('widgetAudio', JSON.stringify(this.audioEnabled));
  }

  showSurvey() {
    if (this.initialMinimized) this.handleInitialMinimizeState();
    if (this.minimized) this.handleMinimizeState();
    this.eventsService.eventEmit({ onSurveyShow: true });
  }

  private initData() {
    this.config = this.configService.get();
    this.params = this.paramsService.get();
    this.parentWidth = +this.params.width;

    this.setInitialMinizeParams();
  }

  private setPrevData() {
    this.surveyEnabled = this.storageService.isSurveySubmitted() && this.config['surveyEnabled'];
  }
}
