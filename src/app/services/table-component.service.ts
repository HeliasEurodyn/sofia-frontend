import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ComponentDTO} from 'app/dtos/component/componentDTO';

@Injectable({
  providedIn: 'root'
})
export class TableComponentService {

  constructor(private http: HttpClient) {
  }


  get(): Observable<any> {
    return this.http.get<any>('http://localhost:15502/api/component/');
  }


  // tableExists(name: string): Observable<any> {
  //   return this.http.get<any>('http://localhost:15502/api/component/table-exists?name=' + name);
  // }


  getById(id: string): Observable<any> {
    return this.http.get<any>('http://localhost:15502/api/component/by-id?id=' + id);
  }

  put(dto: ComponentDTO) {
    const httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
        }
      )
    };

    return this.http
      .put(
        'http://localhost:15502/api/component/',
        dto, httpOptions);
  }


  post(dto: ComponentDTO) {
    const httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
        }
      )
    };

    return this.http
      .post(
        'http://localhost:15502/api/component/',
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
        'http://localhost:15502/api/component/?id=' + id, httpOptions);

  }

}
