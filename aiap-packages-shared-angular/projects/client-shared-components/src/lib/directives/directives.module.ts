/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';

import { DataCodeSnippetDirective } from './data-code-snippet.directive';
import { DataCopyBtnDirective } from './data-copy-btn.directive';
import { DataHeaderNavDirective } from './data-header-nav.directive';
import { DataHeaderSubmenuDirective } from './data-header-submenu.directive';
import { DataLoadingSmallDirective } from './data-loading-small.directive';
import { DataLoadingDirective } from './data-loading.directive';
import { DataNotificationDirective } from './data-notification.directive';
import { DataOverflowMenuDirective } from './data-overflow-menu.directive';
import { DataPaginationDirective } from './data-pagination.directive';
import { DataSearchDirective } from './data-search.directive';
import { DataTextInputDirective } from './data-text-input.directive';
import { DomChangeDirective } from './dom-change.directive';
import { IsActionAllowedDirective } from './is-action-allowed.directive';
import { IsViewAllowedDirective } from './is-view-allowed.directive';

const DIRECTIVES = [
  DataCopyBtnDirective,
  DataCodeSnippetDirective,
  DataHeaderNavDirective,
  DataHeaderSubmenuDirective,
  DataLoadingSmallDirective,
  DataLoadingDirective,
  DataNotificationDirective,
  DataOverflowMenuDirective,
  DataPaginationDirective,
  DataSearchDirective,
  DataTextInputDirective,
  DomChangeDirective,
  IsActionAllowedDirective,
  IsViewAllowedDirective,
];

@NgModule({
  declarations: DIRECTIVES,
  providers: DIRECTIVES,
  exports: DIRECTIVES,
})
export class AcaClientComponentsDirectivesModule { }
