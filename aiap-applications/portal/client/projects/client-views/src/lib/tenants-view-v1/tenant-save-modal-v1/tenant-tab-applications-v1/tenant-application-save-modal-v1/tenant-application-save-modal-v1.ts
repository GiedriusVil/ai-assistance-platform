/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';

import { NotificationService } from 'client-shared-carbon';

import { of } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { catchError, tap } from 'rxjs/operators';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  APPLICATIONS_MESSAGES
} from 'client-utils';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
} from 'client-shared-services';

import {
  ApplicationsServiceV1,
} from 'client-services';

@Component({
  selector: 'aiap-tenant-application-save-modal-v1',
  templateUrl: './tenant-application-save-modal-v1.html',
  styleUrls: ['./tenant-application-save-modal-v1.scss'],
})
export class TenantApplicationSaveModalV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'TenantApplicationSaveModalV1';
  }

  private _destroyed$: Subject<void> = new Subject();

  @Output() onAddApplication = new EventEmitter<any>();

  isOpen = false;

  _selections = {
    applicationOptions: [],
    applications: [],
  }

  _applicationConfigs = {
    enabled: false,
  };

  applicationConfigs = lodash.cloneDeep(this._applicationConfigs);
  selections = lodash.cloneDeep(this._selections);

  constructor(
    private eventsService: EventsServiceV1,
    private notificationService: NotificationService,
    private applicationsService: ApplicationsServiceV1,
  ) { }

  ngOnInit() {
    //
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  show(application: any) {
    _debugX(TenantApplicationSaveModalV1.getClassName(), 'show',
      {
        application,
      });

    this.selections = lodash.cloneDeep(this._selections);
    const APPLICATION_ID = application?.id;
    if (
      lodash.isEmpty(APPLICATION_ID)
    ) {
      this.applicationConfigs = lodash.cloneDeep(this._applicationConfigs);
    } else {
      this.applicationConfigs = lodash.cloneDeep(application);
    }
    this.fetchApplications().subscribe((response: any) => {
      this.eventsService.loadingEmit(false);
      const APPLICATIONS = response?.items;
      _debugX(TenantApplicationSaveModalV1.getClassName(), 'show',
        {
          APPLICATIONS,
        });

      this.setApplicationSelections(APPLICATIONS, application);
      this.isOpen = true;
    });
  }

  save() {
    const APPLICATION = this.getSanitizedApplication();
    this.onAddApplication.emit(APPLICATION);
    this.close();
  }

  close() {
    this.isOpen = false;
  }

  handleApplicationFlagChangeEvent(event: any) {
    _debugX(TenantApplicationSaveModalV1.getClassName(), 'handleApplicationFlagChangeEvent',
      {
        event,
      });
    this.applicationConfigs.enabled = !this.applicationConfigs.enabled;
  }

  private getSanitizedApplication() {
    const RET_VAL = [];
    this.selections.applications.forEach(application => {
      RET_VAL.push({
        id: application.value.id,
        name: application.value.name,
        enabled: this.applicationConfigs.enabled
      });
    });
    return RET_VAL;
  }

  private fetchApplications() {
    const APPLICATIONS_QUERY = {
      sort: {
        field: 'name',
        direction: 'asc'
      },
      pagination: {
        page: 1,
        size: 1000,
      }
    };
    const RET_VAL = this.applicationsService.findManyByQuery(APPLICATIONS_QUERY)
      .pipe(
        tap(() => this.eventsService.loadingEmit(true)),
        catchError((error) => this.handleFindApplicationsByQuery(error)),
      );
    return RET_VAL;
  }

  private setApplicationSelections(applications: any, selected: any) {
    this.selections.applicationOptions = this.transformApplicationsToDropdownItems(applications)

    if (lodash.isEmpty(selected?.id)) {
      return;
    }

    let optionsContainsSelected = false;

    for (const APPLICATION of this.selections.applicationOptions) {
      if (
        selected?.id === APPLICATION?.value?.id
      ) {
        APPLICATION.selected = true;
        this.selections.applications = [APPLICATION]
        optionsContainsSelected = true;
        break;
      }
    }

    if (
      !optionsContainsSelected
    ) {
      const SELECTED = ramda.path(['0'], this.transformApplicationsToDropdownItems([selected]));
      SELECTED.selected = true;

      this.selections.applicationOptions.push(SELECTED);
    }
  }

  private transformApplicationsToDropdownItems(applications: Array<any>) {
    const RET_VAL = [];
    if (
      lodash.isArray(applications) &&
      !lodash.isEmpty(applications)
    ) {
      for (const APPLICATION of applications) {
        if (
          lodash.isString(APPLICATION?.name) &&
          !lodash.isEmpty(APPLICATION?.name) &&
          lodash.isString(APPLICATION?.id) &&
          !lodash.isEmpty(APPLICATION?.id)
        ) {
          const OPTION = {
            content: APPLICATION.name,
            value: APPLICATION,
          };
          RET_VAL.push(OPTION);
        }
      }
    }
    return RET_VAL;
  }

  private handleFindApplicationsByQuery(error: any) {
    _errorX(TenantApplicationSaveModalV1.getClassName(), 'handleFindApplicationsByQuery',
      {
        error,
      });

    this.eventsService.loadingEmit(false);
    const NOTIFICATION = APPLICATIONS_MESSAGES.SUCCESS.FIND_MANY_BY_QUERY;
    this.notificationService.showNotification(NOTIFICATION);
    return of();
  }

}
