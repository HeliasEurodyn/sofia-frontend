import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {TableDTO} from '../dtos/table/tableDTO';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor(private http: HttpClient) {
  }

  get(): Observable<any> {
    return this.http.get<any>('http://localhost:15502/api/table/');
  }


  tableExists(name: string): Observable<any> {
    return this.http.get<any>('http://localhost:15502/api/table/table-exists?name=' + name);
  }


  getById(id: string): Observable<any> {
    return this.http.get<any>('http://localhost:15502/api/table/by-id?id=' + id);
  }

  put(tableDesign: TableDTO) {
    const httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
        }
      )
    };

    return this.http
      .put(
        'http://localhost:15502/api/table/',
        tableDesign, httpOptions);
  }


  post(tableDesign: TableDTO) {
    const httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
        }
      )
    };

    return this.http
      .post(
        'http://localhost:15502/api/table/',
        tableDesign, httpOptions);
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
        'http://localhost:15502/api/table/?id=' + id, httpOptions);

  }


}
