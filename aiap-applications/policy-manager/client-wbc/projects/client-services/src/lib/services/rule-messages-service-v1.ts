/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'

import { forkJoin, of } from 'rxjs';

import {
  BaseServiceV1,
  EnvironmentServiceV1,
  SessionServiceV1,
} from 'client-shared-services';

@Injectable()
export class RuleMessagesServiceV1 extends BaseServiceV1 {

  static getClassName(): string {
    return 'RuleMessagesServiceV1';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private httpClient: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    let retVal = `${this._hostUrl()}/api/rules-messages`;
    return retVal;
  }

  retrieveMessageSaveFormData() {
    const LANGUAGES = [
      {
        content: 'Indonesian (Bahasa Indonesia)',
        code: 'id',
        selected: false
      },
      {
        content: 'Malay (Bahasa Melayu)',
        code: 'ms',
        selected: false
      },
      {
        content: 'Czech (Čeština)',
        code: 'cs',
        selected: false
      },
      {
        content: 'Danish (Dansk)',
        code: 'da',
        selected: false
      },
      {
        content: 'German (Deutsch)',
        code: 'de',
        selected: false
      },
      {
        content: 'German (Deutsch (CH))',
        code: 'de-ch',
        selected: false
      },
      {
        content: 'English (UK)',
        code: 'en-gb',
        selected: false
      },
      {
        content: 'English (US)',
        code: 'en-us',
        selected: false
      },
      {
        content: 'Spanish (Español)',
        code: 'es',
        selected: false
      },
      {
        content: 'French (Français)',
        code: 'fr',
        selected: false
      },
      {
        content: 'Italian (Italiano)',
        code: 'it',
        selected: false
      },
      {
        content: 'Hungarian (Magyar)',
        code: 'hu',
        selected: false
      },
      {
        content: 'Dutch (Nederlands)',
        code: 'nl',
        selected: false
      },
      {
        content: 'Norwegian (Norsk Bokmål)',
        code: 'nb-no',
        selected: false
      },
      {
        content: 'Polish (Polski)',
        code: 'pl',
        selected: false
      },
      {
        content: 'Portuguese (Português (Brasil))',
        code: 'pt-br',
        selected: false
      },
      {
        content: 'Portuguese (Português (Portugal))',
        code: 'pt-pt',
        selected: false
      },
      {
        content: 'Romanian (Română)',
        code: 'ro',
        selected: false
      },
      {
        content: 'Slovak (Slovenčina)',
        code: 'sk',
        selected: false
      },
      {
        content: 'Finnish (Suomi)',
        code: 'fi',
        selected: false
      },
      {
        content: 'Swedish (Svenska)',
        code: 'sv-se',
        selected: false
      },
      {
        content: 'Japanese (日本語)',
        code: 'ja',
        selected: false
      },
      {
        content: 'Simplified Chinese (简体中文)',
        code: 'zh-cn',
        selected: false
      },
      {
        content: 'Traditional Chinese (繁体中文)',
        code: 'zh-tw',
        selected: false
      }
    ];

    const RET_VAL = forkJoin(
      {
        languages: of(LANGUAGES)
      }
    );
    return RET_VAL;
  }

  findManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/find-many-by-query`;
    const REQUEST = {
      ...query
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  saveOne(message: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/save-one`;
    const REQUEST = { message };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  deleteOneById(id: string) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-one-by-id`;
    const REQUEST = {
      id: id,
    };
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
  }

  deleteManyByIds(ids: any[]) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    return this.httpClient.post(REQUEST_URL, ids, this.getAuthHeaders());
  }

  pull() {
    const REQUEST_URL = `${this._hostAndBasePath()}/pull`;
    const REQUEST_OPTIONS = {
      headers: { ['Authorization']: `Bearer ${this._token()}` }
    };
    return this.httpClient.post(REQUEST_URL, {}, REQUEST_OPTIONS);
  }

  export() {
    const REQUEST_URL = `${this._hostAndBasePath()}/export`;
    return this.httpClient.post(REQUEST_URL, {}, {
      headers: {
        ['Authorization']: `Bearer ${this._token()}`,
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      },
      responseType: "blob",
    });
  }
}
