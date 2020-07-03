import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ListDTO} from '../../dtos/list/list-dto';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CrudService} from './common/crud.service';

@Injectable({
  providedIn: 'root'
})
export class ListService extends CrudService<any> {

  constructor(public http: HttpClient) {
    super(http, 'list');
  }


  // get(): Observable<any> {
  //   return this.http.get<any>('http://localhost:15502/api/list/');
  // }
  //
  //
  // getById(id: string): Observable<any> {
  //   return this.http.get<any>('http://localhost:15502/api/list?id=' + id);
  // }

  // update(dto: ListDTO) {
  //   const httpOptions = {
  //     headers: new HttpHeaders(
  //       {
  //         'Content-Type': 'application/json',
  //       }
  //     )
  //   };
  //
  //   return this.http
  //     .update(
  //       'http://localhost:15502/api/list/',
  //       dto, httpOptions);
  // }


  // save(dto: ListDTO) {
  //   const httpOptions = {
  //     headers: new HttpHeaders(
  //       {
  //         'Content-Type': 'application/json',
  //       }
  //     )
  //   };
  //
  //   return this.http
  //     .save(
  //       'http://localhost:15502/api/list/',
  //       dto, httpOptions);
  // }

  // delete(id: number) {
  //   const httpOptions = {
  //     headers: new HttpHeaders(
  //       {
  //         'Content-Type': 'application/json',
  //       }
  //     )
  //   };
  //
  //   return this.http
  //     .delete(
  //       'http://localhost:15502/api/list/?id=' + id, httpOptions);
  // }
}
