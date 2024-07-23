/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  BaseView
} from 'client-shared-views';

import {
  ApplicationDeleteModalV1,
  ApplicationImportModalV1,
  ApplicationSaveModalV1,
} from '.';

@Component({
  selector: 'aiap-applications-view-v1',
  templateUrl: './applications-view-v1.html',
  styleUrls: ['./applications-view-v1.scss'],
})
export class ApplicationsViewV1 extends BaseView implements OnInit, OnDestroy {

  static getClassName() {
    return 'ApplicationsViewV1';
  }

  @ViewChild('applicationSaveModal') applicationSaveModal: ApplicationSaveModalV1;
  @ViewChild('applicationDeleteModal') applicationDeleteModal: ApplicationDeleteModalV1;
  @ViewChild('applicationImportModal') applicationImportModal: ApplicationImportModalV1;

  @ViewChild('overflowMenuItemTemplate', { static: true }) overflowMenuItemTemplate: TemplateRef<any>;

  state: any = {
    queryType: DEFAULT_TABLE.APPLICATIONS.TYPE,
    defaultSort: DEFAULT_TABLE.APPLICATIONS.SORT
  };
  constructor(
    private queryService: QueryServiceV1,
    private eventsService: EventsServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    //
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  handleApplicationSaveModal(application: any = undefined): void {
    _debugX(ApplicationsViewV1.getClassName(), `handleShowSaveModal`,
      {
        application,
      });

    const APPLICATION_ID = application?.value?.id;
    this.applicationSaveModal.show(APPLICATION_ID);
  }

  handleSearchClearEvent(event: any) {
    _debugX(ApplicationsViewV1.getClassName(), `handleSearchClearEvent`,
      {
        event,
      });

    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleApplicationDeleteModal(applicationsIds: any = undefined): void {
    _debugX(ApplicationsViewV1.getClassName(), `handleShowDeleteModal`,
      {
        applicationsIds,
      });

    this.applicationDeleteModal.show(applicationsIds);
  }

  handleShowImportModal(event: any) {
    _debugX(ApplicationsViewV1.getClassName(), `handleShowImportModal`,
      {
        event,
      });

    this.applicationImportModal.show();
  }

  handleSearchChangeEvent(event: any) {
    _debugX(ApplicationsViewV1.getClassName(), `handleSearchChangeEvent`,
      {
        event,
      });

    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  static route() {
    const RET_VAL = {
      path: 'applications',
      component: ApplicationsViewV1,
      data: {
        name: 'applications_view_v1.name',
        breadcrumb: 'applications_view_v1.breadcrumb',
        description: 'applications_view_v1.description',
        component: ApplicationsViewV1.getClassName(),
        requiresApplicationPolicy: true,
        actions: [
          {
            name: 'applications_view_v1.actions.add.name',
            component: 'applications.view.add',
            description: 'applications_view_v1.actions.add.description',
          },
          {
            name: 'applications_view_v1.actions.edit.name',
            component: 'applications.view.edit',
            description: 'applications_view_v1.actions.edit.description',
          },
          {
            name: 'applications_view_v1.actions.delete.name',
            component: 'applications.view.delete',
            description: 'applications_view_v1.actions.delete.description',
          },
          {
            name: 'applications_view_v1.actions.export.name',
            component: 'applications.view.export',
            description: 'applications_view_v1.actions.export.description',
          },
          {
            name: 'applications_view_v1.actions.import.name',
            component: 'applications.view.import',
            description: 'applications_view_v1.actions.import.description',
          }
        ]
      }
    };
    return RET_VAL
  }

}
