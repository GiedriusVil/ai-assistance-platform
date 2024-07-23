/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';

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
  ClassifierModelDeleteModal,
  ClassifierModelSaveModal,
  ClassifierModelTestModal,
  ClassifierModelTrainModal,
  ClassifierModelImportModal
} from '.';

@Component({
  selector: 'aca-classifier-models-view',
  templateUrl: './classifier-models-view-v1.html',
  styleUrls: ['./classifier-models-view-v1.scss']
})
export class ClassifierModelsView extends BaseView implements OnInit, AfterViewInit {

  static getClassName() {
    return 'ClassifierModelsView';
  }

  @ViewChild('classifierModelDeleteModal') classifierModelDeleteModal: ClassifierModelDeleteModal;
  @ViewChild('classifierModelSaveModal') classifierModelSaveModal: ClassifierModelSaveModal;
  @ViewChild('classifierModelTestModal') classifierModelTestModal: ClassifierModelTestModal;
  @ViewChild('classifierModelTrainModal') classifierModelTrainModal: ClassifierModelTrainModal;
  @ViewChild('classifierModelImportModal') classifierModelImportModal: ClassifierModelImportModal;

  outlet = OUTLETS.tenantCustomizer;

  state: any = {
    queryType: DEFAULT_TABLE.CLASSIFIER.TYPE,
    defaultSort: DEFAULT_TABLE.CLASSIFIER.SORT,
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

  handleShowSavePlaceEvent(event: any = undefined): void {
    _debugX(ClassifierModelsView.getClassName(), `handleShowSavePlaceEvent`,
      {
        event,
      });

    this.classifierModelSaveModal.show(event?.value?.id);
  }

  handleShowTestPlaceEvent(model: any) {
    _debugX(ClassifierModelsView.getClassName(), `handleShowTestPlaceEvent`,
      {
        model,
      });

    this.classifierModelTestModal.show(model);
  }

  handleShowTrainPlaceEvent(model: any) {
    _debugX(ClassifierModelsView.getClassName(), `handleShowTrainPlaceEvent`,
      {
        model,
      });

    this.classifierModelTrainModal.show(model);
  }

  handleShowRemovePlaceEvent(event: any = undefined): void {
    _debugX(ClassifierModelsView.getClassName(), `handleShowRemovePlaceEvent`,
      {
        event,
      });

    this.classifierModelDeleteModal.show(event);
  }

  handleSearchClearEvent(event: any) {
    _debugX(ClassifierModelsView.getClassName(), `handleSearchClearEvent`,
      {
        event,
      });

    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchChangeEvent(event: any) {
    _debugX(ClassifierModelsView.getClassName(), `handleSearchChangeEvent`,
      {
        event,
      });

    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleShowImportQueue(event: any) {
    _debugX(ClassifierModelsView.getClassName(), `handleShowImportQueue`,
      {
        event,
      });

    this.classifierModelImportModal.show();
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'classifier-models',
      children: [
        ...children,
        {
          path: '',
          component: ClassifierModelsView,
          data: {
            breadcrumb: 'classification_models_view_v1.breadcrumb',
            component: ClassifierModelsView.getClassName(),
            actions: []
          }
        }
      ],
      data: {
        breadcrumb: 'classification_models_view_v1.breadcrumb',
      }
    };
    return RET_VAL;
  }
}
