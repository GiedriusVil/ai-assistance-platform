/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, ModuleWithProviders } from '@angular/core';


/**
 * Required types and utils
 */
import {
  ClientSharedUtilsModule,
} from 'client-shared-utils';

import {
  ClientSharedServicesModule,
  EnvironmentServiceV1,
} from 'client-shared-services';

import {
  ClientUtilsModule,
} from 'client-utils';

/**
 * Exported services
 */
import {
  LoginService,
  TestCasesService,
  TestWorkersService,
  TestExecutionsService,
} from './services';

@NgModule({
  declarations: [],
  imports: [
    ClientSharedUtilsModule,
    ClientSharedServicesModule,
    ClientUtilsModule,
  ],
  exports: []
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
        LoginService,
        TestCasesService,
        TestWorkersService,
        TestExecutionsService,
      ]
    };
  }

}
