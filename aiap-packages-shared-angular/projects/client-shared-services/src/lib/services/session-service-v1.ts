/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import {
  CookieService,
} from 'ngx-cookie-service';

import jwt_decode from 'jwt-decode';

import moment from 'moment';
import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

const LOCAL_STORAGE_KEY = {
  TOKEN: 'token',
  SESSION: 'session',
  SESSION_PERMISSIONS: 'session_permissions',
  TOKEN_EXPIRATION: 'token_expires_at'
};

const COOKIE_STORAGE_KEY = {
  TOKEN: 'aiap_token',
}

@Injectable({
  providedIn: 'root',
})
export class SessionServiceV1 {

  static getClassName() {
    return 'SessionServiceV1';
  }

  public sessionEmitter: Subject<any> = new Subject<any>();

  constructor(
    private cookieService: CookieService,
  ) { }

  getAuthHeaders() {
    const TOKEN = this.getToken();
    const RET_VAL = {
      headers: { ['Authorization']: `Bearer ${TOKEN}` }
    };
    return RET_VAL;
  }

  setSession(authResult: any) {
    try {
      this.setToken(authResult?.token);
      sessionStorage.setItem(LOCAL_STORAGE_KEY.TOKEN, authResult?.token);
      sessionStorage.setItem(LOCAL_STORAGE_KEY.TOKEN_EXPIRATION, authResult?.expiresAt);
      const SESSION = authResult?.session;
      sessionStorage.setItem(LOCAL_STORAGE_KEY.SESSION, JSON.stringify(SESSION));
      const SESSION_PERMISSIONS = this.readSessionPermissions(SESSION);
      _debugX(SessionServiceV1.getClassName(), 'setSession',
        {
          SESSION,
          SESSION_PERMISSIONS,
        });
      sessionStorage.setItem(LOCAL_STORAGE_KEY.SESSION_PERMISSIONS, JSON.stringify(SESSION_PERMISSIONS));
      this.sessionEmitter.next(SESSION);
    } catch (error) {
      _errorX(SessionServiceV1.getClassName(), 'setSession',
        {
          error,
        });

      throw error;
    }
  }

  setToken(token: any) {
    try {
      _debugX(SessionServiceV1.getClassName(), 'setToken',
        {
          this_cookieService: this.cookieService,
        });

      sessionStorage.setItem(LOCAL_STORAGE_KEY.TOKEN, token);
      if (
        this.cookieService
      ) {
        this.cookieService.set(COOKIE_STORAGE_KEY.TOKEN, token);
      }
    } catch (error: any) {
      _errorX(SessionServiceV1.getClassName(), 'setToken',
        {
          error,
        });

      throw error;
    }
  }

  getSession() {
    const SESSION_AS_STRING: any = sessionStorage.getItem(LOCAL_STORAGE_KEY.SESSION);
    let retVal;
    try {
      retVal = JSON.parse(SESSION_AS_STRING);
    } catch (error) {
      _errorX(SessionServiceV1.getClassName(), 'getSession',
        {
          error,
        });
    }
    return retVal;
  }

  hasSession() {
    let retVal = false;
    if (
      !lodash.isEmpty(this.getSession())
    ) {
      retVal = true;
    }
    return retVal;
  }

  clearSession() {
    this.clearToken();
    sessionStorage.removeItem(LOCAL_STORAGE_KEY.TOKEN);
    sessionStorage.removeItem(LOCAL_STORAGE_KEY.TOKEN_EXPIRATION);
    sessionStorage.removeItem(LOCAL_STORAGE_KEY.SESSION);
    sessionStorage.removeItem(LOCAL_STORAGE_KEY.SESSION_PERMISSIONS);
  }

  getUser() {
    try {
      const token = this.getToken();
      const RET_VAL = jwt_decode(token);
      RET_VAL.session = this.getSession();
      return RET_VAL;
    } catch (error) {
      _errorX(SessionServiceV1.getClassName(), 'getUser',
        {
          error,
        });
    }
  }

  clearToken() {
    try {
      _debugX(SessionServiceV1.getClassName(), 'clearToken',
        {
          this_cookieService: this.cookieService,
        });

      sessionStorage.removeItem(LOCAL_STORAGE_KEY.TOKEN);
      if (
        this.cookieService
      ) {
        this.cookieService.delete(COOKIE_STORAGE_KEY.TOKEN);
      }
    } catch (error) {
      _errorX(SessionServiceV1.getClassName(), 'clearToken',
        {
          error,
        });

      throw error;
    }
  }

