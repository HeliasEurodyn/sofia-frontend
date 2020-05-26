import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Menu} from '../dtos/menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {


  constructor(private http: HttpClient) {
  }

  get(): Observable<any> {
    return this.http.get<any>('http://localhost:15502/api/menu/');
  }


  tableExists(name: string): Observable<any> {
    return this.http.get<any>('http://localhost:15502/api/menu/table-exists?name=' + name);
  }


  getById(id: string): Observable<any> {
    return this.http.get<any>('http://localhost:15502/api/menu/by-id?id=' + id);
  }

  put(menuComponent: Menu) {
    const httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
        }
      )
    };

    return this.http
      .put(
        'http://localhost:15502/api/menu/',
        menuComponent, httpOptions);
  }


  post(menuComponent: Menu) {
    const httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
        }
      )
    };

    return this.http
      .post(
        'http://localhost:15502/api/menu/',
        menuComponent, httpOptions);
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
        'http://localhost:15502/api/menu/?id=' + id, httpOptions);

  }

}
