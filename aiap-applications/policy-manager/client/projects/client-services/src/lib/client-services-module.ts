/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule, ModuleWithProviders } from '@angular/core';
// SHAREABLE_MODULES_IMPORT
import { ClientUtilsModule } from 'client-utils';
import { CarbonFrameworkModule } from './carbon-framework.module';
// SERVICES
import {
  ConfigurationService,
  ClientSideDownloadService,
  DataExportService,

  RequestService,
  CommentsService,
  UsersService,

  TransactionsService,
} from './services';

import {
  EnvironmentServiceV1,
} from 'client-shared-services';


import {
  BuyRulesConditionsService,
  BuyRulesChangesService,
  BuyRulesExternalSuppliersService,
  BuyRulesService,
  BuyRulesSuppliersService,
  CatalogRulesCatalogsService,
  CatalogRulesChangesService,
  CatalogRulesConditionsService,
  CatalogRulesExternalCatalogsService,
  CatalogRulesService,
  ClassificationRulesChangesService,
  ClassificationRulesClassificationsExternalService,
  ClassificationRulesClassificationsService,
  ClassificationRulesConditionsService,
  ClassificationRulesService,
} from './services/validation';

@NgModule({
  declarations: [],
  imports: [
    ClientUtilsModule,
    CarbonFrameworkModule,
  ],
  exports: []
})
export class ClientServicesModule {

  static forRoot(environment: any): ModuleWithProviders<ClientServicesModule> {
    return {
      ngModule: ClientServicesModule,
      providers: [
        DataExportService,
        ConfigurationService,
        {
          provide: EnvironmentServiceV1,
          useValue: new EnvironmentServiceV1(environment)
        },
        //
        RequestService,
        ClientSideDownloadService,
        CommentsService,
        UsersService,
        //
        TransactionsService,

        BuyRulesChangesService,
        BuyRulesConditionsService,
        BuyRulesExternalSuppliersService,
        BuyRulesSuppliersService,
        BuyRulesService,
        CatalogRulesCatalogsService,
        CatalogRulesChangesService,
        CatalogRulesConditionsService,
        CatalogRulesExternalCatalogsService,
        CatalogRulesService,
        ClassificationRulesChangesService,
        ClassificationRulesClassificationsService,
        ClassificationRulesClassificationsExternalService,
        ClassificationRulesConditionsService,
        ClassificationRulesService,
      ],
    };
  }

}
