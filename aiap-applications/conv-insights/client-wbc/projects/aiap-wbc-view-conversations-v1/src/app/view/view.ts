/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import { catchError, of } from 'rxjs';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  BaseViewWbcV1,
} from 'client-shared-views';

import {
  EventsServiceV1,
  QueryServiceV1,
  SessionServiceV1,
  WbcLocationServiceV1,
  TranslateHelperServiceV1,
} from 'client-shared-services';

import {
  CheckboxItem,
  ComboboxItem,
  SliderItem,
} from 'client-shared-components';

import {
  ConversationDeleteModalV1
} from '../components';

import {
  DEFAULT_TABLE,
  OUTLETS,
  CONVERSATIONS_MESSAGES
} from 'client-utils';

import {
  ConversationService
} from 'client-services';

@Component({
  selector: 'aiap-wbc-conversations-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss'],
})
export class ConversationsViewV1 extends BaseViewWbcV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'ConversationsViewV1';
  }

  @ViewChild('conversationDeleteModalV1') conversationDeleteModalV1: ConversationDeleteModalV1;

  outlet = OUTLETS.convInsights;

  tableConfig = {
    showBrowserData: false,
    showReviewed: false,
    filterIcon: 'assets/carbon-icons/16/operations/filter.svg',
  };

  state: any = {
    queryType: DEFAULT_TABLE.CONVERSATIONS.TYPE,
    defaultSort: DEFAULT_TABLE.CONVERSATIONS.SORT,
    assistants: [],
    assistantsSelected: [],
    dateRange: {},
    isZeroDurationVisible: undefined,
    isNoUserInteractionVisible: undefined,
    isReviewedVisible: undefined,
    channels: [],
    selectedChannels: [],
  };

  filterConfig = {
    isVisible: false,
    isLoading: true,
  };

  filterData = {
    dateRange: {
      from: undefined,
      to: undefined,
      mode: undefined,
    },
    checkboxes: [],
    comboboxes: [],
    numberRangeFrom: 1,
    numberRangeTo: 50,
    slider: [],
  };

  filterDataCopy = lodash.cloneDeep(this.filterData);

  constructor(
    private sessionService: SessionServiceV1,
    private wbcLocationService: WbcLocationServiceV1,
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
    private translateService: TranslateHelperServiceV1,
    private conversationService: ConversationService,
    protected notificationService: NotificationService
  ) {
    super(notificationService);
  }

  ngOnInit(): void {
    let query;
    try {
      this._refreshAssistantsDropdownList();
      this.queryService.setSort(this.state.queryType, this.state.defaultSort);
      query = this.queryService.query(this.state.queryType);
      this.state.dateRange = query?.filter?.dateRange;
      this.state.isZeroDurationVisible = query?.filter?.isZeroDurationVisible ? true : false;
      this.state.isReviewedVisible = query?.filter?.isReviewedVisible ? true : false;
      this.state.isNoUserInteractionVisible = query?.filter?.isNoUserInteractionVisible ? true : false;
      _debugX(ConversationsViewV1.getClassName(), `ngOnInit`, {
        query: query,
        this_state: this.state,
      });
    } catch (error) {
      _errorX(ConversationsViewV1.getClassName(), 'ngOnInit', { error, query });
      throw error;
    }
    this.initFilter(query);
  }

  _refreshAssistantsDropdownList() {
    this.state.assistants = [];
    this.state.assistantsSelected = [];
    const ASSISTANTS = this.sessionService.getAssistantsByAccessGroup();
    const QUERY = this.queryService.query(this.state.queryType);
    const SELECTED_ASSISTANTS_IDS = ramda.pathOr([], ['filter', 'assistantIds'], QUERY);
    if (lodash.isArray(ASSISTANTS) && !lodash.isEmpty(ASSISTANTS)) {
      for (const assistant of ASSISTANTS) {
        if (!lodash.isEmpty(assistant?.id) && !lodash.isEmpty(assistant?.name)) {
          const ASSISTANT_ID = ramda.path(['id'], assistant);
          const IS_SELECTED = SELECTED_ASSISTANTS_IDS.includes(ASSISTANT_ID);
          const DROPDOWN_ITEM = {
            content: `${assistant.name}`,
            selected: IS_SELECTED,
            ...assistant,
          };
          this.state.assistants.push(DROPDOWN_ITEM);
          if (IS_SELECTED) {
            this.state.assistantsSelected.push(DROPDOWN_ITEM);
          }
        }
      }
    }
  }

  isShowBrowserDataEnabled() {
    let retVal = false;
    if (window.innerWidth > 1479) {
      retVal = true;
    }
    return retVal;
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleConversationRowClick(conversation: any = undefined) {
    const NAVIGATION: any = {};
    let id;
    try {
      id = conversation?.value?.conversationId;
      NAVIGATION.path = '(convInsights:main-view/conversations-view-v1/transcript-view-v1)';
      NAVIGATION.extras = { queryParams: { id } };
      this.wbcLocationService.navigateToPathByEnvironmentServiceV1(NAVIGATION.path, NAVIGATION.extras);
    } catch (error) {
      _errorX(ConversationsViewV1.getClassName(), 'handleConversationRowClick', { error });
      throw error;
    }
  }

  handleShowBrowserEvent(event: any) {
    _debugX(ConversationsViewV1.getClassName(), `handleShowBrowserEvent`, { event });
    this.tableConfig.showBrowserData = event;
    const TABLE_CONFIG = lodash.cloneDeep(this.tableConfig)
    this.tableConfig = TABLE_CONFIG;
  }

  handleSearchConversationClearEvent(event: any) {
    _debugX(ConversationsViewV1.getClassName(), `handleSearchConversationClearEvent`, { event });
    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchConversationEvent(event: any) {
    _debugX(ConversationsViewV1.getClassName(), `handleSearchConversationEvent`, { event });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleDateRangeChange(range: any) {
    this.filterData.dateRange = range;
    _debugX(ConversationsViewV1.getClassName(), `handleDateRangeChange`, { range });
  }

  showDeleteConversationModal(conversationIds: any) {
    _debugX(ConversationsViewV1.getClassName(), `showDeleteConversationModal`, { conversationIds });
    this.conversationDeleteModalV1.show(conversationIds);
  }

  handleFilterPanelOpenEvent() {
    this.filterConfig.isVisible = !this.filterConfig.isVisible;
  }

  handleFilterChange() {
    const FILTER = {};
    FILTER[QueryServiceV1.FILTER_KEY.DATE_RANGE] = this.filterData.dateRange;
    FILTER[QueryServiceV1.FILTER_KEY.IS_REVIEWED_VISIBLE] = this.getCheckboxValue(this.filterData.checkboxes, QueryServiceV1.FILTER_KEY.IS_REVIEWED_VISIBLE);
    FILTER[QueryServiceV1.FILTER_KEY.IS_ZERO_DURATION_VISIBLE] = this.getCheckboxValue(this.filterData.checkboxes, QueryServiceV1.FILTER_KEY.IS_ZERO_DURATION_VISIBLE);
    FILTER[QueryServiceV1.FILTER_KEY.IS_NO_USER_INTERACTION_VISIBLE] = this.getCheckboxValue(this.filterData.checkboxes, QueryServiceV1.FILTER_KEY.IS_NO_USER_INTERACTION_VISIBLE);
    FILTER[QueryServiceV1.FILTER_KEY.ASSISTANT_IDS] = this.getSelectedComboboxValues(this.filterData.comboboxes, QueryServiceV1.FILTER_KEY.ASSISTANT_IDS);
    // [2023-11-28] jevgenij.golobokin removing unused filtering
    // FILTER[QueryServiceV1.FILTER_KEY.CHANNELS] = this.getSelectedComboboxValues(this.filterData.comboboxes, QueryServiceV1.FILTER_KEY.CHANNELS);
    // FILTER[QueryServiceV1.FILTER_KEY.TOTAL_MESSAGES] = { from: this.filterData.numberRangeFrom, to: this.filterData.numberRangeTo };
    // FILTER[QueryServiceV1.FILTER_KEY.USER_ENTRIES] = this.getSliderValue(this.filterData.slider, QueryServiceV1.FILTER_KEY.USER_ENTRIES);
    // FILTER[QueryServiceV1.FILTER_KEY.AVG_CONFIDENCE] = this.getSliderValue(this.filterData.slider, QueryServiceV1.FILTER_KEY.AVG_CONFIDENCE);
    this.queryService.setFilterItems(this.state.queryType, FILTER);
    this.setFilterIcon();

    _debugX(ConversationsViewV1.getClassName(), `handleFilterChange`, { this_filterData: this.filterData, FILTER });
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleFilterReset() {
    this.filterData = lodash.cloneDeep(this.filterDataCopy);
    _debugX(ConversationsViewV1.getClassName(), `handleFilterReset`, { this_filterData: this.filterData });
  }

  initFilter(query: any) {
    this.filterData.dateRange = query?.filter?.dateRange;
    this.filterData.numberRangeFrom
    this._constructCheckboxes();
    this._constructSliderData();
    this._getChannels();
  }

  setFilterIcon() {
    const IS_EQUAL = lodash.isEqual(this.filterData, this.filterDataCopy);
    this.tableConfig.filterIcon = IS_EQUAL ? 'assets/carbon-icons/16/operations/filter.svg' : 'assets/carbon-icons/16/operations/filter--edit.svg';
    const TABLE_CONFIG = lodash.cloneDeep(this.tableConfig);
    this.tableConfig = TABLE_CONFIG;
  }

  _getChannels() {
    const PARAMS = {
      key: 'channel',
    };
    _debugX(ConversationsViewV1.getClassName(), 'saveTags', { PARAMS });
    this.conversationService
      .getChannels(PARAMS)
      .pipe(
        catchError((error: any) => {
          const NOTIFICATION = CONVERSATIONS_MESSAGES.ERROR.CHANNELS;
          _errorX(ConversationsViewV1.getClassName(), '_getChannels', { error });
          this.notificationService.showNotification(NOTIFICATION);
          this.state.isLoading = false;
          return of();
        })
      )
      .subscribe((response: any) => {
        const CHANNELS = response;
        const QUERY = this.queryService.query(this.state.queryType);
        const SELECTED_CHANNELS = ramda.pathOr([], ['filter', 'channels'], QUERY);
        for (const channel of CHANNELS) {
          const IS_SELECTED = SELECTED_CHANNELS.includes(channel);
          const DROPDOWN_ITEM = {
            selected: IS_SELECTED,
            content: channel,
            id: QueryServiceV1.FILTER_KEY.CHANNELS,
          };
          this.state.channels.push(DROPDOWN_ITEM);
          if (IS_SELECTED) this.state.selectedChannels.push(DROPDOWN_ITEM);
        }
        this._constructComboboxes();
        this.filterDataCopy = lodash.cloneDeep(this.filterData);
        this.filterConfig.isLoading = false;
        _debugX(ConversationsViewV1.getClassName(), '_getChannels', { response });
      });
  }

  getSelectedComboboxValues(comboboxes: ComboboxItem[], key: string): string[] {
    const RET_VAL = [];
    const VALUES = comboboxes?.find((combobox) => combobox.id === key)?.value;
    if (lodash.isArray(VALUES) && !lodash.isEmpty(VALUES)) {
      for (const value of VALUES) {
        if (!lodash.isEmpty(value) && value.selected) {
          RET_VAL.push(value.content);
        }
      }
    }
    _debugX(ConversationsViewV1.getClassName(), `getSelectedComboboxValues`, { RET_VAL });
    return RET_VAL;
  }

  getCheckboxValue(checkbox: CheckboxItem[], key: string): boolean {
    let retVal = false;
    const CHECKBOX = checkbox.find((el) => el.id === key);
    if (!lodash.isEmpty(CHECKBOX)) {
      retVal = CHECKBOX.checked;
    }
    return retVal;
  }

  getSliderValue(slider: SliderItem[], key: string): number {
    let retVal;
    const SLIDER = slider.find((el) => el.id === key);
    if (!lodash.isEmpty(SLIDER)) {
      retVal = SLIDER.value;
    }
    return retVal;
  }

  _constructCheckboxes(): void {
    const CHECKBOXES: CheckboxItem[] = [];
    CHECKBOXES.push({
      id: QueryServiceV1.FILTER_KEY.IS_REVIEWED_VISIBLE,
      checked: this.state.isReviewedVisible,
      value: QueryServiceV1.FILTER_KEY.IS_REVIEWED_VISIBLE,
      text: this.translateService.instant('conversations_view_v1.filter_fld_reviewed.text'),
    });
    CHECKBOXES.push({
      id: QueryServiceV1.FILTER_KEY.IS_ZERO_DURATION_VISIBLE,
      checked: this.state.isZeroDurationVisible,
      value: QueryServiceV1.FILTER_KEY.IS_ZERO_DURATION_VISIBLE,
      text: this.translateService.instant('conversations_view_v1.filter_fld_zero_duration.text'),
    });
    CHECKBOXES.push({
      id: QueryServiceV1.FILTER_KEY.IS_NO_USER_INTERACTION_VISIBLE,
      checked: this.state.isNoUserInteractionVisible,
      value: QueryServiceV1.FILTER_KEY.IS_NO_USER_INTERACTION_VISIBLE,
      text: this.translateService.instant('conversations_view_v1.filter_fld_no_user_interaction.text'),
    });
    this.filterData.checkboxes = CHECKBOXES;
  }

  _constructComboboxes(): void {
    const COMBOBOXES: ComboboxItem[] = [];
    COMBOBOXES.push({
      id: QueryServiceV1.FILTER_KEY.ASSISTANT_IDS,
      placeholder: this.translateService.instant('conversations_view_v1.filter_fld_assistants.placeholder'),
      label: this.translateService.instant('conversations_view_v1.filter_fld_assistants.label'),
      items: this.state.assistants,
      value: this.state.assistantsSelected,
      type: 'multi',
    });
    // [2023-11-28] jevgenij.golobokin removing unused filtering
    // COMBOBOXES.push({
    //   id: QueryServiceV1.FILTER_KEY.CHANNELS,
    //   placeholder: this.translateService.instant('conversations_view_v1.filter_fld_channel.placeholder'),
    //   label: this.translateService.instant('conversations_view_v1.filter_fld_channel.label'),
    //   items: this.state.channels,
    //   value: this.state.selectedChannels,
    //   type: 'multi',
    // });
    this.filterData.comboboxes = COMBOBOXES;
  }

  _constructSliderData(): void {
    const SLIDER_DATA: SliderItem[] = [];
    // [2023-11-28] jevgenij.golobokin removing unused filtering
    // SLIDER_DATA.push({
    //   id: QueryServiceV1.FILTER_KEY.USER_ENTRIES,
    //   label: this.translateService.instant('conversations_view_v1.filter_fld_user_entries.label'),
    //   max: 50,
    //   step: 1,
    //   value: 0,
    //   maxLabel: 50,
    // });
    // SLIDER_DATA.push({
    //   id: QueryServiceV1.FILTER_KEY.AVG_CONFIDENCE,
    //   label: this.translateService.instant('conversations_view_v1.filter_fld_avg_confidence.label'),
    //   max: 1,
    //   step: 0.01,
    //   value: 0,
    //   maxLabel: 1,
    // });
    this.filterData.slider = SLIDER_DATA;
  }
}
