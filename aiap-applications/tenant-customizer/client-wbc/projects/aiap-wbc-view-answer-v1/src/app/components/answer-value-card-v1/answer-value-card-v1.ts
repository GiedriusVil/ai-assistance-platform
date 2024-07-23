/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, catchError, of, tap } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EngagementsServiceV1
} from 'client-services';

import {
  EventsServiceV1,
  LocalStorageServiceV1,
  NotificationServiceV2,
  SessionServiceV1,
} from 'client-shared-services';

import { ANSWERS_MESSAGES } from '../../messages';

const PREVIEW_SUPPORTED_CHAT_APP_VERSIONS = ['0.2.0'];

@Component({
  selector: 'aiap-answer-value-card-v1',
  templateUrl: './answer-value-card-v1.html',
  styleUrls: ['./answer-value-card-v1.scss'],
})
export class AnswerValueCardV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'AnswerValueCardV1';
  }

  private _destroyed$: Subject<void> = new Subject();

  @Input() value: any;
  @Input() disabledTranslation: any;
  @Output() valueRemove = new EventEmitter<any>();
  @Output() translateValue = new EventEmitter<any>();

  _selections: any = {
    items: [],
    selectedItem: undefined,
    answerStoreLanguage: undefined,
    type: undefined,
  };

  _state = {
    types: [],
    intentName: '',
    previewDisabled: false,
  }

  // x - the length of overflow menu option, y - half heigh of preview button
  overflowMenuOffset = { x: 160, y: 17 };
  engagements: any[] = [];

  state = lodash.cloneDeep(this._state);
  isTextType = false;
  selections: any = lodash.cloneDeep(this._selections);
  translationDIsabledText = 'Translation is disabled because card with default language is not added or no text is entered!';

  constructor(
    protected eventsService: EventsServiceV1,
    protected sessionService: SessionServiceV1,
    private engagementsService: EngagementsServiceV1,
    private notificationService: NotificationServiceV2,
    private localStorageService: LocalStorageServiceV1,
    ) {
    // 
  }

  ngOnInit(): void {
    this.state.intentName = ramda.pathOr('', ['output', 'intent', 'name'], this.value);
    this.refreshTypes();
    this.getEngagements();
  }

  ngOnDestroy(): void {
    this.closePreviewChat();
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  isTextTypeSelected() {
    let retVal = false;
    if (this.value?.type?.value == 'TEXT') {
      retVal = true;
    }
    return retVal;
  }

  updateIntentNameInValue() {
    if (
      !lodash.isEmpty(this.state.intentName)
    ) {
      lodash.set(this.value, 'output.intent.name', this.state.intentName);
    } else {
      delete this.value.output.intent.name;
      if (
        lodash.isObject(this.value.output?.intent) &&
        lodash.isEmpty(this.value.output?.intent)
      ) {
        delete this.value.output.intent;
      }
    }
  }

  translate() {
    const TRANSLATION_PARAMS = this.sanitizeTranslationParams();
    this.translateValue.emit(TRANSLATION_PARAMS);
  }

  sanitizeTranslationParams() {
    const RET_VAL = lodash.cloneDeep(this.value);
    return RET_VAL;
  }

  isTranslationDisabled() {
    let retVal = false;
    if (this.disabledTranslation) {
      retVal = true;
    }
    return retVal;
  }

  isValuesValid() {
    let retVal = true;
    const ANSWER_STORE_DEFAULT_LANGUAGE = this.value?.defaultLanguage;
    const SELECTED_LANGUAGE = this.value?.language;
    const SELECTED_TYPE = this.value?.type;
    if (
      lodash.isEmpty(SELECTED_TYPE) ||
      lodash.isEmpty(SELECTED_LANGUAGE) ||
      ANSWER_STORE_DEFAULT_LANGUAGE === SELECTED_LANGUAGE
    ) {
      retVal = false;
    }
    return retVal;
  }

  previewAnswer(engagement: any) {
    const TEXT = this.value?.output?.text;
    const ANSWER = {
      text: TEXT
    };
    this.localStorageService.set('aiap-answer-preview', ANSWER);
    this.loadChatWidget(engagement);
    _debugX(AnswerValueCardV1.getClassName(), 'previewAnswer', { engagement, ANSWER });
  }

  handleRemoveValueClickEvent() {
    this.valueRemove.emit();
  }

  handleValueChangeEvent(event: any) {
    this.value.output.text = event;
  }

  updateIntentNameInState() {
    if (
      !lodash.isEmpty(this.value.output?.intent?.name) &&
      lodash.isString(this.value.output.intent.name)
    ) {
      this.state.intentName = this.value.output.intent.name;
    } else {
      this.state.intentName = '';
    }
  }

  getEngagements() {
    const QUERY = { isNotFullscreen: true };
    this.engagementsService.findManyByQuery(QUERY).pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      catchError((error: any) => this.handleFindManyByQueryError(error))
    ).subscribe((response: any) => {
      _debugX(AnswerValueCardV1.getClassName(), 'getEngagements', { response });
      if (lodash.isArray(response?.items)) {
        this.engagements = response?.items?.filter((item) => PREVIEW_SUPPORTED_CHAT_APP_VERSIONS.includes(item?.chatApp?.version));
        this.state.previewDisabled = lodash.isEmpty(this.engagements);
      }
      const OVERFLOW_MENU_OFFSET = lodash.cloneDeep(this.overflowMenuOffset);
      OVERFLOW_MENU_OFFSET.y = this.engagements?.length ? this.engagements.length * 20 + 17 : 17;
      this.overflowMenuOffset = OVERFLOW_MENU_OFFSET;
      this.eventsService.loadingEmit(false);
    });
  }

  private handleFindManyByQueryError(error: any) {
    _errorX(AnswerValueCardV1.getClassName(), `handleFindManyByQueryError`, { error });
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(ANSWERS_MESSAGES.ERROR.FIND_ENGAGEMENTS_BY_QUERY);
    return of();
  }

  private refreshTypes() {
    const MODULE_TYPES = [
      {
        content: 'TEXT',
        value: 'TEXT',
        selected: false,
      },
      {
        content: 'JSON',
        value: 'JSON',
        selected: false,
      },
    ];
    for (const TYPE of MODULE_TYPES) {
      TYPE.selected = this.value?.type === TYPE?.value;
      this.state.types.push(TYPE);
      if (
        TYPE.selected
      ) {
        this.value.type = TYPE;
      }
    }
  }

  private loadChatWidget(engagement: any) {
    const CA = document.getElementById('aca-chat-app-v2');
    const TENANT = this.sessionService.getTenant();
    const ENGAGEMENT_ID = engagement?.id;
    const ASSISTANT_ID = engagement?.assistant?.id;
    const TENANT_ID = TENANT?.id;
    if (!CA) {
      const WIDGET_OPTIONS = `${TENANT?.chatAppBaseUrl}/v1/get-widget-options?tenantId=${TENANT_ID}&assistantId=${ASSISTANT_ID}&engagementId=${ENGAGEMENT_ID}`;
      this.loadScripts(WIDGET_OPTIONS, 'get-widget-options');
      const WIDGET = `${TENANT?.chatAppBaseUrl}/v1/get-widget?tenantId=${TENANT_ID}&assistantId=${ASSISTANT_ID}&engagementId=${ENGAGEMENT_ID}`;
      this.loadScripts(WIDGET, 'get-widget');
      const WIDGET_DEFAULT = `${TENANT?.chatAppBaseUrl}/v1/get-widget-default?tenantId=${TENANT_ID}&assistantId=${ASSISTANT_ID}&engagementId=${ENGAGEMENT_ID}`;
      this.loadScripts(WIDGET_DEFAULT, 'get-widget-default');
    }

    let retries = 0;
    const INTERVAL_IDA = setInterval(() => {
      retries += 1;
      const CA = document.getElementById('aca-chat-app-v2');
      if (CA) {
        clearInterval(INTERVAL_IDA);
        this.openPreviewChat(engagement, TENANT_ID, TENANT?.hash);
      }
      if (retries >= 10) {
        clearInterval(INTERVAL_IDA);
        _debugX(AnswerValueCardV1.getClassName(), 'setInterval', 'Failed to initialize chat widget!');
      }
    }, 1000)
  }

  private loadScripts(src: string, id: string) {
    const ELEMENT = document.getElementById(id);
    if (!lodash.isElement(ELEMENT)) {
      const SCRIPT_ELEMENT = document.createElement('script');
      const HEAD = document.getElementsByTagName('head')[0];
      SCRIPT_ELEMENT.id = id;
      SCRIPT_ELEMENT.src = src;
      _debugX(AnswerValueCardV1.getClassName(), 'loadScripts', { SCRIPT_ELEMENT });
      HEAD.appendChild(SCRIPT_ELEMENT);
    }
  }

  private openPreviewChat(engagement: any, tenantId: string, tenantHash: string) {
    const EVENT = {
      type: 'aiapChatWindowPreviewOpen',
      data: { engagement, tenant: { tenantId, tenantHash } }
    };
    _debugX(AnswerValueCardV1.getClassName(), 'openPreviewChat', { EVENT });
    setTimeout(() => {
      window['postMessage'](EVENT, '*')
    }, 0);
  }

  private closePreviewChat() {
    const EVENT = {
      type: 'aiapChatPreviewWidowClose'
    };
    setTimeout(() => {
      window['postMessage'](EVENT, '*')
    }, 0);
  }
}
