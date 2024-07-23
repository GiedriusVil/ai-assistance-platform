/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import { AiServiceIconPipe } from './ai-service-icon.pipe';
import { AiServiceNamePipe } from './ai-service-name.pipe';
import { BrowserIconPipe } from './browser-icon.pipe';
import { ChannelIconPipe } from './channel-icon.pipe';
import { DecimalPlacesPipe } from './decimal-places.pipe';
import { EmptyValuePipe } from './empty-value.pipe';
import { FilterItemsPipe } from './filter-items.pipe';
import { HealthCheckErrorPipe } from './health-check-error.pipe';
import { HostNamePipe } from './host-name.pipe';
import { OsIconPipe } from './os-icon.pipe';
import { SafePipe } from './safe.pipe';
import { SentenceCasePipe } from './sentence-case.pipe';
import { StripTextPipe } from './strip-text.pipe';
import { AnswerStoreIdPipe } from './answer-store-pull.pipe';

const PIPES = [
  AiServiceIconPipe,
  AiServiceNamePipe,
  BrowserIconPipe,
  ChannelIconPipe,
  DecimalPlacesPipe,
  EmptyValuePipe,
  FilterItemsPipe,
  HostNamePipe,
  OsIconPipe,
  SafePipe,
  SentenceCasePipe,
  StripTextPipe,
  HealthCheckErrorPipe,
  AnswerStoreIdPipe,
];

@NgModule({
  declarations: PIPES,
  exports: PIPES,
})
export class ClientSharedPipesModule { }
