/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


import {
  BaseView
} from 'client-shared-views';

import {
  _debugX,
} from 'client-shared-utils';

import { ConfirmModalComponent } from 'client-shared-components';

import {
  TenantDeleteModalV1,
  TenantSaveModalV1,
  TenantsImportModalV1,
} from '.';

@Component({
  selector: 'aiap-tenants-view-v1',
  templateUrl: './tenants-view-v1.html',
  styleUrls: ['./tenants-view-v1.scss'],
})
export class TenantsViewV1 extends BaseView implements OnInit, OnDestroy {

  static getClassName() {
    return 'TenantsViewV1';
  }

  @ViewChild('overflowMenuItemTemplate', { static: true }) overflowMenuItemTemplate: TemplateRef<any>;

  @ViewChild('tenantSaveModal') tenantSaveModal: TenantSaveModalV1;
  @ViewChild('tenantDeleteModal') tenantDeleteModal: TenantDeleteModalV1;

  @ViewChild('tenantsImportModal') tenantsImportModal: TenantsImportModalV1;

  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;

  page: number;

  constructor(
    private activatedRouter: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    this.subscribeToQueryParams();
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  subscribeToQueryParams() {
    this.activatedRouter.queryParams
      .subscribe((params: any) => {
        _debugX(TenantsViewV1.getClassName(), 'subscribeToQueryParams',
          {
            params,
          });

        if (
          params.page
        ) {
          this.page = Number(params.page);
        }
      });
  }

  handleTenantSaveView(tableData: any = undefined): void {
    const TENANT_ID = tableData?.value?.id;
    _debugX(TenantsViewV1.getClassName(), 'handleTenantSaveView',
      {
        TENANT_ID
      });

    this.tenantSaveModal.show(TENANT_ID);
  }

  handleTenantDeleteModal(tenant) {
    this.tenantDeleteModal.show(tenant);
  }

  handleShowImportModal(event: any) {
    _debugX(TenantsViewV1.getClassName(), `handleShowImportModal`,
      {
        event,
      });

    this.tenantsImportModal.showImportModal();
  }

  static route(children: Array<any>) {
    const RET_VAL = {
      path: 'tenants',
      children: [
        ...children,
        {
          path: '',
          component: TenantsViewV1,
          data: {
            name: 'tenants_view_v1.name',
            description: 'tenants_view_v1.description',
            component: TenantsViewV1.getClassName(),
            requiresApplicationPolicy: true,
            actions: [
              {
                name: 'tenants_view_v1.actions.add.name',
                component: 'tenants.view.add',
                description: 'tenants_view_v1.actions.add.description',
              },
              {
                name: 'tenants_view_v1.actions.edit.name',
                component: 'tenants.view.edit',
                description: 'tenants_view_v1.actions.edit.description',
              },
              {
                name: 'tenants_view_v1.actions.delete.name',
                component: 'tenants.view.delete',
                description: 'tenants_view_v1.actions.delete.description',
              },
              {
                name: 'tenants_view_v1.actions.export.name',
                component: 'tenants.view.export',
                description: 'tenants_view_v1.actions.export.description',
              },
              {
                name: 'tenants_view_v1.actions.import.name',
                component: 'tenants.view.import',
                description: 'tenants_view_v1.actions.import.description',
              }
            ]
          }
        },
      ],
      data: {
        breadcrumb: 'tenants_view_v1.breadcrumb',
      }
    }
    return RET_VAL;
  }

}
