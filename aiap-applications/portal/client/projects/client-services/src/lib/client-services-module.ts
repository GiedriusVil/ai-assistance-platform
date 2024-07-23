/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, ModuleWithProviders } from '@angular/core';

import { ClientUtilsModule } from 'client-utils';

import {
  EnvironmentServiceV1,
} from 'client-shared-services';

import {
  LoginServiceV1,
  ConnectionsServiceV1,
} from './services';

import { AccessGroupsChangesServiceV1 } from './services/access-groups-changes-service-v1';
import { AccessGroupsServiceV1 } from './services/access-groups-service-v1';

import { ApplicationsChangesServiceV1 } from './services/applications-changes-service-v1';
import { ApplicationsServiceV1 } from './services/applications-service-v1';

import { AssistantsChangesServiceV1 } from './services/assistants-changes-service-v1';

import { ClientSideDownloadServiceV1 } from './services/client-side-download-service-v1';

import { DataExportServiceV1 } from './services/data-export-service-v1';

import { TenantsChangesServiceV1 } from './services/tenants-changes-service-v1';
import { TenantsServiceV1 } from './services/tenants-service-v1';

import { UsersChangesServiceV1 } from './services/users-changes-service-v1';
import { UsersServiceV1 } from './services/users-service-v1';

@NgModule({
  imports: [
    ClientUtilsModule
  ]
})
export class ClientServicesModule {
  static forRoot(environment: any): ModuleWithProviders<ClientServicesModule> {
    return {
      ngModule: ClientServicesModule,
      providers: [
        {
          provide: EnvironmentServiceV1,
          useValue: new EnvironmentServiceV1(environment)
        },
        LoginServiceV1,
        ConnectionsServiceV1,
        //
        AccessGroupsChangesServiceV1,
        AccessGroupsServiceV1,
        ApplicationsChangesServiceV1,
        ApplicationsServiceV1,
        AssistantsChangesServiceV1,
        ClientSideDownloadServiceV1,
        DataExportServiceV1,
        TenantsChangesServiceV1,
        TenantsServiceV1,
        UsersChangesServiceV1,
        UsersServiceV1,
      ]
    };
  }
}
