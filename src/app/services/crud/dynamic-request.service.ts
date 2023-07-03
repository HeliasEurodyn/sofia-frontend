import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, timeout} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DynamicRequestService {

  constructor(public http: HttpClient) { }

  getFromBackend(url: string): Observable<any> {
    return this.http.get<any>(`${environment.serverUrl}${url}`);
  }

  getHtmlReport(htmlReportId: string, selectionId: string): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data'
    });

    return this.http.get(`${environment.serverUrl}/html-template/download?id=${htmlReportId}&selection-id=${selectionId}`,
    {
      headers : headers,
      observe: 'response',
      responseType: 'blob'
    });
  }

  getFromBackendWithCustomHeaders(url: string, customHeaders: []): Observable<any> {
    let headers = new HttpHeaders();
    for (const index of Object.keys(customHeaders)) {
      headers = headers.set(index, customHeaders[index]);
    }
    return this.http.get(`${environment.serverUrl}${url}`, {headers});
  }

  getFromUrlWithCustomHeaders(url: string, customHeaders: []): Observable<any> {
    let headers = new HttpHeaders();
    for (const index of Object.keys(customHeaders)) {
      headers = headers.set(index, customHeaders[index]);
    }
    return this.http.get<any>(`${url}`, {headers});
  }

  handleError(error) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = error.error.message;
    } else {
      // server-side error
      errorMessage = error.error.message;
    }
    window.alert(errorMessage);
    return null;
  }

  getFromUrl(url: string): Observable<any> {
    return this.http.get<any>(`${url}`);
  }

  postToBackend(url: string, data: any): Observable<any> {
    return this.http.post<any>(`${environment.serverUrl}${url}`, data);
  }

  postToUrl(url: string, data: any): Observable<any> {
    return this.http.post<any>(`${url}`, data);
  }

  putToBackend(url: string, data: any): Observable<any> {
    return this.http.put<any>(`${environment.serverUrl}${url}`, data);
  }

  putToUrl(url: string, data: any): Observable<any> {
    return this.http.put<any>(`${url}`, data);
  }

  deleteFromBackend(url: string): Observable<any> {
    return this.http.delete<any>(`${environment.serverUrl}${url}`);
  }

  deleteFromUrl(url: string): Observable<any> {
    return this.http.get<any>(`${url}`);
  }

}

