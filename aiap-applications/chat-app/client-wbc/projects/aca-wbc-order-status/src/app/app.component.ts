/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnInit,
  ViewEncapsulation,
  OnChanges,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {
  COMPONENTS_TYPE,
  FINAL_MESSAGES_TYPE,
  KCFRS,
  ALERTS,
  FIRST_QUESTION,
  NODE_TYPE,
  FLOW_ANSWERS,
  SLIDER_VALUES,
} from './constants';

import * as lodash from 'lodash';

import { UntypedFormGroup } from '@angular/forms';

import {
  ChatWidgetServiceV1,
  HTMLDependenciesServiceV1,
  ConfigsServiceV1,
  ModalServiceV1,
} from 'client-services';

import { SENDER_ACTIONS } from 'client-utils';

import { KCFRS_FLOW } from './selfCheckoutQuestionariesFlow';
import { Observable, BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
@Component({
  selector: 'aca-wbc-order-status',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, OnChanges {
  static getElementTag() {
    return 'aca-wbc-order-status';
  }

  ORDER_TYPES: any = {
    PR: 'pr_number',
    PO: 'po_number',
    INVOICE: 'invoice_number',
  };

  ORDER_MESSAGE_PREFIX: any = {
    PR: 'Check status of purchase request',
    PO: 'Check status of purchase order',
    INVOICE: 'Check status of invoice',
  };

  title = 'aca-wbc-order-status';

  modalId: string = 'aiap-wbc-compliance-self-check-modal';

  @ViewChild('multiCard') multiCard;
  @ViewChild('orderForm') orderForm: any;

  @Input() set configs(configs: any) {
    this.configsService.parseConfigs(configs);
    this.translateService.use(this.configsService.getLanguage());
  }

  @Input() message: any;
  @Output() onWbcEvent = new EventEmitter<any>();

  state: any = {};
  icons: any = {};
  cardContent: string = '';
  assetsUrl: any;
  complianceSelfcheckForm: UntypedFormGroup;
  contractId: string;
  kcfrs: any;
  kcfrsStatuses: any = {};
  renderQuestions: any = {};
  answersRegistry: any = {};
  finalMessagesProps: any = {};
  refreshForm: boolean = false;

  kcfr004obs: BehaviorSubject<any[]>;
  kcfr003_1obs: BehaviorSubject<any[]>;
  kcfr003_2obs: BehaviorSubject<any[]>;
  renderKCFR004Questions$: Observable<any>;
  renderKCFR003_1Questions$: Observable<any>;
  renderKCFR003_2Questions$: Observable<any>;

  constructor(
    private translateService: TranslateService,
    private configsService: ConfigsServiceV1,
    private chatWidgetService: ChatWidgetServiceV1,
    private htmlDependenciesService: HTMLDependenciesServiceV1,
    private modalService: ModalServiceV1
  ) { }

  ngOnInit(): void {
    this.loadHTMLDependencies();
    this.setAssetsUrl();
    this.cardContent = COMPONENTS_TYPE.ORDER_STATUS;
    this.initForm();
  }

  ngOnChanges(): void {
    this.getIcons();
  }

  postMessage(text: string) {
    const MESSAGE: any = {
      type: 'user',
      text: text,
      timestamp: new Date().getTime(),
    };
    const EVENT = {
      type: 'POST_MESSAGE',
      data: MESSAGE,
    };

    this.onWbcEvent.emit(EVENT);
    this.clearInputs();
  }

  postSelfcheckMessage(data: any, messageType: string) {
    const MESSAGE = {
      type: 'user',
      text: '',
      timestamp: new Date().getTime(),
      sender_action: {
        type: messageType,
        data: data,
      },
    };
    const EVENT = {
      type: 'POST_MESSAGE',
      data: MESSAGE,
    };
    this.onWbcEvent.emit(EVENT);
  }

  clearInputs() {
    this.orderForm.reset();
  }

  getOrderStatus(event: any) {
    event.preventDefault();

    if (lodash.isEmpty(this.orderForm)) {
      return;
    }

    const TYPE = this.getEnteredOrderType(this.orderForm.controls);

    if (!TYPE) {
      return;
    }

    const PREFIX = this.ORDER_MESSAGE_PREFIX[TYPE];

    this.postMessage(
      `${PREFIX} ${this.orderForm.controls[this.ORDER_TYPES[TYPE]].value}`
    );
  }

  otherFieldsHaveData(excludeField: string) {
    if (lodash.isEmpty(this.orderForm)) {
      return false;
    }

    let otherFieldsHaveData = false;

    for (const KEY of Object.keys(this.orderForm.controls)) {
      if (KEY === excludeField) {
        continue;
      }

      otherFieldsHaveData ||= !lodash.isEmpty(
        this.orderForm.controls[KEY].value
      );
    }

    return otherFieldsHaveData;
  }

  formHasData() {
    if (lodash.isEmpty(this.orderForm)) {
      return true;
    }

    const TYPE = this.getEnteredOrderType(this.orderForm.controls);

    const RET_VAL = TYPE === undefined;

    return RET_VAL;
  }

  getEnteredOrderType(formControls: any): string | undefined {
    if (lodash.isEmpty(formControls)) {
      return undefined;
    }

    for (const TYPE of Object.keys(this.ORDER_TYPES)) {
      if (
        !lodash.isEmpty(this.orderForm.controls[this.ORDER_TYPES[TYPE]]?.value)
      ) {
        return TYPE;
      }
    }

    return undefined;
  }

  getIcons() {
    if (!this.configsService.getHost()) {
      return;
    }

    this.icons['info'] = this.getIcon('info-black.svg', 'info');
  }

  getIcon(fileName: string, propertyName: string) {
    const ICONS = this.message?.icons || {};
    const ICON_FROM_PARAMETERS = ICONS[propertyName];
    if (ICON_FROM_PARAMETERS) {
      return ICON_FROM_PARAMETERS;
    }

    const RET_VAL = `${this.configsService.getHost()}/${fileName}`;
    return RET_VAL;
  }

  setCardContent(componentName: string) {
    this.cardContent = componentName;
  }

  isOrderStatusShow() {
    return this.cardContent == COMPONENTS_TYPE.ORDER_STATUS;
  }

  isComplianceSelfcheckShow() {
    return this.cardContent == COMPONENTS_TYPE.COMPLIANCE_SELFCHECK;
  }

  openSelfcheckModal() {
    this.openModal(this.modalId);
  }

  /**
   *  Sets the behavior for a scrolling box when scrolling is triggered
   * @param behavior default is 'smooth' and 'auto' to scroll instantly
   */
  scrollToBottom(behavior = 'smooth') {
    setTimeout(() => {
      this.multiCard.nativeElement.scrollTo({
        top:
          this.multiCard.nativeElement.scrollHeight -
          this.multiCard.nativeElement.clientHeight,
        behavior: behavior,
        left: 0,
      });
    }, 0);
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  onCloseModal(id) {
    this.modalService.close(id);
  }

  setAssetsUrl() {
    const HOST_URL = this.chatWidgetService.getClientWbcHostUrl();
    this.assetsUrl = `${HOST_URL}/${AppComponent.getElementTag()}/assets`;
  }

  updateContractId(event: any) {
    this.contractId = event.target.value;
  }

  initForm() {
    this.kcfrs = KCFRS_FLOW;
    this.renderQuestions = {};
    this.answersRegistry = {};
    this.finalMessagesProps = {};

    this.kcfr004obs = new BehaviorSubject<any[]>([
      this.kcfrs[0].questions[FIRST_QUESTION],
    ]);
    this.renderKCFR004Questions$ = this.kcfr004obs.asObservable();
    this.kcfr003_1obs = new BehaviorSubject<any[]>([
      this.kcfrs[1].questions[FIRST_QUESTION],
    ]);
    this.renderKCFR003_1Questions$ = this.kcfr003_1obs.asObservable();
    this.kcfr003_2obs = new BehaviorSubject<any[]>([
      this.kcfrs[2].questions[FIRST_QUESTION],
    ]);
    this.renderKCFR003_2Questions$ = this.kcfr003_2obs.asObservable();

    for (const kcfr of this.kcfrs) {
      const QUESTION_RENDER_STRUCT = {
        ...kcfr.questions[FIRST_QUESTION],
        initValue: SLIDER_VALUES.UNANSWERED,
      };
      this.renderQuestions[kcfr.id] = [QUESTION_RENDER_STRUCT];
      this.answersRegistry[kcfr.id] = [];
      this.finalMessagesProps[kcfr.id] = {
        render: false,
        message: '',
      };
    }
  }

  refreshEvent() {
    this.initForm();
    this.refreshForm = !this.refreshForm;
  }

  finishEvent() { }

  handleAnswerSliderEvent(eventDetails: any) {
    const ANSWERED_KCFR_ID = eventDetails?.kcfr;
    const ANSWER = eventDetails?.answer;
    const ACTUAL_NODE = eventDetails?.actualNode;
    const NEXT_NODE_TYPE = eventDetails?.nextNode?.type;
    const NEXT_NODE_CONTENT = eventDetails?.nextNode?.content;

    for (const kcfr of this.kcfrs) {
      if (kcfr['id'] == ANSWERED_KCFR_ID) {
        if (!lodash.isEmpty(ANSWER)) {
          const KCFR_QUESTIONS = kcfr?.questions;
          const QUESTION_ANSWERED = KCFR_QUESTIONS?.[ACTUAL_NODE]?.text;
          if (NEXT_NODE_TYPE == NODE_TYPE.NODE) {
            const ANSWER_REGITRSY_NODE = {
              node: ACTUAL_NODE,
              question: QUESTION_ANSWERED,
              answer: ANSWER,
            };
            this.answersRegistry[ANSWERED_KCFR_ID].push(ANSWER_REGITRSY_NODE);

            const PARAMS = {
              kcfrId: ANSWERED_KCFR_ID,
              lastQuestionAnswer: ANSWER,
              nextQuestionToRender: KCFR_QUESTIONS?.[NEXT_NODE_CONTENT],
            };

            this.updateQuestionsToRender(PARAMS);

            this.finalMessagesProps[ANSWERED_KCFR_ID]['render'] = false;

            if (ACTUAL_NODE == FIRST_QUESTION) {
              this.kcfrsStatuses[ANSWERED_KCFR_ID] = {
                started: true,
                completed: false,
                endMessage: null,
                answersRegistry: this.answersRegistry[ANSWERED_KCFR_ID],
              };
              const SELFCHECK_DATA = {
                contractId: this.contractId,
                kcfrsStatuses: this.kcfrsStatuses,
              };
              this.postSelfcheckMessage(
                SELFCHECK_DATA,
                SENDER_ACTIONS.LOG_USER_ACTION
              );
            }
          } else {
            const FINAL_MESSAGE = eventDetails['nextNode'];
            this.setupFinalMessage(ANSWERED_KCFR_ID, FINAL_MESSAGE);

            const ANSWER_REGITRSY_NODE = {
              node: ACTUAL_NODE,
              question: QUESTION_ANSWERED,
              answer: ANSWER,
            };
            this.answersRegistry[ANSWERED_KCFR_ID].push(ANSWER_REGITRSY_NODE);

            const PARAMS = {
              kcfrId: ANSWERED_KCFR_ID,
              lastQuestionAnswer: ANSWER,
              nextQuestionToRender: null,
            };

            this.updateQuestionsToRender(PARAMS);

            this.kcfrsStatuses[ANSWERED_KCFR_ID] = {
              started: true,
              completed: true,
              endMessage: FINAL_MESSAGE,
              answersRegistry: this.answersRegistry[ANSWERED_KCFR_ID],
            };
            const SELFCHECK_DATA = {
              contractId: this.contractId,
              kcfrsStatuses: this.kcfrsStatuses,
            };
            this.postSelfcheckMessage(
              SELFCHECK_DATA,
              SENDER_ACTIONS.LOG_USER_ACTION
            );
          }
        } else {
          if (this.renderQuestions[ANSWERED_KCFR_ID].length > 1) {
            const INDEX = this.answersRegistry[ANSWERED_KCFR_ID].findIndex(
              (object) => {
                return object?.node === ACTUAL_NODE;
              }
            );
            this.answersRegistry[ANSWERED_KCFR_ID].length = INDEX;
            const INDEX_LAST_QUESTION =
              this.renderQuestions[ANSWERED_KCFR_ID].length - 1;
            const LAST_RENDERED_NODE =
              this.renderQuestions[ANSWERED_KCFR_ID][INDEX_LAST_QUESTION]?.node;
            if (ACTUAL_NODE != LAST_RENDERED_NODE) {
              this.renderQuestions[ANSWERED_KCFR_ID] = this.removeAfterQuestion(
                this.renderQuestions[ANSWERED_KCFR_ID],
                ACTUAL_NODE
              );
              this.removeToObservableArray(ANSWERED_KCFR_ID, ACTUAL_NODE);
            }
          }
          const PARAMS = {
            kcfrId: ANSWERED_KCFR_ID,
            lastQuestionAnswer: ANSWER,
            nextQuestionToRender: null,
          };
          this.updateQuestionsToRender(PARAMS);
          this.finalMessagesProps[ANSWERED_KCFR_ID]['type'] = '';
          this.finalMessagesProps[ANSWERED_KCFR_ID]['render'] = false;
        }
      }
    }
  }

  setupFinalMessage(kcfrId: string, finalMessage: {}) {
    this.finalMessagesProps[kcfrId]['render'] = true;
    this.finalMessagesProps[kcfrId]['type'] = finalMessage['type'];
    this.finalMessagesProps[kcfrId]['message'] = finalMessage['content'];
  }

  getFinalMessageType(kcfrId: string) {
    let retVal = '';

    if (
      this.finalMessagesProps[kcfrId].type == FINAL_MESSAGES_TYPE.NO_DEFECTS
    ) {
      retVal = ALERTS.SUCCESS;
    } else if (
      this.finalMessagesProps[kcfrId].type == FINAL_MESSAGES_TYPE.DEFECTS
    ) {
      retVal = ALERTS.DANGER;
    }

    return retVal;
  }

  getTitleIconType(kcfrId: string) {
    let retVal = '';

    if (
      this.finalMessagesProps[kcfrId].type == FINAL_MESSAGES_TYPE.NO_DEFECTS
    ) {
      retVal = FINAL_MESSAGES_TYPE.NO_DEFECTS;
    } else if (
      this.finalMessagesProps[kcfrId].type == FINAL_MESSAGES_TYPE.DEFECTS
    ) {
      retVal = FINAL_MESSAGES_TYPE.DEFECTS;
    }

    return retVal;
  }

  renderFinalMessage(kcfrId: string) {
    return this.finalMessagesProps?.[kcfrId]?.render;
  }

  pushToObservableArray(kcfrId: string, item: {}) {
    if (kcfrId === KCFRS['KCFR004']) {
      this.renderKCFR004Questions$.pipe(take(1)).subscribe((val) => {
        const newArr = [...val, item];
        this.kcfr004obs.next(newArr);
      });
    } else if (kcfrId === KCFRS['KCFR003-1']) {
      this.renderKCFR003_1Questions$.pipe(take(1)).subscribe((val) => {
        const newArr = [...val, item];
        this.kcfr003_1obs.next(newArr);
      });
    } else if (kcfrId === KCFRS['KCFR003-2']) {
      this.renderKCFR003_2Questions$.pipe(take(1)).subscribe((val) => {
        const newArr = [...val, item];
        this.kcfr003_2obs.next(newArr);
      });
    }
  }

  updateObservableArray(kcfrId: string, index: number, item: {}) {
    if (kcfrId === KCFRS['KCFR004']) {
      this.renderKCFR004Questions$.pipe(take(1)).subscribe((val) => {
        val[index] = item;
        this.kcfr004obs.next(val);
      });
    } else if (kcfrId === KCFRS['KCFR003-1']) {
      this.renderKCFR003_1Questions$.pipe(take(1)).subscribe((val) => {
        val[index] = item;
        this.kcfr003_1obs.next(val);
      });
    } else if (kcfrId === KCFRS['KCFR003-2']) {
      this.renderKCFR003_2Questions$.pipe(take(1)).subscribe((val) => {
        val[index] = item;
        this.kcfr003_2obs.next(val);
      });
    }
  }

  removeAfterQuestion(questions, targerNode) {
    const INDEX = questions.findIndex((question) => {
      return question?.node === targerNode;
    });
    questions.length = INDEX + 1;
    return questions;
  }

  removeToObservableArray(kcfrId: string, actualNode: string) {
    if (kcfrId === KCFRS['KCFR004']) {
      this.renderKCFR004Questions$.pipe(take(1)).subscribe((val) => {
        const newArr = this.removeAfterQuestion(val, actualNode);
        this.kcfr004obs.next(newArr);
      });
    } else if (kcfrId === KCFRS['KCFR003-1']) {
      this.renderKCFR003_1Questions$.pipe(take(1)).subscribe((val) => {
        const newArr = this.removeAfterQuestion(val, actualNode);
        this.kcfr003_1obs.next(newArr);
      });
    } else if (kcfrId === KCFRS['KCFR003-2']) {
      this.renderKCFR003_2Questions$.pipe(take(1)).subscribe((val) => {
        const newArr = this.removeAfterQuestion(val, actualNode);
        this.kcfr003_2obs.next(newArr);
      });
    }
  }

  updateQuestionsToRender(params: any) {
    const KCFR_ID = params?.kcfrId;
    const LAST_QUESTION_ANSWER = params?.lastQuestionAnswer;
    const NEXT_QUESTION_TO_RENDER = params?.nextQuestionToRender;

    const INDEX_LAST_QUESTION = this.renderQuestions[KCFR_ID].length - 1;
    let lastRenderedQuestion =
      this.renderQuestions[KCFR_ID][INDEX_LAST_QUESTION];
    lastRenderedQuestion = {
      ...lastRenderedQuestion,
      initValue:
        LAST_QUESTION_ANSWER === FLOW_ANSWERS.POSITIVE
          ? SLIDER_VALUES.POSITIVE
          : LAST_QUESTION_ANSWER == FLOW_ANSWERS.NEGATIVE
            ? SLIDER_VALUES.NEGATIVE
            : SLIDER_VALUES.UNANSWERED,
    };

    //update last answered question in the list of questions to render
    this.renderQuestions[KCFR_ID][INDEX_LAST_QUESTION] = lastRenderedQuestion;

    //update last answered question in the list of questions to render (observable)
    this.updateObservableArray(
      KCFR_ID,
      INDEX_LAST_QUESTION,
      lastRenderedQuestion
    );

    if (!lodash.isEmpty(NEXT_QUESTION_TO_RENDER)) {
      //add the new question which hasn't been asnwered yet
      this.renderQuestions[KCFR_ID].push(NEXT_QUESTION_TO_RENDER);

      //add a new question which hasn't been asnwered yet (observable)
      this.pushToObservableArray(KCFR_ID, NEXT_QUESTION_TO_RENDER);
    }
  }

  isReady() {
    return this.htmlDependenciesService.idLoadedCSSDependency(
      this.elCSSLinkId()
    );
  }

  private elCSSLinkId() {
    return AppComponent.getElementTag();
  }

  private async loadHTMLDependencies() {
    const CLIENT_WBC_URL = this.chatWidgetService.getClientWbcUrl();
    this.htmlDependenciesService.loadCSSDependency(
      this.elCSSLinkId(),
      `${CLIENT_WBC_URL}/${this.elCSSLinkId()}/styles.css`
    );
  }
}
