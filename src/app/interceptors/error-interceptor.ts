import {Injectable, Injector} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http'
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpError} from '../dtos/http/http-error';
import {NotificationService} from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private notificationService: NotificationService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const logFormat = 'background: maroon; color: white';
    return next.handle(req).pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse): Observable<any> {
    const logFormat = 'background: maroon; color: white';

    if (err instanceof HttpErrorResponse) {
      switch (err.status) {

        case HttpError.BadRequest:
          console.error('%c Bad Request 400', logFormat);
          this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-thumbs-down', '<b>Error 400</b> Bad Request 400');
          break;

        case HttpError.Unauthorized:
          console.error('%c Unauthorized 401', logFormat);
          this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-thumbs-down', '<b>Error 401</b> Not Found 401');
          break;

        case HttpError.NotFound:
          console.error('%c Not Found 404', logFormat);
          this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-thumbs-down', '<b>Error 404</b> Not Found 404');
          break;

        case HttpError.TimeOut:
          console.error('%c TimeOut 408', logFormat);
          this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-thumbs-down', '<b>Error 408</b> TimeOut 408');
          break;

        case HttpError.Forbidden:
          console.error('%c Forbidden 403', logFormat);
          this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-thumbs-down', '<b>Error 403</b> Forbidden 403');
          break;

        case HttpError.InternalServerError:
          console.error('%c big bad 500', logFormat);
          this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-thumbs-down', '<b>Error 500</b> Big bad 500');
          break;
      }
    }

    return of(err.message);
  }


  // private handleAuthError(err: HttpErrorResponse): Observable<any> {
  //   // handle your auth error or rethrow
  //   if (err.status === 401 || err.status === 403) {
  //     // navigate /delete cookies or whatever
  //     //  this.router.navigateByUrl(`/login`);
  //     // if you've caught
  //     // handled the error, you don't want to rethrow it unless you
  //     // also want downstream consumers to have to handle it as well.
  //     return Observable.of(err.message);
  //   }
  //   return Observable.throw(err);
  // }

}
