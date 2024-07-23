/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, ViewChild, HostListener, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as ramda from 'ramda';

import { Modal } from 'carbon-components';

import {
  _error,
  _debugX,
  encodeAttributeWithBase64,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BrowserServiceV1,
  EventsServiceV1,
  ConfigServiceV1,
} from 'client-shared-services';

import {
  LoginServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-user-credentials-form-v1',
  templateUrl: './user-credentials-form-v1.html',
  styleUrls: ['./user-credentials-form-v1.scss'],
})
export class UserCredentialsFormV1 {

  static getClassName() {
    return 'UserCredentialsFormV1';
  }

  @ViewChild('datamodal', { static: true }) datamodal;

  nonce: any = this.createNonceId();
  modal: any = null;

  error = false;
  errorMessage = '';

  username = '';
  password = '';
  token = '';
  ssoConfig: any = null;

  constructor(
    private router: Router,
    private eventsService: EventsServiceV1,
    private loginService: LoginServiceV1,
    private sessionService: SessionServiceV1,
    private activatedRoute: ActivatedRoute,
    private configService: ConfigServiceV1,
    private browserService: BrowserServiceV1,
  ) { }

  @HostListener('document:keydown.enter', ['$event']) onEnterKey(event: KeyboardEvent) {
    event.preventDefault();
    this.onSubmit();
  }

  @Output() onLocalAuthCompleted = new EventEmitter<void>();

  ngOnInit(): void {
    this.ssoConfig = this.configService.getConfig()?.sso;
    this.modal = Modal.create(this.datamodal.nativeElement);
    const routeFragment: Observable<string> = this.activatedRoute.fragment;
    routeFragment.subscribe((fragment) => {
      if (fragment != null) {
        const auth = [];
        const parts = fragment.split('&');
        for (let i = 0; i < parts.length; i++) {
          const split = parts[i].split('=');
          auth[split[0]] = split[1].trim();
        }
        this.token = auth['id_token'];
        this.onSubmit();
      }
    });
  }

  ngOnDestroy(): void {
    this.modal.release();
  }

  async onSubmit() {
    this.eventsService.loadingEmit(true);
    try {
      if (this.username && this.password) {
        const LOGIN = {
          username: this.username,
          password: this.password
        }
        encodeAttributeWithBase64(LOGIN, 'password');
        await this.loginService.login(LOGIN);
      } else {
        if (this.token) {
          await this.loginService.login({ token: this.token });
        }
      }
      this.error = false;
      this.eventsService.loadingEmit(false);
      _debugX(UserCredentialsFormV1.getClassName(), 'onSubmit',
        {
          session: this.sessionService.getSession(),
        });

      if (
        this.sessionService.hasSession()
      ) {
        this.onLocalAuthCompleted.emit();
      } else {
        this.modal.show();
      }
    } catch (error: any) {
      _error(`[${UserCredentialsFormV1.getClassName()}] onSubmit`, { error });
      this.eventsService.loadingEmit(false);
      this.error = true;
      this.setErrorMessage(error);
    }
  }

  onLoginWithSSO() {
    const clientId = this.ssoConfig.clientId;
    const redirectUrl = this.ssoConfig.redirectUrl;
    const scope = this.ssoConfig.scope;
    const loginUrl = this.ssoConfig.loginUrl;
    const responseType = this.ssoConfig.responseType;
    const REDIRECT_URL = `${loginUrl}?response_type=${responseType}&client_id=${clientId}&state=${this.nonce}&redirect_uri=${redirectUrl}&scope=${scope}&nonce=${this.nonce}`;
    this.browserService.redirectToUrl(REDIRECT_URL);
  }

  onFocusUsername() {
    this.showError(false);
  }

  onFocusPassword() {
    this.showError(false);
  }

  private showError(show: any) {
    this.error = show;
  }

  private setErrorMessage(error) {
    const ERORR_TYPE = ramda.pathOr('NOT_AUTHORIZED', ['error', '0', 'type'], error);
    if (
      ERORR_TYPE == 'USER_LOCKED'
    ) {
      this.errorMessage = 'login_view_v1.user_credentials_form_v1.msg_err_locked_account'
    } else {
      this.errorMessage = 'login_view_v1.user_credentials_form_v1.msg_err_check_credentials';
    }
  }

  private createNonceId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 40; i++) {
      text += possible.charAt(Math.floor(this.browserService.randomFloat() * possible.length));
    }
    return text;
  }

}
