import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {LoadingService} from '../services/system/loading.service';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class HttpRequestLoadingInterceptor implements HttpInterceptor {

  constructor(
    private loadingService: LoadingService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!request.headers.has('no-global-loader')) {
      this.loadingService.setLoading(true, request.url);
    }

    let updatedRequest;
    if (request.headers.has('no-global-loader') ) {
      const headers = request.headers.delete('no-global-loader');
      updatedRequest = request.clone({headers: headers});
    } else {
      updatedRequest = request;
    }

    return next.handle(updatedRequest)
      .pipe(catchError((err) => {
        this.loadingService.setLoading(false, request.url);
        return throwError(err);
      }))
      .pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
        if (evt instanceof HttpResponse) {
          this.loadingService.setLoading(false, request.url);
        }
        return evt;
      }));

  }
}
