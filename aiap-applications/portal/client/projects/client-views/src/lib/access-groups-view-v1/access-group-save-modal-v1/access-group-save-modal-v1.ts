/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  NotificationService
} from 'client-shared-carbon';

import {
  _debugX, _errorX,
} from 'client-shared-utils';

import {
  ACCESS_GROUPS_MESSAGES,
} from 'client-utils';

import {
  BaseModal,
} from 'client-shared-views';

import {
  EventsServiceV1,
} from 'client-shared-services';

import {
  AccessGroupsServiceV1,
} from 'client-services';

import {
  createAccessGroupPayload,
  mergePlatformPolicyToAccessGroup,
  mergeTenantPolicyToAccessGroup,
  mergeApplicationPolicyToAccessGroup,
  sortPlatformPolicySummary,
  sortTenantPolicySummary,
} from '../../utils/access-group.utils';

@Component({
  selector: 'aiap-access-group-save-modal-v1',
  templateUrl: './access-group-save-modal-v1.html',
  styleUrls: ['./access-group-save-modal-v1.scss']
})
export class AccessGroupSaveModalV1 extends BaseModal implements OnInit, OnDestroy {

  static getClassName() {
    return 'AccessGroupSaveModalV1';
  }

  state = {
    modalVal: undefined
  };

