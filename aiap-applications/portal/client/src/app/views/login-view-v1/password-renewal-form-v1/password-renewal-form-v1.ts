/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

import {
  _debugX,
  encodeAttributeWithBase64,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  ConfigServiceV1
} from 'client-shared-services';

import {
  UsersServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-password-renewal-form-v1',
  templateUrl: './password-renewal-form-v1.html',
  styleUrls: ['./password-renewal-form-v1.scss'],
})
export class PasswordRenewalFormV1 {

  static getClassName() {
    return 'PasswordRenewalFormV1';
  }

  private _destroyed$: Subject<void> = new Subject();

  error: any;
  errorMessage = '';

  isPasswordValid = true;
  passwordPolicyRequirement: RegExp;
  passwordPolicyMessage: string;

  password = '';
  passwordRepeat = '';

  constructor(
    private router: Router,
    private configService: ConfigServiceV1,
    private userService: UsersServiceV1,
    private eventsService: EventsServiceV1,
    private sessionService: SessionServiceV1
  ) {
  }

  ngOnInit() {
    //
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const EVENT = new Event('resize');
      window.dispatchEvent(EVENT);
    }, 0);
  }

  onSubmit() {
    if (
      this.password != this.passwordRepeat
    ) {
      this.error = true;
      this.errorMessage = 'login_view_v1.password_renewal_form_v1.msg_err_invalid_passwords';
      return;
    }

    const CONFIGURATION = this.configService.getConfig();
    const PASSWORD_REQUIREMENTS_CONFIG = CONFIGURATION?.passwordPolicyRegexp;
    const PASSWORD_POLICY_CRITERIA = new RegExp(PASSWORD_REQUIREMENTS_CONFIG);

    if (
      !PASSWORD_POLICY_CRITERIA.test(this.password) ||
      !PASSWORD_POLICY_CRITERIA.test(this.passwordRepeat)
    ) {
      this.error = true;
      this.errorMessage = CONFIGURATION?.passwordPolicyMessage;
      return;
    }

    this.updateUser();
  }

  updateUser() {
    const USER = this.sessionService.getUser();
    USER.password = this.password;
    encodeAttributeWithBase64(USER, 'password');
    this.userService
      .update(USER)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError(error => this.handleUpdateUserProfileError(error)),
        takeUntil(this._destroyed$)
      ).subscribe(() => {
        this.eventsService.loadingEmit(false);
        this.router.navigateByUrl('/main-view/organizations');
      });
  }

  handleUpdateUserProfileError(error): any {
    _debugX(PasswordRenewalFormV1.getClassName(), 'Error!',
      {
        error,
      });
    this.error = error;
    this.errorMessage = error?.error?.message;
  }

  onFocusPassword() {
    this.showError(false);
  }

  private showError(show: any) {
    this.error = show;
  }

}