  getToken() {
    const TOKEN = sessionStorage.getItem(LOCAL_STORAGE_KEY.TOKEN);
    if (!TOKEN) this.clearSession();
    return TOKEN;
  }

  getExpiration() {
    const expiration = sessionStorage.getItem(LOCAL_STORAGE_KEY.TOKEN_EXPIRATION);
    if (!expiration) this.clearSession();
    return moment(expiration);
  }

  isSessionActive() {
    const EXPIRATION = this.getExpiration();
    return moment(new Date().toISOString()).isBefore(EXPIRATION);
  }

  getAccessGroup() {
    const USER: any = this.getUser();
    const RET_VAL = USER?.session?.accessGroup;
    return RET_VAL;
  }

  getTenant() {
    const USER = this.getUser();
    const RET_VAL = USER?.session?.tenant;
    return RET_VAL;
  }

  getApplication() {
    const TENANT = this.getTenant();
    if (
      TENANT != null
    ) {
      return TENANT.application;
    }
    return null;
  }

  getAssistants() {
    const SESSION_TENANT = this.getTenant();
    const SESSION_ACCESS_GROUP = this.getAccessGroup();
    const RET_VAL = [];

    if (lodash.isEmpty(SESSION_TENANT)) {
      return RET_VAL;
    }

    const TENANTS = SESSION_ACCESS_GROUP?.tenants?.filter((tenant: any) => {
      return tenant && tenant.id === SESSION_TENANT.id;
    });

    const APPLICATIONS = TENANTS?.map((tenant: any) => tenant?.applications);

    APPLICATIONS?.forEach((application: any) => {
      application?.forEach((item: any) => {
        if (item?.assistants?.length > 0) {
          RET_VAL.push(...item.assistants);
        }
      });
    });

    return RET_VAL;
  }

  getAssistantsByAccessGroup() {
    const SESSION_TENANT = this.getTenant();
    const SESSION_ACCESS_GROUP = this.getAccessGroup();
    const RET_VAL = [];

    if (lodash.isEmpty(SESSION_TENANT)) {
      return RET_VAL;
    }

    const TENANTS = SESSION_ACCESS_GROUP?.tenants?.filter((tenant: any) => {
      return tenant && tenant.id === SESSION_TENANT.id;
    });

    const APPLICATIONS = TENANTS?.map((tenant: any) => tenant?.applications);

    APPLICATIONS?.forEach((application: any) => {
      application?.forEach((item: any) => {
        if (item?.assistants?.length > 0) {
          RET_VAL.push(...item.assistants);
        }
      });
    });

    return RET_VAL;
  }

  getAssistantsByTenant() {
    const SESSION_TENANT = this.getTenant();
    const RET_VAL = [];
    if (lodash.isEmpty(SESSION_TENANT)) {
      return RET_VAL;
    }

    const ASSISTANTS = SESSION_TENANT.assistants;
    if (ASSISTANTS.length > 0) {
      ASSISTANTS?.forEach((assistant: any) => {
        RET_VAL.push(assistant);
      });
    }

    return RET_VAL;
  }

  getWbcApplications() {
    const SESSION_TENANT = this.getTenant();
    const SESSION_ACCESS_GROUP = this.getAccessGroup();
    const RET_VAL = [];
    if (
      SESSION_ACCESS_GROUP?.tenants?.length > 0
    ) {
      for (const TENANT of SESSION_ACCESS_GROUP.tenants) {
        if (
          TENANT &&
          SESSION_TENANT &&
          TENANT.id === SESSION_TENANT.id &&
          TENANT.applications?.length > 0
        ) {
          RET_VAL.push(...TENANT.applications);
        }
      }
    }
    return RET_VAL;
  }

  // POSSIBLE FOR DEPRECATION
  getViews() {
    const SESSION_TENANT = this.getTenant();
    const SESSION_ACCESS_GROUP = this.getAccessGroup();
    const RET_VAL = [];
    if (
      SESSION_ACCESS_GROUP?.tenants?.length > 0
    ) {
      for (const TENANT of SESSION_ACCESS_GROUP.tenants) {
        if (
          TENANT &&
          SESSION_TENANT &&
          TENANT.id === SESSION_TENANT.id &&
          TENANT.views?.length > 0
        ) {
          RET_VAL.push(...TENANT.views);
        }
      }
    }
    return RET_VAL;
  }

