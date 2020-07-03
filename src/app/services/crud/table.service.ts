import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CrudService} from './common/crud.service';

@Injectable({
  providedIn: 'root'
})
export class TableService extends CrudService<any> {

  constructor(public http: HttpClient) {
    super(http, 'table');
  }

  tableExists(name: string): Observable<any> {
    return this.http.get<any>('http://localhost:15502/api/table/table-exists?name=' + name);
  }

  // get(): Observable<any> {
  //   return this.http.get<any>('http://localhost:15502/api/table/');
  // }

  // getById(id: string): Observable<any> {
  //   return this.http.get<any>('http://localhost:15502/api/table/by-id?id=' + id);
  // }

  // update(tableDesign: TableDTO) {
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
  //       'http://localhost:15502/api/table/',
  //       tableDesign, httpOptions);
  // }


  // save(tableDesign: TableDTO) {
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
  //       'http://localhost:15502/api/table/',
  //       tableDesign, httpOptions);
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
  //       'http://localhost:15502/api/table/?id=' + id, httpOptions);
  //
  // }

}
