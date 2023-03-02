import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpErrorResponceService} from '../services/system/http-error-responce.service';
import {NotificationService} from '../services/system/notification.service';
import {Router} from '@angular/router';

@Injectable()
export class HttpRequestErrorInterceptor implements HttpInterceptor {

  constructor(private httpErrorResponceService: HttpErrorResponceService,
              private notificationService: NotificationService,
              private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.headers.has('no-global-error') ) {
      const headers = request.headers.delete('no-global-error');
      return next.handle(request.clone({headers: headers}));
    }

    return next.handle(request)
      .pipe(catchError((errorResponce) => {

        if (this.isJsonString(errorResponce.error)) {
          const response = JSON.parse(errorResponce.error);
          if(response.isVisible) {
            this.httpErrorResponceService.setNewErrorMessage(response.message);
          }
          return throwError(errorResponce);
        }

        switch (errorResponce.status) {
          case 400:
            this.httpErrorResponceService.setNewErrorMessage('<b>400</b> Bad Request 400');
            break;
          case 401:
            const errorMessage = '<b>Code ' + errorResponce.status + '</b> ' + errorResponce.error.message;
            this.httpErrorResponceService.setNewErrorMessage(errorMessage);
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('loggedin_user');
            sessionStorage.removeItem('sidebarMenu');
            this.router.navigateByUrl(`/login`);
            break;

          case 403:
            this.httpErrorResponceService.setNewErrorMessage('<b>Code 403</b> Forbidden area.');
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('loggedin_user');
            sessionStorage.removeItem('sidebarMenu');
            this.router.navigateByUrl(`/login`);
            break;

          case 404:
            this.httpErrorResponceService.setNewErrorMessage('<b>Code 404</b> Not Found.');
            break;

          case 408:
            this.httpErrorResponceService.setNewErrorMessage('<b>Code 408</b> TimeOut.');
            break;

          case 500:
            this.httpErrorResponceService.setNewErrorMessage('<b>Code 500</b> Internal server issue.');
            break;
        }
        return throwError(errorResponce);
      }));

  }

  private isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

}