  getSessionPermissions() {
    let sessionPermissionsAsString: any;
    let retVal;
    try {
      sessionPermissionsAsString = sessionStorage.getItem(LOCAL_STORAGE_KEY.SESSION_PERMISSIONS);
      retVal = JSON.parse(sessionPermissionsAsString);
    } catch (error) {
      _errorX(SessionServiceV1.getClassName(), 'getSessionPermissions',
        {
          error,
        });
    }
    return retVal;
  }

  _isViewAllowedPartialMatch(view: string) {
    const PERMISSIONS = this.getSessionPermissions();
    const RET_VAL = Object.keys(PERMISSIONS?.allowedViews)?.some(allowedView => view === allowedView.replace(/V\d+$/, ''))
    
    return RET_VAL;
  }

  _isViewAllowedExactMatch(view: string) {
    const PERMISSIONS = this.getSessionPermissions();
    const RET_VAL = !lodash.isEmpty(PERMISSIONS?.allowedViews?.[view]);
    
    return RET_VAL;
  }
  
  isViewAllowed(view: string) {
    let retVal = false;

    if (lodash.isEmpty(view)) {
      return retVal;
    }

    if (view.match(/V\d+$/)) {
      const WITHOUT_VERSION = view.replace(/V\d+$/, '');
      retVal = this._isViewAllowedExactMatch(view) || this._isViewAllowedExactMatch(WITHOUT_VERSION);
    } else {
      retVal = this._isViewAllowedPartialMatch(view);
    }

    return retVal;
  }

  isActionAllowed(params: any) {
    let retVal = false;
    const ACTION = params?.action;
    const TENANT_ID = params?.tenantId;
    const APPLICATION_ID = params?.applicationId;
    const ASSISTANT_ID = params?.assistantId;
    const PERMISSIONS: any = {};
    if (
      (
        TENANT_ID ||
        APPLICATION_ID ||
        ASSISTANT_ID
      ) &&
      ACTION
    ) {

      this.getPermissions(PERMISSIONS, params);
      if (
        PERMISSIONS &&
        PERMISSIONS.allowedActions &&
        !lodash.isEmpty(PERMISSIONS.allowedActions[ACTION])
      ) {
        retVal = true;
      }
    } else if (
      ACTION
    ) {
      const PERMISSIONS = this.getSessionPermissions();
      if (
        PERMISSIONS &&
        PERMISSIONS.allowedActions &&
        !lodash.isEmpty(PERMISSIONS.allowedActions[ACTION])
      ) {
        retVal = true;
      }
    }
    return retVal;
  }

  /** Determines the visibility of common actions */
  areActionsAllowed(actions: string[]): boolean {
    let retVal = false;
    const PERMISSIONS = this.getSessionPermissions();
    if (
      actions &&
      actions.length > 0 &&
      PERMISSIONS &&
      PERMISSIONS.allowedActions
    ) {
      retVal = actions.some(allowedAction => {
        const ALLOWED_ACTION_FOUND = PERMISSIONS.allowedActions[allowedAction]?.enabled;
        return ALLOWED_ACTION_FOUND;
      });
    }
    return retVal;
  }

  isActionAllowedByApplication(action: any, applicationId: any) {
    let retVal = false;
    const PERMISSIONS = this.getSessionPermissions();
    if (
      action &&
      PERMISSIONS &&
      PERMISSIONS.allowedActions &&
      PERMISSIONS.allowedActions[action] &&
      !lodash.isEmpty(PERMISSIONS.allowedActions[action][applicationId])
    ) {
      retVal = true;
    }
    return retVal;
  }

  isActionAllowedByAssistant(action: any, assistantId: any) {
    let retVal = false;
    const PERMISSIONS = this.getSessionPermissions();
    if (
      action &&
      PERMISSIONS &&
      PERMISSIONS.allowedActions &&
      PERMISSIONS.allowedActions[action] &&
      !lodash.isEmpty(PERMISSIONS.allowedActions[action][assistantId])
    ) {
      retVal = true;
    }
    return retVal;
  }

  private readSessionPermissions(session: any) {
    const RET_VAL: any = {};
    this._addPlatformPolicyAllowedViewsAndActions(RET_VAL, session);
    this._addTenantPolicyAllowedViewsAndActions(RET_VAL, session);
    return RET_VAL;
  }

