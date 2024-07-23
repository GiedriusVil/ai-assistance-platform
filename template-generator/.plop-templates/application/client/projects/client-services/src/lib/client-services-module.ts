/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, ModuleWithProviders } from '@angular/core';

import { ClientUtilsModule } from 'aca-client-shared';

import { EnvironmentServiceV1 } from 'client-shared-services';

@NgModule({
  imports: [ClientUtilsModule]
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
      ]
    };
  }
}
