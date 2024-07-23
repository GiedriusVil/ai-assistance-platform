/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import * as ramda from '@ibm-aca/aca-wrapper-ramda';

const ACCESS_GROUP_ADMIN_TENANT_NAME = '-';
const ACCESS_GROUP_ADMIN_APPLICATION_NAME = 'Admin';
const ACCESS_GROUP_USER_SELECTED_TENANTS = '*User selected tenants*';

const _formatAccessGroups = (
  accessGroups: any,
) => {
  const RET_VAL = accessGroups.map((ag: any) => (
    {
      name: ag.name,
      tenants: [
        {
          name: ACCESS_GROUP_ADMIN_TENANT_NAME,
          applications: [
            {
              name: ACCESS_GROUP_ADMIN_APPLICATION_NAME,
              views: ag.views.map(view => (
                {
                  name: view.name,
                  actions: view.actions.map(action => action.name)
                }
              )),
            }
          ].filter(app => app.views.length > 0),
        },
        ...ag.tenants.map(t => (
          {
            name: t.name || ACCESS_GROUP_USER_SELECTED_TENANTS,
            applications: t.applications.map(app => (
              {
                name: app.name,
                views: app.views.map(view => (
                  {
                    name: view.name,
                    actions: view.actions.map(action => action.name)
                  }
                ))
              }
            )).filter(app => app.views.length > 0),
          }
        ))
      ].filter(t => t.applications.length > 0)
    }
  )).filter(ag => ag.tenants.length > 0);

  return RET_VAL;
}

const _unwindAccessGroups = (
  accessGroups: any,
) => {
  const RET_VAL = accessGroups.flatMap(ag => {
    ag.tenants = ag.tenants.flatMap(tenant => {
      tenant.applications = tenant.applications.flatMap(application => {
        application.views = application.views.flatMap(view => {
          if (view.actions.length === 0) {
            return {
              ...view,
              actions: '',
            }
          }
          return ramda.unwind('actions', view)
        })
        return ramda.unwind('views', application);
      })
      return ramda.unwind('applications', tenant);
    })
    return ramda.unwind('tenants', ag);
  });

  return RET_VAL;
}

const _translate = (
  key: any,
  translations: any,
) => {
  const RET_VAL = key.split(' ').filter(k => k).map(k => translations[k] ?? `Translation not found for key '${k}'`).join(' ');
  return RET_VAL;
}

const transformAccessGroups = (
  accessGroups: any,
  translations: any,
) => {
  const FORMATTED_ACCESS_GROUPS = _formatAccessGroups(accessGroups);
  const ACCESS_GROUPS_UNWINDED = _unwindAccessGroups(FORMATTED_ACCESS_GROUPS);

  const RET_VAL = ACCESS_GROUPS_UNWINDED.map(ag => ({
    accessGroup: ag.name,
    tenant: ag.tenants.name,
    application: ag.tenants.applications.name,
    view: _translate(ag.tenants.applications.views.name, translations),
    action: _translate(ag.tenants.applications.views.actions, translations),
  }));

  return RET_VAL;
}

export {
  transformAccessGroups,
}
