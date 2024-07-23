import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class PermissionServiceV1 {
  constructor(private modalService: NgbModal) {}

  audioUnlocked(content: any) {
    return new Promise(async (resolve, reject) => {
      this.audioPlay().then(status => {
        if (status) {
          return resolve(true);
        } else {
          this.permissionRequest(content).then(async allow => {
            if (allow) {
              return resolve(true);
            } else {
              return resolve(false);
            }
          });
        }
      });
    });
  }

  private audioPlay() {
    return new Promise(resolve => {
      const promise = new Audio('/assets/silence.mp3').play();
      if (promise !== undefined) {
        promise
          .then(_ => {
            return resolve(true);
          })
          .catch(error => {
            return resolve(false);
          });
      }
    });
  }

  private permissionRequest(content: any) {
    return new Promise((resolve, reject) => {
      this.modalService
        .open(content, {
          ariaLabelledBy: 'modal-basic-title',
          centered: true,
          backdropClass: 'custom--backdrop',
          size: 'lg'
        })
        .result.then(
          result => {
            if (result) {
              return resolve(true);
            } else {
              return resolve(false);
            }
          },
          () => {
            return resolve(false);
          }
        );
    });
  }
}
