/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthenticationGuard } from './guards/authentication';

import {
  AuthorizationErrorView,
  BasketView,
  MainView,
  SystemErrorView,
} from './views';

import { AuthComponent } from './components/auth/auth';

const routes: Routes = [
  { path: '', component: MainView, canActivate: [AuthenticationGuard], runGuardsAndResolvers: 'paramsOrQueryParamsChange' },
  { path: 'basket', component: BasketView },
  { path: 'authorization-error-view', component: AuthorizationErrorView },
  { path: 'system-error-view', component: SystemErrorView },
  { path: 'auth', component: AuthComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRouting { }
