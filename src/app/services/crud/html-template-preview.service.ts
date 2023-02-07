import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { CrudService } from './common/crud.service';

@Injectable({
  providedIn: 'root'
})
export class HtmlTemplatePreviewService extends CrudService<any>{

  constructor(public http: HttpClient) {
    super(http, 'html-template') }

    printPreview(id: any,selectionId: any): Observable<any> {

      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
      
      return this.http.get(`${environment.serverUrl}/${this.endpoint}/print-preview?id=${id}&selection-id=${selectionId}`)
    
      };
    }

