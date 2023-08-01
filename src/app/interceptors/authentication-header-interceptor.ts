import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';


@Injectable()
export class AuthenticationHeaderInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwtToken = localStorage.getItem('jwt_token');


    if (jwtToken === '' || jwtToken === undefined || jwtToken == null || request.url.endsWith("/user/auth")) {
      return next.handle(request);
    }

    let headers = new HttpHeaders();
    if (request.headers.has('no-global-error')) {
      headers = headers.set('no-global-error', 'yes');
    }

    if (request.headers.has('no-global-loader')) {
      headers = headers.set('no-global-loader', 'yes');
    }

    let jwtTokenHeader = 'Bearer ' + jwtToken;
    if(request.url.endsWith("/user/auth/refresh")){
      jwtTokenHeader = 'RefreshBearer ' + localStorage.getItem('refresh_token');;
    }

    let updatedRequest
    if (request.headers.has('Content-Type') && request.headers.get('Content-Type') === 'multipart/form-data' ) {
      headers =  headers.set( 'Authorization', jwtTokenHeader);
      updatedRequest = request.clone({
        headers: headers
      });
    } else {
      headers = headers.set( 'Content-Type', 'application/json');
      headers = headers.set( 'Authorization', jwtTokenHeader);
      updatedRequest = request.clone({
        headers: headers
      });
    }
    return next.handle(updatedRequest);
  }

}
