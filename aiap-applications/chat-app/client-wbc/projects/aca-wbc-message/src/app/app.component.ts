/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChatWidgetServiceV1, HTMLDependenciesServiceV1, ConfigsServiceV1, MessagesServiceV1, EventsServiceV1, LocalStorageServiceV1 } from 'client-services';
import { SessionServiceV1} from 'client-services';
import { ATTACHMENT_TYPES } from 'client-utils';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

@Component({
  selector: 'aca-wbc-message',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnChanges, OnDestroy {

  static getElementTag() {
    return 'aca-wbc-message';
  }

  title = 'aca-wbc-message';
  icons: any = {};

  _state = {
    ready: {
      configsReady: false,
      sessionReady: false,
    },
    isTranscript: false,
    iconsEnabled: false,
  }

  state = lodash.cloneDeep(this._state);

  constructor(
    private configsService: ConfigsServiceV1,
    private chatWidgetService: ChatWidgetServiceV1,
    private htmlDependenciesService: HTMLDependenciesServiceV1,
    private sessionService: SessionServiceV1,
    private translateService: TranslateService,
    private messagesService: MessagesServiceV1,
    private eventsService: EventsServiceV1,
    private localStorage: LocalStorageServiceV1
  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.message?.firstChange) {
      this.showPiModal();
      this.messagesService.addMessageToConvesation(this);
    } else if (changes?.message) {
      this.messagesService.replaceMessageInConversation(this, this.index);
    }
  }

  ngOnDestroy(): void {
    this.messagesService.removeMessage(this);
  }

  _message: any;

  get message() {
    return this._message;
  }

  @Input() set message(message: any) {
    this._message = message;
    this.loadHTMLDependencies();
  }

  @Input() index: number;

  @Input() set configs(configs: any) {
    this.configsService.parseConfigs(configs);
    this.translateService.use(this.configsService.getLanguage());

    this.state.ready.configsReady = true;

    this.state.isTranscript = this.configsService.isTranscript();
    this.loadHTMLDependencies();
  }

  @Input() set session(session) {
    this.sessionService.setSession(session);
    this.state.iconsEnabled = this.sessionService.getSession()?.engagement?.chatApp?.messages?.icons?.enabled ?? false;
    this.state.ready.sessionReady = true;
  }

  @Output() onWbcEvent = new EventEmitter<any>();

  isWbcMessage(message) {
    if (lodash.isEmpty(message?.isWbc)) {
      message.isWbc = message?.attachment?.isWbc;
    }
    return ramda.pathOr(false, ['isWbc'], message);
  }

  isReady() {
    const STATE_READY: boolean = Object.values(this.state.ready).every(val => val === true);
    const CSS_LOADED: boolean = this.htmlDependenciesService.idLoadedCSSDependency(this.elCSSLinkId());
    const RET_VAL: boolean = STATE_READY && CSS_LOADED;

    return RET_VAL;
  }

  private elCSSLinkId() {
    return AppComponent.getElementTag();
  }

  private async loadHTMLDependencies() {
    if (!this.state.ready.configsReady) {
      return;
    }
    const CSS_LOCATION_FROM_MESSAGE = this.message?.wbc?.css?.host + this.message?.wbc?.css?.path;

    let clientWbcURL = this.chatWidgetService.getClientWbcUrl();

    if (clientWbcURL === '/client-wbc') {
      clientWbcURL = this.configsService.getHost() + "/client-wbc";
    }

    const DEFAULT_CSS_LOCATION = `${clientWbcURL}/${this.elCSSLinkId()}/styles.css`;
    this.htmlDependenciesService.loadCSSDependency(this.elCSSLinkId(), CSS_LOCATION_FROM_MESSAGE || DEFAULT_CSS_LOCATION);
  }

  handleUserActionEvent(event) {
    const EVENT = {
      type: event.type,
      data: event.data,
    };
    this.onWbcEvent.emit(EVENT);
  }

  isDisplayedInChat(message) {
    const RET_VAL = message?.attachment?.type !== ATTACHMENT_TYPES.PI_AGREEMENT_MODAL;
    return RET_VAL;
  }

  private showPiModal() {
    const ATTACHMENT_TYPE = this.message?.attachment?.type;
    const HAS_ANSWERED = !lodash.isEmpty(this.localStorage.getItem('user')?.piConfirmation?.confirmed);
    if (ATTACHMENT_TYPE === ATTACHMENT_TYPES.PI_AGREEMENT_MODAL && !HAS_ANSWERED) {
      this.eventsService.eventEmit(
        {
          onPiAgreementShow: true,
          text: this.message?.attachment?.text,
        }
      );
    }
  }
}
