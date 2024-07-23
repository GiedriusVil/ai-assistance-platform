/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';

import {
  NgForm,
} from '@angular/forms';

import { of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { NotificationService } from 'client-shared-carbon';

import {
  BaseModal
} from 'client-shared-views';

import {
  _error,
  _debugX,
  encodeAttributeWithBase64,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  TimezoneServiceV1,
  ConfigServiceV1
} from 'client-shared-services';

import {
  AccessGroupsServiceV1,
  UsersServiceV1,
} from 'client-services';

import { USERS_NOTIFICATION } from '../users-notification.messages';
import { Validators } from '@angular/forms';

@Component({
  selector: 'aiap-user-save-modal-v1',
  templateUrl: './user-save-modal-v1.html',
  styleUrls: ['./user-save-modal-v1.scss'],
})
export class UserSaveModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'UserSaveModalV1';
  }

  @ViewChild('userSaveModal', { static: true }) userSaveModal: NgForm;

  @Output() saveUserEvent = new EventEmitter<void>();


  accessGroups: Array<any> = [];
  userStatuses: Array<any> = [];
  tenants: Array<any> = [];
  timezones: Array<any> = [];

  _selections = {
    timezone: undefined,
    accessGroups: [],
    tenants: [],
    userStatus: undefined,
  };
  selections = lodash.cloneDeep(this._selections);

  user: any = {
    id: null,
    username: null,
    password: null,
    timezone: null,
    accessGroupIds: [],
    tenants: [],
    userStatus: null,
  };

  ENUM_USER_STATUSES = {
    ACTIVE:
      [
        'ACTIVE',
      ],
    IN_ACTIVE: [
      'IN_ACTIVE',
      'IN_ACTIVE_FAILED_ATTEMPTS',
    ]
  }

  allowUpdatePersonalProfile: any = null;
  isPasswordShown = false;
  isPasswordValid = false;
  passwordValidationRegex: any = '';

  changeTenantsAction = '';

  constructor(
    private configService: ConfigServiceV1,
    private userService: UsersServiceV1,
    private timezoneService: TimezoneServiceV1,
    private eventsService: EventsServiceV1,
    private notificationService: NotificationService,
    private accessGroupsService: AccessGroupsServiceV1,
    private sessionService: SessionServiceV1,
  ) {
    super();
  }

  ngOnInit() {
    this.allowUpdatePersonalProfile = true;
    const APP_CONFIG = this.configService.getConfig();
    const PASSWORD_REQUIREMENTS_CONFIG = APP_CONFIG?.passwordPolicyRegexp;
    this.passwordValidationRegex = new RegExp(`${PASSWORD_REQUIREMENTS_CONFIG}`);
  }

  ngAfterViewInit() {
    //
  }

  ngOnDestroy() {
    //
  }

  isTimezoneAssignedToUser(timezone: any) {
    let retVal = false;
    const TIMEZONE_ID = timezone.utc[0];
    const USER_TIMEZONE_ID = this.user.timezone ? this.user.timezone : 'America/Danmarkshavn';
    if (TIMEZONE_ID === USER_TIMEZONE_ID) {
      retVal = true;
    }
    return retVal;
  }


  save() {
    this.user.timezone = this.timezone?.value?.id;
    this.user.userStatus = this.selections?.userStatus?.statusName?.[0];
    if (!lodash.isEmpty(this.tenants)) {
      this.user.tenants = this.formTenants?.value?.map(item => {
        return { id: item.id, name: item.name };
      });
    }
    if (!lodash.isEmpty(this.accessGroups)) {
      this.user.accessGroupIds = this.groups?.value?.map(item => item.id);
    }
    this.user.username = this.username?.value;
    this.user.password = this.password?.value;
    encodeAttributeWithBase64(this.user, 'password');
    if (this.user.id) {
      this._updateUser();
    } else {
      this._createUser();
    }
    this.eventsService.loadingEmit(true);
  }

  close() {
    this.user.timezone = this.selections?.timezone?.id;
    if (!lodash.isEmpty(this.tenants)) {
      this.user.tenants = this.formTenants?.value?.map(item => {
        return { id: item.id, name: item.name };
      });
    }
    if (!lodash.isEmpty(this.accessGroups)) {
      this.user.accessGroupIds = this.groups?.value?.map(item => item.id);
    }
    this.isPasswordValid = false;
    super.close();
  }

  _createUser() {
    this.userService.create(this.user)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleCreateUserProfileError(error)),
        takeUntil(this._destroyed$),
      ).subscribe(() => {
        this.notificationService.showNotification(USERS_NOTIFICATION.SUCCESS.ADD_USER);
        this.eventsService.loadingEmit(false);
        this.close();
        this.eventsService.filterEmit(null);
      });
  }

  _updateUser() {
    this.timezoneService.overrideUserTimezone(this.user.timezone);
    if (
      this.user.password &&
      this.user.password.trim() === ''
    ) {
      this.user.password = undefined;
    }
    this.userService.update(this.user)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleUpdateUserProfileError(error)),
        takeUntil(this._destroyed$),
      ).subscribe(() => {
        this.notificationService.showNotification(USERS_NOTIFICATION.SUCCESS.UPDATE_USER);
        this.eventsService.loadingEmit(false);
        this.close();
        this.eventsService.filterEmit(null);
      });
  }


  isAccessGroupsFieldDisabled() {
    let retVal = null;
    const IS_ACTION_ALLOWED = this.sessionService.isActionAllowed({ action: 'users.view.change.accessGroup' });
    if (
      !IS_ACTION_ALLOWED
    ) {
      retVal = true;
    }
    return retVal;
  }

  isTenantsFieldDisabled() {
    let retVal = null;
    const IS_ACTION_ALLOWED = this.sessionService.isActionAllowed({ action: this.changeTenantsAction });
    if (!IS_ACTION_ALLOWED) {
      retVal = true;
    }
    return retVal;
  }

  isPasswordFieldDisabled() {
    const RET_VAL = null;
    return RET_VAL;
  }

  handleUserStatusSelectedEvent($event) {
    _debugX(UserSaveModalV1.getClassName(), 'handleAssistantSelectedEvent',
      {
        event: event,
        this_user: this.user,
        this_selections: this.selections,
      });

    this.user.userStatus = this.selections?.userStatus?.statusName[0];
    if (
      this.ENUM_USER_STATUSES.ACTIVE.includes(this.user.userStatus)
    ) {
      this.user.deniedLoginAttempts = 0;
    }
  }

  togglePasswordVisibility() {
    const PASSWORD = this.password?.value;
    this.isPasswordShown = !this.isPasswordShown;
    setTimeout(() => {
      this.password.setValue(PASSWORD);
    }, 0);
  }

  async showAsModal(user: any = null, personalProfile = false) {
    this.changeTenantsAction = personalProfile ? 'profile.view.change.tenants' : 'users.view.change.tenants';

    this.userService.loadUserSaveFormData(user)
      .pipe(
        catchError((error) => this.handleUpdateUserProfileError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response) => {
        const ACCESS_GROUPS = response?.accessGroups?.items;
        const TENANTS = response?.tenants?.items;
        const TIMEZONES = this.timezoneService.getTimezones();
        const USER_STATUSES = response?.userStatuses?.items;

        user.password = '';
        this.user = user;
        this._refreshUserStatusFailedAttempts(user);
        this.selections = lodash.cloneDeep(this._selections);
        this._refreshTimezonesDropdownListAndSelection(TIMEZONES, user);
        this._refreshUserStatusDropdownListAndSelection(this.userStatuses, user);
        if (!this.isTenantsFieldDisabled()) {
          this._refreshTenantsDropdownListAndSelection(TENANTS, user);
        }
        if (!this.isAccessGroupsFieldDisabled()) {
          this._refreshAccessGroupsDropdownListAndSelection(ACCESS_GROUPS, user);
        }
        this._refreshUserStatusDropdownListAndSelection(USER_STATUSES, user);

        this.updateValidators(user);
        super.superShow();
      });
  }

  updateValidators(user: any) {
    if (
      !lodash.isNil(user.id)
    ) {
      this.username.setValue(user.username);
      this.password.setValue(user.password);
      this.timezone.setValue({ id: user.timezone });
      if (
        !this.isTenantsFieldDisabled()
      ) {
        this.formTenants.setValue(this.selections?.tenants);
      }
      if (
        !this.isAccessGroupsFieldDisabled()
      ) {
        this.groups.setValue(this.selections.accessGroups);
      }

      this.username.disable();
      this.password.clearValidators();
      this.password.setValidators([Validators.pattern(this.passwordValidationRegex)]);
      this.password.updateValueAndValidity();
      this.username.clearValidators();
      this.username.updateValueAndValidity();
    } else {
      this.resetValidators();
    }

  }

  resetValidators() {
    this.userSaveModal.reset();

    this.username.enable();
    this.username.setValidators([Validators.required]);
    this.username.updateValueAndValidity();
    this.password.setValidators([Validators.required, Validators.pattern(this.passwordValidationRegex)]);
    this.password.updateValueAndValidity();
  }

  _refreshTenantsDropdownListAndSelection(items: Array<any>, user: any) {
    const TENANTS = [];
    for (const TMP_ITEM of items) {
      const USER_TENANTS = ramda.pathOr([], ['tenants'], user)?.map(el => el.id);
      const ITEM = {
        content: TMP_ITEM?.name,
        id: TMP_ITEM?.id,
        name: TMP_ITEM?.name,
        selected: USER_TENANTS.includes(TMP_ITEM?.id)
      };
      if (
        ITEM?.id
      ) {
        if (
          ITEM.selected
        ) {
          this.selections.tenants.push(ITEM);
        }
        TENANTS.push(ITEM);
      }
    }
    this.tenants = TENANTS;
  }

  _refreshAccessGroupsDropdownListAndSelection(items: Array<any>, user: any) {
    const ACCESS_GROUPS = [];
    for (const TMP_ITEM of items) {
      const USER_ACCESS_GROUPS = ramda.pathOr([], ['accessGroupIds'], user);
      const ITEM = {
        content: TMP_ITEM?.name,
        id: TMP_ITEM?.id,
        selected: USER_ACCESS_GROUPS.includes(TMP_ITEM?.id)
      };
      if (
        ITEM?.id
      ) {
        if (
          ITEM.selected
        ) {
          this.selections.accessGroups.push(ITEM);
        }
        ACCESS_GROUPS.push(ITEM);
      }
    }
    this.accessGroups = ACCESS_GROUPS;
  }

  _refreshTimezonesDropdownListAndSelection(items: Array<any>, user: any) {
    const TIMEZONES = [];

    const USER_TIMEZONE = this.timezoneService.getUserTimezone(user);

    for (const TMP_ITEM of items) {
      const ITEM = {
        content: TMP_ITEM?.text,
        id: TMP_ITEM?.utc[0],
        selected: TMP_ITEM === USER_TIMEZONE
      };
      if (
        ITEM?.id
      ) {
        if (
          ITEM.selected
        ) {
          this.selections.timezone = ITEM;
        }
        TIMEZONES.push(ITEM);
      }
    }
    this.timezones = TIMEZONES;
  }

  _refreshUserStatusDropdownListAndSelection(items: Array<any>, user: any) {
    const STATUSES = [];

    const USER_STATUS = user?.userStatus;

    for (const TMP_ITEM of items) {
      const ITEM = {
        content: TMP_ITEM?.content,
        id: TMP_ITEM?.id,
        selected: TMP_ITEM.statusName.includes(USER_STATUS),
        statusName: TMP_ITEM.statusName,
      };
      if (ITEM?.id) {
        if (
          ITEM.selected
        ) {
          this.selections.userStatus = ITEM;
        }
        STATUSES.push(ITEM);
      }
    }
    this.userStatuses = STATUSES;
    _debugX(UserSaveModalV1.getClassName(), 'refreshUserStatus',
      {
        selected_user_status: USER_STATUS,
        this_statuses: STATUSES,
        this_user: this.user,
        this_selections: this.selections,
      })
  }

  _refreshUserStatusFailedAttempts(user) {
    const APP_CONFIG = this.configService.getConfig();
    const FAILED_LOGINS_ALLOWED = APP_CONFIG?.userLoginFailiureLimit;
    const FAILED_LOGINS_MADE = user?.deniedLoginAttempts;
    if (FAILED_LOGINS_MADE > FAILED_LOGINS_ALLOWED) {
      this.user.userStatus = this.ENUM_USER_STATUSES?.IN_ACTIVE?.[1];
    }
  }

  handleCreateUserProfileError(error: any) {
    _error(`${error}`, error);
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(USERS_NOTIFICATION.ERROR.ADD_USER);
    this.close();
    return of();
  }

  handleUpdateUserProfileError(error: any) {
    _error(`${error}`, error);
    this.eventsService.loadingEmit(false);
    this.notificationService.showNotification(USERS_NOTIFICATION.ERROR.UPDATE_USER);
    return of();
  }

  get username() {
    const RET_VAL = this.userSaveModal.form.get('username');
    return RET_VAL;
  }

  get password() {
    const RET_VAL = this.userSaveModal.form.get('password');
    return RET_VAL;
  }
  get timezone() {
    const RET_VAL = this.userSaveModal.form.get('timezone');
    return RET_VAL;
  }
  get groups() {
    const RET_VAL = this.userSaveModal.form.get('accessGroups');
    return RET_VAL;
  }
  get formTenants() {
    const RET_VAL = this.userSaveModal.form.get('tenants');
    return RET_VAL;
  }
}
