import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudService} from './common/crud.service';

@Injectable({
  providedIn: 'root'
})
export class TableComponentService extends CrudService<any> {

  constructor(public http: HttpClient) {
    super(http, 'component');
  }

  // get(): Observable<any> {
  //   return this.http.get<any>('http://localhost:15502/api/component/');
  // }

  // getById(id: string): Observable<any> {
  //   return this.http.get<any>('http://localhost:15502/api/component/by-id?id=' + id);
  // }

  // update(dto: ComponentDTO) {
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
  //       'http://localhost:15502/api/component/',
  //       dto, httpOptions);
  // }

  // save(dto: ComponentDTO) {
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
  //       'http://localhost:15502/api/component/',
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
  //       'http://localhost:15502/api/component/?id=' + id, httpOptions);
  // }

}
