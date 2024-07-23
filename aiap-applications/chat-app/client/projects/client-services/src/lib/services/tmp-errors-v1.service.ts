import { Injectable } from '@angular/core';

@Injectable()
export class TmpErrorsServiceV1 {

    private authorizationError: any;
    private systemError: any;

    constructor() { }

    getAuthorizationError() {
        return this.authorizationError;
    }

    setAuthorizationError(error) {
        this.authorizationError = error;
    }

    setSystemError(error) {
        this.systemError = error;
    }

    getSystemError() {
        return this.systemError;
    }
}
