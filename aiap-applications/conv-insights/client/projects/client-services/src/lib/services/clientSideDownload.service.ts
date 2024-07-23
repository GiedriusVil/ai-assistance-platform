/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

@Injectable()
export class ClientSideDownloadService {
  constructor() { }

  openSaveFileDialog(data, filename, mimetype) {
    if (!data) return;

    const blob = data.constructor !== Blob ? new Blob([data], { type: mimetype || 'application/octet-stream' }) : data;

    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, filename);
      return;
    }

    const lnk = document.createElement('a');
    const url = window.URL;
    let objectURL;

    if (mimetype) {
      lnk.type = mimetype;
    }

    lnk.download = filename || 'untitled';
    lnk.href = objectURL = url.createObjectURL(blob);
    lnk.dispatchEvent(new MouseEvent('click'));
    setTimeout(url.revokeObjectURL.bind(url, objectURL));
  }
}

declare global {
  interface Navigator {
    msSaveBlob: (blob: Blob, fileName: string) => boolean
  }
}