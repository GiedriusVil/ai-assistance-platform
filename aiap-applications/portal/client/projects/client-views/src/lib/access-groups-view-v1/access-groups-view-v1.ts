/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';

import {
  BaseView
} from 'client-shared-views';

import {
  _debugX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
} from 'client-shared-services';

import {
  defaultQuery
} from '../utils/table.utils';


import { DEFAULT_TABLE, offset } from '../utils/constants-utils';
import {
  AccessGroupDeleteModalV1,
} from './access-group-delete-modal-v1/access-group-delete-modal-v1';
import {
  AccessGroupImportModalV1,
} from './access-group-import-modal-v1/access-group-import-modal-v1';
import {
  AccessGroupSaveModalV1,
} from './access-group-save-modal-v1/access-group-save-modal-v1';

@Component({
  selector: 'aiap-access-groups-view-v1',
  templateUrl: './access-groups-view-v1.html',
  styleUrls: ['./access-groups-view-v1.scss']
})
export class AccessGroupsViewV1 extends BaseView implements OnInit, OnDestroy {

  static getClassName() {
    return 'AccessGroupsViewV1';
  }

  @ViewChild('accessGroupDeleteModal') accessGroupDeleteModal: AccessGroupDeleteModalV1;
  @ViewChild('accessGroupSaveModal') accessGroupSaveModal: AccessGroupSaveModalV1;
  @ViewChild('accessGroupImportModal') accessGroupImportModal: AccessGroupImportModalV1;

  @ViewChild('actionsOverFlowTemplate', { static: true }) actionsOverFlowTemplate: TemplateRef<any>;

  private isActionsClickAllowed = false;

  itemsPerPageOptions: number[] = DEFAULT_TABLE.PAGE.ITEMS_PER_PAGE_OPTIONS;

  offset = offset;
  skeletonState = false;

  private query = defaultQuery();

  constructor(
    private eventsService: EventsServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    this.eventsService.filterEmit(this.query);
  }

  ngOnDestroy(): void {
    this.superNgOnDestroy();
  }

  handleShowSaveModal(accessGroup: any = undefined) {
    _debugX(AccessGroupsViewV1.getClassName(), `handleShowSaveModal`,
      {
        accessGroup,
      });

    const ACCESS_GROUP_ID = accessGroup?.value?.id;

    const COPY_VALUE = {
      created: accessGroup?.value?.created,
      name: accessGroup?.value?.name,
      description: accessGroup?.value?.description,
      tenants: accessGroup?.value?.tenants,
      updated: accessGroup?.value?.updated,
      views: accessGroup?.value?.views,
    }
    _debugX(AccessGroupsViewV1.getClassName(), 'showAccessGroupSaveView',
      {
        ACCESS_GROUP_ID,
        COPY_VALUE,
      });

    this.accessGroupSaveModal.show(ACCESS_GROUP_ID, COPY_VALUE);
  }

  showAccessGroupDeleteModal(group: any) {
    _debugX(AccessGroupsViewV1.getClassName(), `showAccessGroupDeleteModal`,
      {
        group,
      });

    this.accessGroupDeleteModal.show(group);
  }

  handleShowImportModal(event: any) {
    _debugX(AccessGroupsViewV1.getClassName(), `handleShowImportModal`,
      {
        event,
      });

    this.accessGroupImportModal.show();
  }

  _allowActionsClick(event: any) {
    this.isActionsClickAllowed = true;
  }

  static route() {
    return {
      path: 'access-groups',
      component: AccessGroupsViewV1,
      data: {
        name: 'access_groups_view_v1.name',
        breadcrumb: 'access_groups_view_v1.breadcrumb',
        description: 'access_groups_view_v1.description',
        component: AccessGroupsViewV1.getClassName(),
        requiresApplicationPolicy: true,
        actions: [
          {
            name: 'access_groups_view_v1.actions.add.name',
            component: 'access-groups.view.add',
            description: 'access_groups_view_v1.actions.add.description',
          },
          {
            name: 'access_groups_view_v1.actions.edit.name',
            component: 'access-groups.view.edit',
            description: 'access_groups_view_v1.actions.edit.description',
          },
          {
            name: 'access_groups_view_v1.actions.copy.name',
            component: 'access-groups.view.copy',
            description: 'access_groups_view_v1.actions.copy.description',
          },
          {
            name: 'access_groups_view_v1.actions.delete.name',
            component: 'access-groups.view.delete',
            description: 'access_groups_view_v1.actions.delete.description',
          },
          {
            name: 'access_groups_view_v1.actions.export.name',
            component: 'access-groups.view.export',
            description: 'access_groups_view_v1.actions.export.description',
          },
          {
            name: 'access_groups_view_v1.actions.import.name',
            component: 'access-groups.view.import',
            description: 'access_groups_view_v1.actions.import.description',
          }
        ]
      }
    };
  }

}
