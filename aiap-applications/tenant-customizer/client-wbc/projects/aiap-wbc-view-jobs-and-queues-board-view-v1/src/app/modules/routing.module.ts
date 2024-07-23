/*
  © Copyright IBM Corporation 2023. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {}),
  ],
  exports: [
    RouterModule,
  ]
})
export class RoutingModule { }