  private _mergeViewIntoSessionPermissions(permissions: any, view: any) {
    let viewComponent;
    let viewActions;
    try {
      if (
        !permissions?.allowedViews
      ) {
        permissions.allowedViews = {};
      }
      if (
        !permissions?.allowedActions
      ) {
        permissions.allowedActions = {};
      }

      viewComponent = view?.component;
      viewActions = view?.actions;

      if (
        !lodash.isEmpty(viewComponent)
      ) {
        permissions.allowedViews[viewComponent] = { enabled: true }
      }
      if (
        !lodash.isEmpty(viewActions) &&
        lodash.isArray(viewActions)
      ) {
        for (const ACTION of viewActions) {
          const ACTION_COMPONENT = ACTION?.component;
          if (
            !lodash.isEmpty(ACTION_COMPONENT)
          ) {
            permissions.allowedActions[ACTION_COMPONENT] = { enabled: true }
          }
        }
      }
    } catch (error) {
      _errorX(SessionServiceV1.getClassName(), '_mergeViewIntoSessionPermissions',
        {
          error,
        });

      throw error;
    }
  }

  private _mergeViewsIntoSessionPermissions(permissions: any, views: any) {
    if (
      permissions &&
      !lodash.isEmpty(views) &&
      lodash.isArray(views)
    ) {
      for (const VIEW of views) {
        this._mergeViewIntoSessionPermissions(permissions, VIEW);
      }
    }
  }

  private _addPlatformPolicyAllowedViewsAndActions(permissions: any, session: any) {
    let sessionAccessGroupsViews;
    try {
      sessionAccessGroupsViews = session?.accessGroup?.views;
      this._mergeViewsIntoSessionPermissions(permissions, sessionAccessGroupsViews);
      _debugX(SessionServiceV1.getClassName(), '_addPlatformPolicyAllowedViewsAndActions',
        {
          permissions,
          session,
        });

    } catch (error) {
      _errorX(SessionServiceV1.getClassName(), '_addPlatformPolicyAllowedViewsAndActions',
        {
          error,
        });

      throw error;
    }
  }

  private _addTenantPolicyAllowedViewsAndActions(permissions: any, session: any) {
    let sessionTenantId: any;
    let sessionAccessGroupTenants: any;
    let sessionAccessGroupTenant: any;
    let sessionAccessGroupTenantApplications: any;
    try {
      sessionTenantId = session?.tenant?.id;
      sessionAccessGroupTenants = session?.accessGroup?.tenants;
      if (
        !lodash.isEmpty(sessionAccessGroupTenants) &&
        lodash.isArray(sessionAccessGroupTenants)
      ) {
        sessionAccessGroupTenant = sessionAccessGroupTenants.find((item: any) => item?.id && item?.id === sessionTenantId);
      }
      sessionAccessGroupTenantApplications = sessionAccessGroupTenant?.applications;
      if (
        !lodash.isEmpty(sessionAccessGroupTenantApplications) &&
        lodash.isArray(sessionAccessGroupTenantApplications)
      ) {
        for (const APPLICATION of sessionAccessGroupTenantApplications) {
          const APPLICATION_VIEWS = lodash.isArray(APPLICATION?.views) ? APPLICATION?.views : [];
          this._mergeViewsIntoSessionPermissions(permissions, APPLICATION_VIEWS);
          const APPLICATION_ASSISTANTS = lodash.isArray(APPLICATION?.assistants) ? APPLICATION?.assistants : [];
          for (const ASSISTANT of APPLICATION_ASSISTANTS) {
            const ASSISTANT_VIEWS = ASSISTANT?.views;
            this._mergeViewsIntoSessionPermissions(permissions, ASSISTANT_VIEWS);
          }
        }
      }
      _debugX(SessionServiceV1.getClassName(), '_addTenantPolicyAllowedViewsAndActions',
        {
          permissions,
          session,
          sessionTenantId,
          sessionAccessGroupTenants,
          sessionAccessGroupTenant,
        });
    } catch (error) {
      _errorX(SessionServiceV1.getClassName(), '_addTenantPolicyAllowedPagesAndActions',
        {
          error,
        });

      throw error;
    }
  }

