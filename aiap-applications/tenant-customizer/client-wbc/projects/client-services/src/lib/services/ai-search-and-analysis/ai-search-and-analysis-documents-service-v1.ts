/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { of } from 'rxjs';

import {
  _debugX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BrowserServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

@Injectable()
export class AiSearchAndAnalysisDocumentsServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'AiSearchAndAnalysisDocumentsServiceV1';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private http: HttpClient,
    private browserService: BrowserServiceV1,
  ) {
    super(environmentService, sessionService);
  }

  _hostAndBasePath() {
    const RET_VAL = `${this._hostUrl()}/api/v1/search-and-analysis/documents`;
    return RET_VAL;
  }

  listManyByQuery(query: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/list-many-by-query`;
    const REQUEST = { query };
    const REQUEST_OPTIONS = this._requestOptions();
    _debugX(AiSearchAndAnalysisDocumentsServiceV1.getClassName(), 'findManyByQuery',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    const RET_VAL = {
      items: [
        {
          id: 'Document 1',
          name: 'Document 1',
          type: 'pdf',
          created: {
            date: '2022-11-24T12:50:34.992Z',
            user: {
              id: 'admin',
              name: 'admin'
            }
          },
          updated: {
            date: '2022-11-24T12:50:34.992Z',
            user: {
              id: 'admin',
              name: 'admin'
            }
          }
        },
        {
          id: 'Document 2',
          name: 'Document 2',
          type: 'doc',
          created: {
            date: '2022-11-24T12:50:34.992Z',
            user: {
              id: 'admin',
              name: 'admin'
            }
          },
          updated: {
            date: '2022-11-24T12:50:34.992Z',
            user: {
              id: 'admin',
              name: 'admin'
            }
          }
        },
        {
          name: 'Document 3',
          type: 'pdf',
          created: {
            date: '2022-11-24T12:50:34.992Z',
            user: {
              id: 'admin',
              name: 'admin'
            }
          },
          updated: {
            date: '2022-11-24T12:50:34.992Z',
            user: {
              id: 'admin',
              name: 'admin'
            }
          }
        },
        {
          name: 'Document 4',
          type: 'pdf',
          created: {
            date: '2022-11-24T12:50:34.992Z',
            user: {
              id: 'admin',
              name: 'admin'
            }
          },
          updated: {
            date: '2022-11-24T12:50:34.992Z',
            user: {
              id: 'admin',
              name: 'admin'
            }
          }
        },
        {
          name: 'Document 5',
          type: 'doc',
          created: {
            date: '2022-11-24T12:50:34.992Z',
            user: {
              id: 'admin',
              name: 'admin'
            }
          },
          updated: {
            date: '2022-11-24T12:50:34.992Z',
            user: {
              id: 'admin',
              name: 'admin'
            }
          }
        },
        {
          name: 'Document 6',
          type: 'pdf',
          created: {
            date: '2022-11-24T12:50:34.992Z',
            user: {
              id: 'admin',
              name: 'admin'
            }
          },
          updated: {
            date: '2022-11-24T12:50:34.992Z',
            user: {
              id: 'admin',
              name: 'admin'
            }
          }
        },
        {
          name: 'Document 7',
          type: 'pdf',
          created: {
            date: '2022-11-24T12:50:34.992Z',
            user: {
              id: 'admin',
              name: 'admin'
            }
          },
          updated: {
            date: '2022-11-24T12:50:34.992Z',
            user: {
              id: 'admin',
              name: 'admin'
            }
          }
        },
        {
          name: 'Document 8',
          type: 'doc',
          created: {
            date: '2022-11-24T12:50:34.992Z',
            user: {
              id: 'admin',
              name: 'admin'
            }
          },
          updated: {
            date: '2022-11-24T12:50:34.992Z',
            user: {
              id: 'admin',
              name: 'admin'
            }
          }
        },
        {
          name: 'Document 9',
          type: 'pdf',
          created: {
            date: '2022-11-24T12:50:34.992Z',
            user: {
              id: 'admin',
              name: 'admin'
            }
          },
          updated: {
            date: '2022-11-24T12:50:34.992Z',
            user: {
              id: 'admin',
              name: 'admin'
            }
          }
        },
        {
          name: 'Document 10',
          type: 'pdf',
          created: {
            date: '2022-11-24T12:50:34.992Z',
            user: {
              id: 'admin',
              name: 'admin'
            }
          },
          updated: {
            date: '2022-11-24T12:50:34.992Z',
            user: {
              id: 'admin',
              name: 'admin'
            }
          }
        },
        {
          name: 'Document 11',
          type: 'doc',
          created: {
            date: '2022-11-24T12:50:34.992Z',
            user: {
              id: 'admin',
              name: 'admin'
            }
          },
          updated: {
            date: '2022-11-24T12:50:34.992Z',
            user: {
              id: 'admin',
              name: 'admin'
            }
          }
        },
        {
          name: 'Document 12',
          type: 'pdf',
          created: {
            date: '2022-11-24T12:50:34.992Z',
            user: {
              id: 'admin',
              name: 'admin'
            }
          },
          updated: {
            date: '2022-11-24T12:50:34.992Z',
            user: {
              id: 'admin',
              name: 'admin'
            }
          }
        },
      ],
      total: 12,
    }
    return of(RET_VAL);

    // const RET_VAL = this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    // return RET_VAL;
  }

  deleteManyByIds(ids: Array<any>) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-ids`;
    const REQUEST = { ids };
    const REQUEST_OPTIONS = this._requestOptions();

    _debugX(AiSearchAndAnalysisDocumentsServiceV1.getClassName(), 'deleteManyByIds',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.http.post(
      REQUEST_URL,
      REQUEST,
      REQUEST_OPTIONS,
    );
    return RET_VAL;
  }

  deleteManyByServiceProjectCollectionIdAndDocuments(documents: Array<any>, params: any) {
    const REQUEST_URL = `${this._hostAndBasePath()}/delete-many-by-service-project-collection-id-and-documents`;
    const AI_SEARCH_AND_ANALYSIS_SERVICE_ID = params?.aiSearchAndAnalysisServiceId;
    const AI_SEARCH_AND_ANALYSIS_PROJECT_ID = params?.aiSearchAndAnalysisProjectId;
    const AI_SEARCH_AND_ANALYSIS_COLLECTION_ID = params?.aiSearchAndAnalysisCollectionId;
    const REQUEST = {
      aiSearchAndAnalysisServiceId: AI_SEARCH_AND_ANALYSIS_SERVICE_ID,
      aiSearchAndAnalysisProjectId: AI_SEARCH_AND_ANALYSIS_PROJECT_ID,
      aiSearchAndAnalysisCollectionId: AI_SEARCH_AND_ANALYSIS_COLLECTION_ID,
      aiSearchAndAnalysisDocuments: documents,
    };
    const REQUEST_OPTIONS = this._requestOptions();

    _debugX(AiSearchAndAnalysisDocumentsServiceV1.getClassName(), 'deleteManyByServiceProjectCollectionIdAndIds',
      {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS,
      });

    const RET_VAL = this.http.post(
      REQUEST_URL,
      REQUEST,
      REQUEST_OPTIONS,
    );
    return RET_VAL;
  }
}
