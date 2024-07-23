/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import {
  DEFAULT_TABLE,
  OUTLETS,
} from 'client-utils';

import {
  _debugX,
  _errorX,
  LANGUAGE_LIST,
} from 'client-shared-utils';

import {
  ActivatedRouteServiceV1,
  EventsServiceV1,
  NotificationServiceV2,
  QueryServiceV1,
} from 'client-shared-services';

import {
  AnswersServiceV1,
} from 'client-services';

import { BaseViewV1 } from 'client-shared-views';

import { ANSWERS_MESSAGES } from '../messages';

@Component({
  selector: 'aiap-answer-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss'],
})
export class AnswerViewV1 extends BaseViewV1 implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  
  static getClassName(): string {
    return 'AnswerViewV1';
  }

  outlet = OUTLETS.tenantCustomizer;

  answerStoreId = undefined;
  answerStoreName = undefined;
  answerStoreDefaultLanguage = undefined;
  answerKey = undefined;

  _answerValues: any[] = [];

  answerValues: any[] = lodash.cloneDeep(this._answerValues);

  response: any = {
    items: [],
    total: 0,
    parent: {}
  };

  state: any = {
    isLoading: false,
    queryType: DEFAULT_TABLE.ANSWERS.TYPE,
    answerValues: [],
    answerKey: undefined,
  };

  answerStore: any = undefined;

  constructor(
    private activatedRouteServiceV1: ActivatedRouteServiceV1,
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
    private answersService: AnswersServiceV1,
    private notificationService: NotificationServiceV2,
  ) {
    super();
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  ngOnInit() {
    this.subscribeToQueryParams();
  }

  ngAfterViewInit() {
    //
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  subscribeToQueryParams() {
    this.activatedRouteServiceV1.queryParams()
      .subscribe((params: any) => {
        _debugX(AnswerViewV1.getClassName(), 'subscribeToQueryParams', { params });
        this.state.isLoading = true;
        this.answerStoreId = params?.answerStoreId;
        this.answerStoreName = params?.answerStoreName;
        this.answerStoreDefaultLanguage = params?.answerStoreDefaultLanguage;
        if (!lodash.isEmpty(params.answerKey)) {
          this.answerKey = params.answerKey;
          this.state.answerKey = params.answerKey;
          this.loadAnswerStoreByQuery();
        } else {
          this.state.isLoading = false;
          this.handleAddNewValue();
        }
      });
  }

  loadAnswerStoreByQuery() {
    const DEFAULT_QUERY = this.queryService.query(this.state.queryType);
    this.answersService.findAnswersByQuery(this.answerStoreId, DEFAULT_QUERY, true).pipe(
      catchError((error: any) => this.handleFindAnswersByQueryError(error))
    ).subscribe((response: any) => {
      _debugX(AnswerViewV1.getClassName(), `loadAnswerStoreByQuery`, { response, DEFAULT_QUERY });
      this.answerValues = response?.items?.find(item => item?.key === this.answerKey)?.values;
      this.updateAnswerValues();
      this.state.answerValues = lodash.cloneDeep(this.answerValues);
      this.state.isLoading = false;
    });
  }

  handleAddNewValue() {
    const NEW_VALUE = {
      language: undefined,
      output: {
        text: undefined,
        context: undefined,
        intent: undefined,
      },
      defaultLanguage: this.answerStoreDefaultLanguage,
      answerStoreId: this.answerStoreId,
      type: 'TEXT',
      expanded: true,
    };
    this.state.answerValues.push(NEW_VALUE);
    _debugX(AnswerViewV1.getClassName(), 'handleAddNewLanguageValue', { answer_values: this.state.answerValues });
  }

  handleValueRemoveEvent(i) {
    this.state.answerValues.splice(i, 1);
  }

  async save() {
    const ANSWER = this.sanitizeAnswerPayload(this.state.answerValues);

    _debugX(AnswerViewV1.getClassName(), 'save', {
      answerStoreId: this.answerStoreId,
      ANSWER
    });

    if (
      ANSWER.key.length === 0 ||
      ANSWER.values.length === 0
    ) {
      return;
    }

    this.eventsService.loadingEmit(true);
    this.answersService.saveAnswer(this.answerStoreId, ANSWER)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleSaveError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(AnswerViewV1.getClassName(), 'save | response', response);
        this.notificationService.showNotification(ANSWERS_MESSAGES.SUCCESS.SAVE_ONE);
        this.answerValues = response?.values;
        this.updateAnswerValues();
        this.state.answerValues = lodash.cloneDeep(this.answerValues);
        this.eventsService.loadingEmit(false);
      });
  }

  isTranslationDisabled() {
    let translationDisabled = true;
    this.state.answerValues.map((value) => {
      if (
        value?.language === value?.defaultLanguage &&
        !lodash.isEmpty(value?.output?.text) &&
        !lodash.isEmpty(value.type)
      ) {
        translationDisabled = false;
      }
    });
    return translationDisabled;
  }

  translate(translationParams) {
    const SANITIZED_PARAMS = this.constructTranslateParams(translationParams);
    this.answersService.translateAnswer(SANITIZED_PARAMS)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleTranslationError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response) => {
        _debugX(AnswerViewV1.getClassName(), 'translate', response);
        const RESPONSE: any = response;
        this.eventsService.filterEmit(null);
        this.notificationService.showNotification(ANSWERS_MESSAGES.SUCCESS.TRANSLATE);
        this.updateCardWithTranslatedText(RESPONSE);
      });
  }

  constructTranslateParams(params) {
    const OUTPUT_LANGUAGE = params?.language;
    const ANSWER_STORE_ID = params?.answerStoreId;
    let input;
    let inputLanguage;
    this.state.answerValues.map(value => {
      if (
        value?.language === value?.defaultLanguage
      ) {
        input = value?.output;
        inputLanguage = value?.language;
      }
    });
    const TRANSLATE_PARAMS = {
      answerStoreId: ANSWER_STORE_ID,
      inputLanguage: inputLanguage,
      outputLanguage: OUTPUT_LANGUAGE,
      input: input
    };
    return TRANSLATE_PARAMS;
  }

  updateCardWithTranslatedText(params) {
    const TRANSLATED_TEXT = params?.translatedText;
    const OUTPUT_LANGUAGE = params?.outputLanguage;
    this.state.answerValues.map((value, index) => {
      if (
        value?.language === OUTPUT_LANGUAGE
      ) {
        this.state.answerValues[index].output = TRANSLATED_TEXT;
        this.state.answerValues[index].output.translated = true;
      }
    });
  }

  isSaveButtonDisabled(): boolean {
    const INITIAL_VAL = lodash.cloneDeep(this.answerValues);
    const UPDATED_VAL = lodash.cloneDeep(this.state.answerValues);
    UPDATED_VAL.forEach(answer => {
      if (!lodash.isEmpty(answer.type) && answer.type.value) {
        answer.type = answer.type.value;
      }
    });
    return lodash.isEqual(INITIAL_VAL, UPDATED_VAL) && lodash.isEqual(this.answerKey, this.state.answerKey);
  }

  isValid() {
    const UNIQUE_VALUES = new Set(this.state.answerValues.map((item: any) => item.language));
    const IS_UNIQUE = UNIQUE_VALUES.size < this.state.answerValues.length;

    const RET_VAL =
      IS_UNIQUE ||
      !this.state.answerKey ||
      lodash.isEmpty(this.state.answerValues) ||
      this.state.answerValues.some((item: any) => !item.output.text) ||
      this.state.answerValues.some((item: any) => !item.language);

    return RET_VAL;
  }

  private handleFindAnswersByQueryError(error: any) {
    _errorX(AnswerViewV1.getClassName(), 'handleFindAnswersByQueryError', { error })
    this.showFindAnswerByQueryError();
    return of();
  }

  private handleSaveError(error: any) {
    _errorX(AnswerViewV1.getClassName(), 'handleSaveError', { error })
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(ANSWERS_MESSAGES.ERROR.SAVE_ONE);
    return of();
  }

  private handleTranslationError(response: any) {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(ANSWERS_MESSAGES.ERROR.TRANSLATE);
    return of();
  }

  private showFindAnswerByQueryError() {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(ANSWERS_MESSAGES.ERROR.FIND_BY_QUERY);
  }

  private updateAnswerValues() {
    this.answerValues.forEach(value => {
      const LANGUAGE_OBJECT = LANGUAGE_LIST.find((languageItem: any) => languageItem.code === value.language);
      value.answerStoreId = this.answerStoreId;
      if (!lodash.isEmpty(LANGUAGE_OBJECT)) {
        value.languageName = LANGUAGE_OBJECT?.name;
      }
      if (!lodash.isEmpty(this.answerStoreDefaultLanguage)) {
        value.defaultLanguage = this.answerStoreDefaultLanguage;
      }
      value.expanded = value.language === this.answerStoreDefaultLanguage;
    });
    _debugX(AnswerViewV1.getClassName(), `updateAnswerValues`, { answerValues: this.answerValues });
  }

  private sanitizeAnswerPayload(answerValues) {
    const RET_VAL = {
      key: this.state.answerKey.trim(),
      values: [],
    };
    if (
      !lodash.isEmpty(answerValues) &&
      lodash.isArray(answerValues)
    ) {
      answerValues.forEach((config: any) => {
        const TMP_CONFIG = {
          output: {
            text: '',
            context: '',
            intent: '',
          },
          language: '',
          type: ''
        };
        TMP_CONFIG.output.text = config?.output?.text;
        TMP_CONFIG.output.context = config?.output?.context;
        TMP_CONFIG.output.intent = config?.output?.intent;
        TMP_CONFIG.language = config?.language;
        TMP_CONFIG.type = config?.type?.value

        RET_VAL.values.push(TMP_CONFIG);
      });
    }
    return RET_VAL;
  }
}
