import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import { ViewDTO } from 'app/dtos/view/view-dto';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  constructor(private http: HttpClient) {
  }

  get(): Observable<any> {
    return this.http.get<any>('http://localhost:15502/api/view/');
  }


  tableExists(name: string): Observable<any> {
    return this.http.get<any>('http://localhost:15502/api/view/table-exists?name=' + name);
  }


  getById(id: string): Observable<any> {
    return this.http.get<any>('http://localhost:15502/api/view/by-id?id=' + id);
  }


  generateViewFields(query: string): Observable<any> {
    return this.http.get<any>('http://localhost:15502/api/view/generate-view-fields?query=' + query);
  }


  put(dto: ViewDTO) {
    const httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
        }
      )
    };

    return this.http
      .put(
        'http://localhost:15502/api/view/',
        dto, httpOptions);
  }


  post(dto: ViewDTO) {
    const httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
        }
      )
    };

    return this.http
      .post(
        'http://localhost:15502/api/view/',
        dto, httpOptions);
  }

  delete(id: number) {
    const httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
        }
      )
    };

    return this.http
      .delete(
        'http://localhost:15502/api/view/?id=' + id, httpOptions);

  }


}
