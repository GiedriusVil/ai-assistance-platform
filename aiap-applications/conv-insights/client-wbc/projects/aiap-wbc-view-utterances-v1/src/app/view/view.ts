/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { of } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  TableModel,
} from 'carbon-components-angular';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugX,
  StripTextPipe,
  sanitizeIBMOverflowMenuPaneElement,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  UTTERANCES_MESSAGES,
  DEFAULT_TABLE,
  OUTLETS,
} from 'client-utils';

import {
  UtteranceService,
} from 'client-services';

import {
  IgnoreUtteranceModalV1,
  UtteranceAuditModalV1,
  UtteranceIntentModalV1,
  UtteranceFeedbackModalV1
} from 'client-components';


import {
  BaseViewWbcV1,
} from 'client-shared-views';

@Component({
  selector: 'aiap-wbc-utterances-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss'],
  providers: [
    StripTextPipe
  ]
})
export class UtterancesViewV1 extends BaseViewWbcV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'UtterancesViewV1';
  }

  @ViewChild('ignoreUtteranceModal') ignoreUtteranceModal: IgnoreUtteranceModalV1;
  @ViewChild('utteranceAuditModal') utteranceAuditModal: UtteranceAuditModalV1;
  @ViewChild('utteranceIntentModal') utteranceIntentModal: UtteranceIntentModalV1;
  @ViewChild('utteranceFeedbackModal') utteranceFeedbackModal: UtteranceFeedbackModalV1;

  outlet = OUTLETS.convInsights;

  private DEFAULT_INTENT = { id: 'default', content: 'Show all Intents', selected: false };

  private DEFAULT_QUERY_OPTIONS = {
    intents: true,
  };

  state: any = {
    queryType: DEFAULT_TABLE.UTTERANCES.TYPE,
    intents: [],
    waServices: [],
    assistants: [],
    assistantsSelected: [],
    dateRange: {},
    isSystemMessagesVisible: undefined,
  };

  model: TableModel = new TableModel();

  response: any = {
    intents: [],
  };

  constructor(
    private eventsService: EventsServiceV1,
    private sessionService: SessionServiceV1,
    private utteranceService: UtteranceService,
    protected notificationService: NotificationService,
    private queryService: QueryServiceV1,
  ) {
    super(notificationService);
  }

  ngOnInit(): void {
    this._refreshAssistantsDropdownList();

    this.queryService.setOptions(this.state.queryType, lodash.cloneDeep(this.DEFAULT_QUERY_OPTIONS));
    const QUERY = this.queryService.query(this.state.queryType);
    this.state.dateRange = QUERY?.filter?.dateRange;
    this.state.isSystemMessagesVisible = QUERY?.filter?.isSystemMessagesVisible ? true : false;

    _debugX(UtterancesViewV1.getClassName(), `ngOnInit`, {
      query: QUERY,
      this_state: this.state
    });
    this.addFilterEventHandler();
  }

  _refreshAssistantsDropdownList() {
    this.state.assistants = [];
    this.state.assistantsSelected = [];
    const ASSISTANTS = this.sessionService.getAssistantsByAccessGroup();
    const QUERY = this.queryService.query(this.state.queryType);
    const SELECTED_ASSISTANTS_IDS = ramda.pathOr([], ['filter', 'assistantIds'], QUERY);
    if (
      lodash.isArray(ASSISTANTS) &&
      !lodash.isEmpty(ASSISTANTS)
    ) {
      for (let assistant of ASSISTANTS) {
        if (
          !lodash.isEmpty(assistant?.id) &&
          !lodash.isEmpty(assistant?.name)
        ) {
          const ASSISTANT_ID = ramda.path(['id'], assistant);
          const IS_SELECTED = SELECTED_ASSISTANTS_IDS.includes(ASSISTANT_ID);
          const DROPDOWN_ITEM = {
            content: `${assistant.name}`,
            selected: IS_SELECTED,
            ...assistant
          };
          this.state.assistants.push(DROPDOWN_ITEM);
          if (IS_SELECTED) {
            this.state.assistantsSelected.push(DROPDOWN_ITEM);
          }
        }
      }
    }
  }


  private _refreshIntentsDropdownList() {
    const INTENT_SELECTIONS = [];
    const QUERY = this.queryService.query(this.state.queryType);
    const SELECTED_INTENT = ramda.path(['filter', 'intent'], QUERY);
    if (
      lodash.isArray(this.response) &&
      !lodash.isEmpty(this.response)
    ) {
      for (let intent of this.response) {
        if (
          !lodash.isEmpty(intent)
        ) {
          const IS_SELECTED = intent === SELECTED_INTENT;

          INTENT_SELECTIONS.push({
            id: intent,
            content: `#${intent}`,
            selected: IS_SELECTED
          });
        }
      }
      INTENT_SELECTIONS.sort((a, b) => {
        return a.content.toLowerCase().localeCompare(b.content.toLowerCase());
      });
    }
    INTENT_SELECTIONS.unshift(this.DEFAULT_INTENT);
    this.state.intents = INTENT_SELECTIONS;
  }
  ngAfterViewInit(): void {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  ngOnDestroy(): void {
    this.superNgOnDestroy();
    sanitizeIBMOverflowMenuPaneElement(UtterancesViewV1.getClassName(), document);
  }

  handleDateRangeChange(range: any) {
    _debugX(UtterancesViewV1.getClassName(), `handleDateRangeChange`, { range });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.DATE_RANGE, range);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchEvent(utterance: any = undefined): void {
    _debugX(UtterancesViewV1.getClassName(), `handleUtteranceSearchEvent`, { utterance });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, utterance);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchClearEvent() {
    _debugX(UtterancesViewV1.getClassName(), `handleSearchClearEvent`);
    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleIntentSelectionEvent(event: any): void {
    _debugX(UtterancesViewV1.getClassName(), `handleIntentSelectionEvent`, { event });
    const SELECTED_DEFAULT = event?.item?.id === this.DEFAULT_INTENT.id;
    let intent;
    if (SELECTED_DEFAULT) {
      intent = null;
    } else {
      intent = event?.item?.id;
    }
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.INTENT, intent);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleAssistantSelectionEvent(event) {
    _debugX(UtterancesViewV1.getClassName(), 'handleAssistantSelectionEvent', {
      event: event,
      this_state: this.state
    });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.ASSISTANT_IDS, this._selectedAssistantsIds());
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  _selectedAssistantsIds() {
    const RET_VAL = [];
    if (
      lodash.isArray(this.state?.assistantsSelected) &&
      !lodash.isEmpty(this.state?.assistantsSelected)
    ) {
      for (let assistant of this.state?.assistantsSelected) {
        if (
          !lodash.isEmpty(assistant) &&
          assistant.selected
        ) {
          RET_VAL.push(assistant.id);
        }
      }
    }
    return RET_VAL;
  }

  handleSystemMessagesVisibility(event: any) {
    _debugX(UtterancesViewV1.getClassName(), 'handleSystemMessagesVisibility', { event });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.IS_SYSTEM_MESSAGES_VISIBLE, event);
    this.queryService.setOptions(this.state.queryType, lodash.cloneDeep(this.DEFAULT_QUERY_OPTIONS));
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  showIgnoreUtteranceModal(utterance: any): void {
    this.ignoreUtteranceModal.show(utterance);
  }

  showUtteranceIntentModal(utterance: any): void {
    this.utteranceIntentModal.show(utterance);
  }

  showUtteranceAuditModal(utterance: any): void {
    this.utteranceAuditModal.show(utterance);
  }

  showFeedbackModal(utterance) {
    const IS_VIEW_FEEDBACK_ALLOWED = this.sessionService.isActionAllowed({ action: 'utterances.view.view-feedback' });
    if (IS_VIEW_FEEDBACK_ALLOWED) {
      this.utteranceFeedbackModal.show(utterance);
    }
  }

  private addFilterEventHandler(): void {
    let defaultQuery = this.queryService.query(this.state.queryType);
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query) => {
        _debugX(UtterancesViewV1.getClassName(), 'addFilterEventHandler', { query });
        if (query) {
          defaultQuery = query;
        }
        return this.utteranceService.getUtterancesTopIntents(defaultQuery).pipe(
          catchError((error) => this.handleGetDataError(error))
        );
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response) => {
      _debugX(UtterancesViewV1.getClassName(), `addFilterEventHandler`, { response });
      this.response = response;
      this._refreshIntentsDropdownList();
      this.eventsService.loadingEmit(false);
    });
  }

  handleGetDataError(error: any) {
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(UTTERANCES_MESSAGES.ERROR.GET_TOP_INTENTS);
    return of()
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'utterances',
      children: [
        ...children,
        {
          path: '',
          component: UtterancesViewV1,
          data: {
            name: 'Utterances',
            component: UtterancesViewV1.getClassName(),
            description: 'Enables access to Utterances view',
            actions: [
              {
                name: 'Edit utterance',
                component: 'utterances.view.edit',
                description: 'Allows the ability to edit existing utterances',
              },
              {
                name: 'Ignore utterance',
                component: 'utterances.view.ignore',
                description: 'Allows the ability to ignore an existing utterance',
              },
              {
                name: 'View transcript',
                component: 'utterances.view.view-transcript',
                description: 'Allows to open an utterance transcript',
              },
              {
                name: 'View audit',
                component: 'utterances.view.view-audit',
                description: 'Allows the ability to view audit of an utterance',
              },
              {
                name: 'View feedback',
                component: 'utterances.view.view-feedback',
                description: 'Allows the ability to view feedback of an utterance',
              },
            ]
          }
        },
      ],
      data: {
        breadcrumb: 'Utterances',
      }
    };
    return RET_VAL;
  }

}