  _value = {
    id: undefined,
    externalId: undefined,
    name: undefined,
    description: undefined,
    views: [],
    tenants: [],
  };
  value: any = lodash.cloneDeep(this._value);

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private accessGroupsService: AccessGroupsServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    this.superNgOnInit(this.eventsService);
  }

  ngOnDestroy(): void {
    this.superNgOnDestroy();
  }

  show(id: any, copyValue: any) {
    _debugX(AccessGroupSaveModalV1.getClassName(), 'show',
      {
        id,
      });

    this.value.id = id;
    this.loadValue(copyValue);
  }


  loadValue(copyValue: any) {
    _debugX(AccessGroupSaveModalV1.getClassName(), 'loadValue',
      {
        this_value_id: this.value?.id,
        copyValue: copyValue,
      });

    this.eventsService.loadingEmit(true);
    this.accessGroupsService.findOneById(this.value?.id)
      .pipe(
        catchError((error) => this.handleFindeOneByIdError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(AccessGroupSaveModalV1.getClassName(), 'loadValue',
          {
            response
          });

        if (
          !lodash.isEmpty(copyValue)
        ) {
          this.value = {
            id: undefined,
            name: copyValue?.name,
            description: copyValue?.description,
            tenants: copyValue?.tenants,
            updated: copyValue?.updated,
            views: copyValue?.views
          }
          this.state.modalVal = false;
        }
        if (!lodash.isEmpty(response)) {
          this.state.modalVal = true;
          this.value = response;
          this._refreshAccessGroupTenants();
        }
        if (lodash.isEmpty(this.value.id) && lodash.isNil(copyValue?.name)) {
          this.state.modalVal = true;
          this.value = lodash.cloneDeep(this._value);
        }
        this.superShow();
        this.eventsService.loadingEmit(false);
      });
  }

  save() {
    const ACCESS_GROUP_PAYLOAD = createAccessGroupPayload(this.value);
    this.eventsService.loadingEmit(true);
    this.accessGroupsService.saveOne(ACCESS_GROUP_PAYLOAD).pipe(
      catchError((error) => this.handleSaveAccessGroupError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      this.eventsService.loadingEmit(false);
      const NOTIFICATION = {
        type: 'success',
        title: 'Access group was saved',
        target: '.notification-container',
        duration: 10000
      }
      this.notificationService.showNotification(NOTIFICATION);
      this.eventsService.loadingEmit(false);
      this.eventsService.filterEmit(undefined);
      this.close();
    });
  }

  private _refreshAccessGroupTenants() {
    //
  }

  close() {
    super.close();
  }

  private handleSaveAccessGroupError(error) {
    _errorX(AccessGroupSaveModalV1.getClassName(), 'handleFindeOneByIdError',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    const NOTIFICATION = lodash.cloneDeep(ACCESS_GROUPS_MESSAGES.ERROR.SAVE_ONE);
    const ERROR = ramda.path(['error', '0', 'ACA_ERROR'], error);
    if (
      ERROR?.type === 'VALIDATION_ERROR'
    ) {
      NOTIFICATION.message = NOTIFICATION.message.concat(' ', ERROR.message);
    }

    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  private handleFindeOneByIdError(error) {
    _errorX(AccessGroupSaveModalV1.getClassName(), 'handleFindeOneByIdError', { error });
    this.eventsService.loadingEmit(false);
    const NOTIFICATION = ACCESS_GROUPS_MESSAGES.ERROR.FIND_ONE_BY_ID;
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

  handleAddTenantPolicyEvent(policy: any): void {
    _debugX(
      AccessGroupSaveModalV1.getClassName(), 'handleAddTenantPolicyEvent | beforeMerge',
      {
        policy: policy,
        this_value: lodash.cloneDeep(this.value)
      }
    );
    mergeTenantPolicyToAccessGroup(this.value, lodash.cloneDeep(policy));
    _debugX(
      AccessGroupSaveModalV1.getClassName(), 'handleAddTenantPolicyEvent | afterMerge',
      {
        policy: policy,
        this_value: lodash.cloneDeep(this.value)
      }
    );
    sortTenantPolicySummary(this.value);
    _debugX(
      AccessGroupSaveModalV1.getClassName(), 'handleAddTenantPolicyEvent | finalResult',
      {
        policy: policy,
        this_value: lodash.cloneDeep(this.value)
      }
    );
  }

  handleAddApplicationPolicyEvent(policy: any): void {
    _debugX(AccessGroupSaveModalV1.getClassName(), this.handleAddApplicationPolicyEvent.name,
      {
        policy: policy,
        this_value: this.value,
      });

    mergeApplicationPolicyToAccessGroup(this.value, lodash.cloneDeep(policy));
    sortTenantPolicySummary(this.value);
  }

  handlePlatformPolicyAddEvent(policy: any): void {
    _debugX(AccessGroupSaveModalV1.getClassName(), 'handlePlatformPolicyAddEvent -> beforeMerge',
      {
        this_value: lodash.cloneDeep(this.value)
      }
    );

    mergePlatformPolicyToAccessGroup(this.value, lodash.cloneDeep(policy));
    _debugX(AccessGroupSaveModalV1.getClassName(), 'handleAddApplicationPolicy -> afterMerge',
      {
        this_value: lodash.cloneDeep(this.value)
      }
    );

    sortPlatformPolicySummary(this.value);
    _debugX(AccessGroupSaveModalV1.getClassName(), 'handleAddApplicationPolicy -> finalResult',
      {
        this_value: lodash.cloneDeep(this.value)
      }
    );
  }

  handleTenantPolicyItemRemoveEvent(event): void {
    _debugX(AccessGroupSaveModalV1.getClassName(), 'handleTenantPolicyItemRemoveEvent',
      {
        event,
      });
    const TENANT_ID = event?.tenant?.id;
    const APPLICATION_ID = event?.application?.id;
    const ASSISTANT_ID = event?.assistant?.id;
    const VIEW_COMPONENT = event?.view?.component;
    const ACTION_COMPONENT = event?.action?.component;
    const TENANTS = this.value.tenants;

    if (TENANT_ID) {
      if (
        VIEW_COMPONENT &&
        ACTION_COMPONENT &&
        ASSISTANT_ID
      ) {
        this.deleteTenantApplicationAssistantViewAction(TENANTS, TENANT_ID, ASSISTANT_ID, VIEW_COMPONENT, ACTION_COMPONENT, APPLICATION_ID);
      } else if (
        VIEW_COMPONENT &&
        ASSISTANT_ID
      ) {
        this.deleteTenantApplicationAssistantView(TENANTS, TENANT_ID, ASSISTANT_ID, VIEW_COMPONENT, APPLICATION_ID);
      } else if (
        VIEW_COMPONENT &&
        ACTION_COMPONENT
      ) {
        this.deleteTenantApplicationViewAction(TENANTS, TENANT_ID, VIEW_COMPONENT, ACTION_COMPONENT, APPLICATION_ID);
      } else if (
        VIEW_COMPONENT
      ) {
        this.deleteTenantApplicationView(TENANTS, TENANT_ID, VIEW_COMPONENT, APPLICATION_ID);
      } else {
        this.deleteTenant(TENANTS, TENANT_ID, APPLICATION_ID);
      }
    } else {
      _debugX(AccessGroupSaveModalV1.getClassName(), 'handleTenantPolicyItemRemoveEvent',
        {
          this_value: this.value,
        });
      if (
        VIEW_COMPONENT &&
        ACTION_COMPONENT &&
        ASSISTANT_ID
      ) {
        this.deleteTenantlessApplicationAssistantViewAction(TENANTS, ASSISTANT_ID, VIEW_COMPONENT, ACTION_COMPONENT, APPLICATION_ID);
      } else if (
        VIEW_COMPONENT &&
        ASSISTANT_ID
      ) {
        this.deleteTenantlessApplicationAssistantView(TENANTS, ASSISTANT_ID, VIEW_COMPONENT, APPLICATION_ID);
      } else if (
        VIEW_COMPONENT &&
        ACTION_COMPONENT
      ) {
        this.deleteTenantlessApplicationViewAction(TENANTS, VIEW_COMPONENT, ACTION_COMPONENT, APPLICATION_ID);
      } else if (
        VIEW_COMPONENT
      ) {
        this.deleteTenantlessApplicationView(TENANTS, VIEW_COMPONENT, APPLICATION_ID);
      } else {
        this.deleteTenant(TENANTS, TENANT_ID, APPLICATION_ID);
      }
    }
  }

  handlePlatformPolicyItemRemoveEvent(event: any): void {
    _debugX(AccessGroupSaveModalV1.getClassName(), 'handlePlatformPolicyItemRemoveEvent',
      {
        event,
      });

    const VIEWS = this.value.views;
    const VIEW_COMPONENT = event?.view?.component;
    const ACTION_COMPONENT = event?.action?.component;
    if (
      VIEW_COMPONENT &&
      ACTION_COMPONENT
    ) {
      this.deletePlatformViewAction(VIEWS, VIEW_COMPONENT, ACTION_COMPONENT);
    } else if (VIEW_COMPONENT) {
      this.deletePlatformView(VIEWS, VIEW_COMPONENT);
    } else {
      const NOTIFICATION = {
        type: 'error',
        title: 'Access Group',
        message: 'Unable to delete application summary item',
        target: '.notification-container',
        duration: 10000
      };
      this.notificationService.showNotification(NOTIFICATION);
    }
  }

  private deleteTenant(tenants: any, tenantId: string, applicationId: string): void {
    _debugX(AccessGroupSaveModalV1.getClassName(), this.deleteTenant.name,
      {
        tenants,
        tenantId,
        applicationId,
      });

    const TENANT_INDEX = tenants.findIndex(tenant => tenant.id === tenantId);
    if (
      TENANT_INDEX > -1
    ) {
      const APPLICATION_INDEX = tenants[TENANT_INDEX].applications.findIndex(application => application.id === applicationId);
      if (
        APPLICATION_INDEX > -1
      ) {
        tenants[TENANT_INDEX].applications.splice(APPLICATION_INDEX, 1);
      }
    } else {
      tenants = [];
    }
  }

  private deleteTenantApplicationView(tenants: any[], tenantId: string, viewComponent: string, applicationId: string): void {
    _debugX(AccessGroupSaveModalV1.getClassName(), this.deleteTenantApplicationView.name,
      {
        tenants,
        tenantId,
        viewComponent,
        applicationId,
      });

    const TENANT_INDEX = tenants?.findIndex(tenant => tenant.id === tenantId);
    if (
      TENANT_INDEX > -1
    ) {
      const APPLICATION_INDEX = tenants[TENANT_INDEX]?.applications?.findIndex(application => application.id === applicationId);
      if (
        APPLICATION_INDEX > -1
      ) {
        const VIEW_INDEX = tenants[TENANT_INDEX]?.applications[APPLICATION_INDEX]?.views?.findIndex(view => view.component === viewComponent);
        if (
          VIEW_INDEX > -1
        ) {
          tenants[TENANT_INDEX]?.applications[APPLICATION_INDEX]?.views?.splice(VIEW_INDEX, 1);
        }
      }
    }
  }

  private deleteTenantlessApplicationView(tenants: any[], viewComponent: string, applicationId: string): void {
    _debugX(AccessGroupSaveModalV1.getClassName(), this.deleteTenantlessApplicationView.name,
      {
        tenants,
        viewComponent,
        applicationId,
      });

    for (const TENANT of tenants) {
      const APPLICATION_INDEX = TENANT?.applications?.findIndex(application => application.id === applicationId);
      if (
        APPLICATION_INDEX > -1
      ) {
        const VIEW_INDEX = TENANT?.applications[APPLICATION_INDEX]?.views?.findIndex(view => view.component === viewComponent);
        if (
          VIEW_INDEX > -1
        ) {
          TENANT?.applications[APPLICATION_INDEX]?.views?.splice(VIEW_INDEX, 1);
        }
      }
    }
  }

  private deleteTenantApplicationViewAction(tenants: any[], tenantId: string, viewComponent: string, actionComponent: string, applicationId: string): void {
    _debugX(AccessGroupSaveModalV1.getClassName(), this.deleteTenantApplicationViewAction.name,
      {
        tenants,
        tenantId,
        viewComponent,
        actionComponent,
        applicationId,
      });

    const TENANT_INDEX = tenants?.findIndex(tenant => tenant.id === tenantId);
    if (
      TENANT_INDEX > -1
    ) {
      const APPLICATION_INDEX = tenants[TENANT_INDEX]?.applications?.findIndex(application => application.id === applicationId);

      if (
        APPLICATION_INDEX > -1
      ) {
        const VIEW_INDEX = tenants[TENANT_INDEX]?.applications[APPLICATION_INDEX]?.views?.findIndex(view => view.component === viewComponent);

        if (
          VIEW_INDEX > -1
        ) {
          const ACTION_INDEX = tenants[TENANT_INDEX]?.applications[APPLICATION_INDEX]?.views[VIEW_INDEX]?.actions?.findIndex(action => action.component === actionComponent);
          if (
            ACTION_INDEX > -1
          ) {
            tenants[TENANT_INDEX]?.applications[APPLICATION_INDEX]?.views[VIEW_INDEX]?.actions?.splice(ACTION_INDEX, 1);
          }
        }
      }
    }
  }

  private deleteTenantlessApplicationViewAction(tenants: any[], viewComponent: string, actionComponent: string, applicationId: string): void {
    _debugX(AccessGroupSaveModalV1.getClassName(), this.deleteTenantlessApplicationViewAction.name,
      {
        tenants,
        viewComponent,
        actionComponent,
        applicationId,
      });

    for (const TENANT of tenants) {
      const APPLICATION_INDEX = TENANT?.applications?.findIndex(application => application.id === applicationId);

      if (
        APPLICATION_INDEX > -1
      ) {
        const VIEW_INDEX = TENANT?.applications[APPLICATION_INDEX]?.views?.findIndex(view => view.component === viewComponent);
        if (
          VIEW_INDEX > -1
        ) {
          const ACTION_INDEX = TENANT?.applications[APPLICATION_INDEX]?.views[VIEW_INDEX]?.actions?.findIndex(action => action.component === actionComponent);
          if (
            ACTION_INDEX > -1
          ) {
            TENANT?.applications[APPLICATION_INDEX]?.views[VIEW_INDEX]?.actions?.splice(ACTION_INDEX, 1);
          }
        }
      }
    }
  }

  private deleteTenantApplicationAssistantView(tenants: any[], tenantId: string, assistantId: string, viewComponent: string, applicationId: string): void {
    _debugX(AccessGroupSaveModalV1.getClassName(), this.deleteTenantApplicationAssistantView.name,
      {
        tenants,
        tenantId,
        viewComponent,
        applicationId,
      });

    const TENANT_INDEX = tenants?.findIndex(tenant => tenant.id === tenantId);
    if (
      TENANT_INDEX > -1
    ) {
      const APPLICATIONS = tenants[TENANT_INDEX]?.applications;
      const APPLICATION_INDEX = APPLICATIONS?.findIndex(application => application.id === applicationId);
      if (
        APPLICATION_INDEX > -1
      ) {
        const ASSISTANTS = APPLICATIONS[APPLICATION_INDEX]?.assistants;
        const ASSISTANT_INDEX = ASSISTANTS?.findIndex(assistant => assistant.id === assistantId);
        if (
          ASSISTANT_INDEX > -1
        ) {
          const VIEWS = ASSISTANTS[ASSISTANT_INDEX]?.views;
          const VIEW_INDEX = VIEWS?.findIndex(view => view.component === viewComponent);
          if (
            VIEW_INDEX > -1
          ) {
            VIEWS?.splice(VIEW_INDEX, 1);
          }
        }
      }
    }
  }

  private deleteTenantlessApplicationAssistantView(tenants: any[], assistantId: string, viewComponent: string, applicationId: string): void {
    _debugX(AccessGroupSaveModalV1.getClassName(), this.deleteTenantlessApplicationAssistantView.name,
      {
        tenants,
        viewComponent,
        applicationId,
      });

    for (const TENANT of tenants) {
      const APPLICATIONS = TENANT?.applications;
      const APPLICATION_INDEX = APPLICATIONS?.findIndex(application => application.id === applicationId);
      if (
        APPLICATION_INDEX > -1
      ) {
        const ASSISTANTS = APPLICATIONS[APPLICATION_INDEX]?.assistants;
        const ASSISTANT_INDEX = ASSISTANTS?.findIndex(assistant => assistant.id === assistantId);

        if (
          ASSISTANT_INDEX > -1
        ) {
          const VIEWS = ASSISTANTS[ASSISTANT_INDEX]?.views;
          const VIEW_INDEX = VIEWS?.findIndex(view => view.component === viewComponent);
          if (
            VIEW_INDEX > -1
          ) {
            VIEWS?.splice(VIEW_INDEX, 1);
          }
        }
      }
    }
  }

  private deleteTenantApplicationAssistantViewAction(tenants: any[], tenantId: string, assistantId: string, viewComponent: string, actionComponent: string, applicationId: string): void {
    _debugX(AccessGroupSaveModalV1.getClassName(), this.deleteTenantApplicationAssistantViewAction.name,
      {
        tenants,
        tenantId,
        viewComponent,
        actionComponent,
        applicationId,
      });

    const TENANT_INDEX = tenants?.findIndex(tenant => tenant.id === tenantId);
    if (
      TENANT_INDEX > -1
    ) {
      const APPLICATIONS = tenants[TENANT_INDEX]?.applications;
      const APPLICATION_INDEX = APPLICATIONS?.findIndex(application => application.id === applicationId);
      if (
        APPLICATION_INDEX > -1
      ) {
        const ASSISTANTS = APPLICATIONS[APPLICATION_INDEX]?.assistants;
        const ASSISTANT_INDEX = ASSISTANTS?.findIndex(assistant => assistant.id === assistantId);
        if (
          ASSISTANT_INDEX > -1
        ) {
          const VIEWS = ASSISTANTS[ASSISTANT_INDEX]?.views;
          const VIEW_INDEX = VIEWS?.findIndex(view => view.component === viewComponent);
          if (
            VIEW_INDEX > -1
          ) {
            const ACTIONS = VIEWS[VIEW_INDEX]?.actions;
            const ACTION_INDEX = ACTIONS?.findIndex(action => action.component === actionComponent);
            if (
              ACTION_INDEX > -1
            ) {
              ACTIONS?.splice(ACTION_INDEX, 1);
            }
          }
        }
      }
    }
  }

  private deleteTenantlessApplicationAssistantViewAction(tenants: any[], assistantId: string, viewComponent: string, actionComponent: string, applicationId: string): void {
    _debugX(AccessGroupSaveModalV1.getClassName(), this.deleteTenantlessApplicationAssistantViewAction.name,
      {
        tenants,
        viewComponent,
        actionComponent,
        applicationId,
      });

    for (const TENANT of tenants) {
      const APPLICATIONS = TENANT?.applications;
      const APPLICATION_INDEX = APPLICATIONS?.findIndex(application => application.id === applicationId);
      if (
        APPLICATION_INDEX > -1
      ) {
        const ASSISTANTS = APPLICATIONS[APPLICATION_INDEX]?.assistants;
        const ASSISTANT_INDEX = ASSISTANTS?.findIndex(assistant => assistant.id === assistantId);
        if (
          ASSISTANT_INDEX > -1
        ) {
          const VIEWS = ASSISTANTS[ASSISTANT_INDEX]?.views;
          const VIEW_INDEX = VIEWS?.findIndex(view => view.component === viewComponent);
          if (
            VIEW_INDEX > -1
          ) {
            const ACTIONS = VIEWS[VIEW_INDEX]?.actions;
            const ACTION_INDEX = ACTIONS?.findIndex(action => action.component === actionComponent);
            if (
              ACTION_INDEX > -1
            ) {
              ACTIONS?.splice(ACTION_INDEX, 1);
            }
          }
        }
      }
    }
  }

  private deletePlatformView(views: any, viewComponent: string): void {
    _debugX(AccessGroupSaveModalV1.getClassName(), this.deletePlatformView.name,
      {
        views,
        viewComponent,
      });

    const VIEW_INDEX = views.findIndex(view => view.component === viewComponent);
    if (
      VIEW_INDEX > -1
    ) {
      views.splice(VIEW_INDEX, 1);
    }
  }

  private deletePlatformViewAction(views: any, viewComponent: string, actionComponent: string): void {
    _debugX(AccessGroupSaveModalV1.getClassName(), this.deletePlatformViewAction.name,
      {
        views,
        viewComponent,
        actionComponent,
      });
    const VIEW_INDEX = views?.findIndex(view => view.component === viewComponent);
    if (
      VIEW_INDEX > -1
    ) {
      const ACTION_INDEX = views[VIEW_INDEX]?.actions?.findIndex(action => action.component === actionComponent);
      if (
        ACTION_INDEX > -1
      ) {
        views[VIEW_INDEX]?.actions?.splice(ACTION_INDEX, 1);
      }
    }
  }
}
