/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  ChatWidgetServiceV1,
  HTMLDependenciesServiceV1,
  SessionServiceV1,
  EventBusServiceV1,
  LocalStorageServiceV1,
} from 'client-services';

import {
  EVENT_TYPE,
  _debugX,
  QuickLinks,
  QuickLink,
} from 'client-utils';

import { QuickLinksModal } from './components/quick-links-modal/quick-links.modal';
import { HeaderZoom } from './components/header-zoom/header-zoom';

@Component({
  selector: 'aiap-header-v1',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  static getElementTag() {
    return 'aiap-header-v1';
  }

  title = 'aiap-header-v1';
  audioEnabled = false;
  eventTypes = EVENT_TYPE;
  styles: any;
  icons = [];
  displayLanguage = null;
  translateLanguage = null;

  _state = {
    title: '[Header] AIAP Virtual Agent',
    underTitleTextEnabled: false,
    isFullscreen: false,
    quickLinks: {
      title: 'Quick links'
    },
    grid: {
      rows: '50px',
      columns: '45px 1fr 40px 30px'
    },
    previewMode: false,
    languageChange: {
      defaultLanguage: null,
      languages: [],
    },
    rightIcon: {
      enabled: false,
      url: undefined,
    }
  }

  state = lodash.cloneDeep(this._state);
  ready = false;

  @ViewChild(QuickLinksModal) quickLinksModal: QuickLinksModal;
  @ViewChild(HeaderZoom) headerZoom: HeaderZoom;

  @Input() set session(session) {
    this.sessionService.setSession(session);
    this.sessionInit();
    this.setGridStyle();
    this.changeDetectorRef.detectChanges();
  }

  constructor(
    private chatWidgetService: ChatWidgetServiceV1,
    private htmlDependenciesService: HTMLDependenciesServiceV1,
    private sessionService: SessionServiceV1,
    private eventBus: EventBusServiceV1,
    private changeDetectorRef: ChangeDetectorRef,
    private localStorageService: LocalStorageServiceV1,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.loadHTMLDependencies();
    this.ready = true;
  }

  ngAfterViewInit() {
    this.handleAudio();
    this.eventBus.emit?.({
      type: EVENT_TYPE.WBC_HEADER_INITIALIZED,
    })
  }

  isReady() {
    const RET_VAL = this.htmlDependenciesService.idLoadedCSSDependency(this.elCSSLinkId());
    return RET_VAL;
  }

  onEventEmit(event: Event, eventType: EVENT_TYPE) {
    event?.preventDefault();
    _debugX(AppComponent.getElementTag(), 'onEventEmit', { event });
    this.eventBus.emit?.({
      type: eventType,
    });
  }

  isMinimized(): boolean {
    return this.chatWidgetService.getWidgetOptions().minimized;
  }

  onAudio(event: Event): void {
    event.preventDefault();
    this.audioEnabled = !this.audioEnabled;
    localStorage.setItem('widgetAudio', JSON.stringify(this.audioEnabled));
  }

  onQuickLinkClick(quickLinks: QuickLink) {
    if (Object.prototype.hasOwnProperty.call(quickLinks, 'event')) {
      this.eventBus.emit?.(quickLinks.event);
    } else {
      window.open(quickLinks?.url, '_blank');
    }
  }

  openQuickLinksModal() {
    this.quickLinksModal.openModal();
  }

  isFeatureEnabled(name: string): boolean {
    const RET_VAL = ramda.pathOr(false, ['engagement', 'chatApp', 'header', name], this.sessionService.getSession());
    return RET_VAL;
  }

  handleLanguageChange(iso2: string = undefined) {
    const LANGUAGES = this.state.languageChange?.languages;
    this.translateLanguage = iso2 || this.displayLanguage;
    this.displayLanguage = iso2 || LANGUAGES?.find(language => language.iso2 !== this.displayLanguage)?.iso2;
    this.translateService.use(this.translateLanguage);
    this.setQuickLinksData(this.sessionService.getSession()?.engagement?.chatApp?.header?.quickLinks);
    this.setHeaderTitle(this.sessionService.getSession()?.engagement);
    const LANGUAGE_CHANGE_DATA = {
      iso2: this.translateLanguage,
      name: LANGUAGES?.find(language => language.iso2 === this.translateLanguage)?.name,
    }
    this.eventBus.emit?.({
      type: this.eventTypes.LANGUAGE_CHANGE,
      data: LANGUAGE_CHANGE_DATA
    });
  }

  isMultiLanguageChange(): boolean {
    const LANGUAGES = this.state.languageChange?.languages;
    return LANGUAGES && Array.isArray(LANGUAGES) && LANGUAGES.length > 2;
  }

  getIcon(fileName?, propertyName?) {
    const SESSION = this.sessionService.getSession();
    const CHAT_ASSETS_URL = `${this.chatWidgetService.getChatAppHostUrl()}/client-wbc/aiap-header-v1/assets`;
    const FILE_URL = SESSION?.engagement?.chatApp?.assets?.icons?.chatWindow?.headerPanel?.[propertyName]?.url;
    const FILE_NAME = ramda.pathOr(fileName, ['engagement', 'chatApp', 'assets', 'icons', 'chatWindow', 'headerPanel', propertyName, 'fileName'], SESSION);
    return FILE_URL ? FILE_URL : `${CHAT_ASSETS_URL}/${FILE_NAME}`;
  }

  private setGridStyle() {
    this.styles = {
      'grid-template-rows': `${this.state.grid.rows}`,
      'grid-template-columns': `${this.state.grid.columns}`
    }
  }

  private elCSSLinkId() {
    return AppComponent.getElementTag();
  }

  private async loadHTMLDependencies() {
    const CLIENT_WBC_URL = this.chatWidgetService.getClientWbcUrl();
    this.htmlDependenciesService.loadCSSDependency(this.elCSSLinkId(), `${CLIENT_WBC_URL}/${this.elCSSLinkId()}/styles.css`);
  }

  private setHeaderTitle(engagement: any) {
    this.state.title = engagement?.assistantDisplayName;
    this.state.underTitleTextEnabled = engagement?.chatApp?.header?.underTitleText?.find(title => title?.language === this.translateLanguage)?.text ?? false;
  }

  private sessionInit() {
    const SESSION = this.sessionService.getSession();
    this.state.grid.rows = SESSION?.engagement?.chatApp?.header?.grid?.rows ?? '50px';
    this.state.grid.columns = SESSION?.engagement?.chatApp?.header?.grid?.columns ?? '45px 1fr 40px 30px';
    this.state.isFullscreen = SESSION?.engagement?.chatApp?.isFullscreen ?? false;
    this.state.previewMode = this.localStorageService.getChatAppStateParameter('previewMode') ?? false;
    this.state.languageChange = SESSION?.engagement?.chatApp?.header?.languageChange;
    this.state.rightIcon = SESSION?.engagement?.chatApp?.header?.rightIcon;
    this.initTranslate(SESSION);
    this.setQuickLinksData(SESSION?.engagement?.chatApp?.header?.quickLinks);
    this.setHeaderTitle(SESSION?.engagement);
  }

  private handleAudio(): void {
    const RAW_WIDGET_AUDIO = localStorage.getItem('widgetAudio');
    if (RAW_WIDGET_AUDIO) {
      this.audioEnabled = JSON.parse(RAW_WIDGET_AUDIO);
    }
  }

  private initTranslate(session: any) {
    const LANGUAGE = session?.gAcaProps?.userSelectedLanguage;
    this.translateLanguage = LANGUAGE ? LANGUAGE?.iso2 : this.state.languageChange?.defaultLanguage ?? 'en';
    this.translateService.use(this.translateLanguage);
    this.displayLanguage = this.isMultiLanguageChange() ? this.translateLanguage : this.state.languageChange?.languages?.find(language => language.iso2 !== this.translateLanguage).iso2;
  }

  private setQuickLinksData(quickLinks: QuickLinks) {
    this.localStorageService.setItem('aiap-header-quick-links', quickLinks?.data);
    this.state.quickLinks['icon'] = quickLinks?.icon;
    const QUICK_LINK_DATA = quickLinks?.data?.find(data => data.language === this.translateLanguage);
    this.state.quickLinks.title = QUICK_LINK_DATA?.modalTitle;
    this.state.quickLinks['links'] = QUICK_LINK_DATA?.links;
  }
}
