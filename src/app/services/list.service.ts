import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ListDTO} from '../dtos/list/list-dto';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  constructor(private http: HttpClient) {
  }


  get(): Observable<any> {
    return this.http.get<any>('http://localhost:15502/api/list/');
  }


  getById(id: string): Observable<any> {
    return this.http.get<any>('http://localhost:15502/api/list/by-id?id=' + id);
  }

  put(dto: ListDTO) {
    const httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
        }
      )
    };

    return this.http
      .put(
        'http://localhost:15502/api/list/',
        dto, httpOptions);
  }


  post(dto: ListDTO) {
    const httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
        }
      )
    };

    return this.http
      .post(
        'http://localhost:15502/api/list/',
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
        'http://localhost:15502/api/list/?id=' + id, httpOptions);
  }
}