  private retrieveTenants(tenantId) {
    let retVal = [];
    try {
      const SESSION = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_KEY.SESSION));
      const SESSION_ACCESS_GROUP_TENANTS = SESSION?.accessGroup?.tenants;
      if (
        !lodash.isEmpty(SESSION_ACCESS_GROUP_TENANTS) &&
        lodash.isArray(SESSION_ACCESS_GROUP_TENANTS)
      ) {
        if (!lodash.isEmpty(tenantId)) {
          const PASSED_TENANT = SESSION_ACCESS_GROUP_TENANTS.find((item: any) => item?.id && item?.id === tenantId);
          if (!lodash.isEmpty(PASSED_TENANT)) {
            retVal.push(PASSED_TENANT);
          }
        } else {
          retVal = SESSION_ACCESS_GROUP_TENANTS;
        }
      }
      return retVal;
    } catch (error) {
      _errorX(SessionServiceV1.getClassName(), 'retrieveTenants',
        {
          error,
        });

      throw error;
    }
  }

  private retrieveApplications(tenantsToIterate, applicationId) {
    const RET_VAL = []
    if (
      !lodash.isEmpty(tenantsToIterate) &&
      lodash.isArray(tenantsToIterate)
    ) {
      for (const TENANT of tenantsToIterate) {
        const APPLICATIONS_FROM_TENANT = TENANT?.applications;
        if (
          !lodash.isEmpty(applicationId)
        ) {
          const PASSED_APPLICATION = APPLICATIONS_FROM_TENANT.find((item: any) => item?.id && item?.id === applicationId);
          if (
            !lodash.isEmpty(PASSED_APPLICATION)
          ) {
            RET_VAL.push(PASSED_APPLICATION);
          }
        } else {
          for (const APPLICATION of APPLICATIONS_FROM_TENANT) {
            RET_VAL.push(APPLICATION);
          }
        }
      }
    }
    return RET_VAL;
  }

  private retrieveAssistants(applicationsToIterate, assistantId) {
    const RET_VAL = [];
    if (
      !lodash.isEmpty(applicationsToIterate) &&
      lodash.isArray(applicationsToIterate)
    ) {
      for (const APPLICATION of applicationsToIterate) {
        const ASSISTANTS_FROM_APPLICATION = APPLICATION?.assistants;
        if (
          !lodash.isEmpty(assistantId)
        ) {
          const PASSED_ASSISTANT = ASSISTANTS_FROM_APPLICATION.find((item: any) => item?.id && item?.id === assistantId);
          if (
            !lodash.isEmpty(PASSED_ASSISTANT)
          ) {
            RET_VAL.push(PASSED_ASSISTANT);
          }
        } else {
          for (const ASSISTANT of ASSISTANTS_FROM_APPLICATION) {
            RET_VAL.push(ASSISTANT);
          }
        }
      }
    }
    return RET_VAL;
  }

  getPermissions(permissions, params) {
    const TENANT_ID = params?.tenantId;
    const APPLICATION_ID = params?.applicationId;
    const ASSISTANT_ID = params?.assistantId;
    try {
      const TENANTS_TO_ITERATE = this.retrieveTenants(TENANT_ID);
      const APPLICATIONS_TO_ITERATE = this.retrieveApplications(TENANTS_TO_ITERATE, APPLICATION_ID);
      const ASSISTANTS_TO_ITERATE = this.retrieveAssistants(APPLICATIONS_TO_ITERATE, ASSISTANT_ID);
      if (
        !lodash.isEmpty(TENANTS_TO_ITERATE) &&
        lodash.isArray(TENANTS_TO_ITERATE)
      ) {
        for (const TENANT of TENANTS_TO_ITERATE) {
          if (
            !lodash.isEmpty(APPLICATIONS_TO_ITERATE) &&
            lodash.isArray(APPLICATIONS_TO_ITERATE)
          ) {
            for (const APPLICATION of APPLICATIONS_TO_ITERATE) {
              const APPLICATIONS_VIEWS = APPLICATION?.views;
              this._mergeViewsIntoSessionPermissions(permissions, APPLICATIONS_VIEWS);
              if (
                !lodash.isEmpty(ASSISTANTS_TO_ITERATE) &&
                lodash.isArray(ASSISTANTS_TO_ITERATE)
              ) {
                for (const ASSISTANT of ASSISTANTS_TO_ITERATE) {
                  const ASSISTANT_VIEWS = ASSISTANT?.views;
                  this._mergeViewsIntoSessionPermissions(permissions, ASSISTANT_VIEWS);
                }
              }
            }
          }
        }
      }
      _debugX(SessionServiceV1.getClassName(), 'getPermissions',
        {
          permissions,
          TENANTS_TO_ITERATE,
          APPLICATIONS_TO_ITERATE,
          ASSISTANTS_TO_ITERATE,
        });
    } catch (error) {
      _errorX(SessionServiceV1.getClassName(), 'getPermissions',
        {
          error,
        });
      throw error;
    }
  }

  getTimeZone() {
    const USER = this.getUser();
    const RET_VAL = USER?.timezone;

    return RET_VAL;
  }
}
