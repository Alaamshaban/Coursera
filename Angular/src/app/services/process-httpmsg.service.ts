import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProcessHTTPMsgService {

  constructor() { }
  
  public handleError(error: HttpErrorResponse | any) {
    let errMsg: string;

    if (error.error instanceof ErrorEvent) {
      errMsg = error.error.message;
      console.log("true:",errMsg);
    } else {
      errMsg = `${error.status} - ${error.statusText || ''} ${error.error}`;
      console.log("true2:",errMsg,error);
    }

    return throwError(errMsg);
  }

}
