import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CrudService} from './common/crud.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends CrudService<any> {

  constructor(public http: HttpClient) {
    super(http, 'menu');
  }

  tableExists(name: string): Observable<any> {
    return this.http.get<any>('http://localhost:15502/api/menu/table-exists?name=' + name);
  }

  // get(): Observable<any> {
  //   return this.http.get<any>('http://localhost:15502/api/menu/');
  // }

  // getById(id: string): Observable<any> {
  //   return this.http.get<any>('http://localhost:15502/api/menu/by-id?id=' + id);
  // }

  // update(menuComponent: MenuDTO) {
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
  //       'http://localhost:15502/api/menu/',
  //       menuComponent, httpOptions);
  // }


  // save(menuComponent: MenuDTO) {
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
  //       'http://localhost:15502/api/menu/',
  //       menuComponent, httpOptions);
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
  //       'http://localhost:15502/api/menu/?id=' + id, httpOptions);
  // }

}
