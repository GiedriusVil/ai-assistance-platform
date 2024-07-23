/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import * as ramda from 'ramda';

import {
  DEFAULT_TABLE,
  OUTLETS,
} from 'client-utils';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  BaseView
} from 'client-shared-views';

import {
  TopicModelingDeleteModalV1,
  TopicModelingExecuteModalV1,
  TopicModelingResultsModalV1,
  TopicModelingSaveModalV1
} from 'client-components';

@Component({
  selector: 'aiap-topic-modeling-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class TopicModelingViewV1 extends BaseView implements OnInit, AfterViewInit {

  static getClassName() {
    return 'TopicModelingViewV1';
  }

  @ViewChild('aiapTopicModelingSaveModal') topicModelingSaveModal: TopicModelingSaveModalV1;
  @ViewChild('aiapTopicModelingDeleteModal') topicModelingDeleteModal: TopicModelingDeleteModalV1;
  @ViewChild('aiapTopicModelingExecuteModal') topicModelingExecuteModal: TopicModelingExecuteModalV1;
  @ViewChild('aiapTopicModelingResultModal') topicModelingResultsModal: TopicModelingResultsModalV1;


  outlet = OUTLETS.topicModeling;

  state: any = {
    queryType: DEFAULT_TABLE.TOPIC_MODELING.TYPE,
    defaultSort: DEFAULT_TABLE.TOPIC_MODELING.SORT,
    search: '',
  };

  constructor(
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
  ) {
    super();
  }


  ngOnInit() {
    //
  }

  ngAfterViewInit() {
    //
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  handleShowSaveModal(event: any = undefined): void {
    _debugX(TopicModelingViewV1.getClassName(), `handleShowSavePlaceEvent`, { event });
    this.topicModelingSaveModal.show(event?.value?.id);
  }

  handleShowRemovePlaceEvent(event: any = undefined): void {
    _debugX(TopicModelingViewV1.getClassName(), `handleShowRemovePlaceEvent`, { event });
    this.topicModelingDeleteModal.show(event);
  }

  handleShowExecuteModal(event: any = undefined): void {
    _debugX(TopicModelingViewV1.getClassName(), `handleShowExecuteModal`, { event });
    this.topicModelingExecuteModal.show(event);
  }
  handleShowResulteModal(event: any = undefined): void {
    _debugX(TopicModelingViewV1.getClassName(), `handleShowResulteModal`, { event });
    this.topicModelingResultsModal.show(event);
  }

  handleSearchClearEvent(event: any) {
    _debugX(TopicModelingViewV1.getClassName(), `handleSearchClearEvent`, { event });
    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchChangeEvent(event: any) {
    _debugX(TopicModelingViewV1.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }
}
