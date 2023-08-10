import { Component, OnInit } from '@angular/core';
import { PageComponent } from '../page/page-component';
import { RestDocumentationService } from 'app/services/crud/rest-documentation.service';
import { CommandNavigatorService } from 'app/services/system/command-navigator.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RestDocumentationDto } from 'app/dtos/rest-documentation/rest-documentation-dto';
import { environment } from 'environments/environment';
import {RestDocumentationEndpoint} from "../../dtos/rest-documentation/rest-documentation-endpoint";
import {DynamicRequestService} from "../../services/crud/dynamic-request.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-rest-documentation',
  templateUrl: './rest-documentation.component.html',
  styleUrls: ['./rest-documentation.component.scss']
})
export class RestDocumentationComponent extends PageComponent implements OnInit {

  dto: RestDocumentationDto = new RestDocumentationDto();
  serverUrl = '';
  restDocumentationEndpoint: RestDocumentationEndpoint;
  isDeleteCompleted = false;
  constructor(private service: RestDocumentationService,
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
            private navigatorService: CommandNavigatorService,
              private dynamicRequestService:  DynamicRequestService,
              private sanitizer: DomSanitizer,) {
  super();
}

  ngOnInit(): void {
    this.initNav(this.activatedRoute);
    this.refresh();

   this.serverUrl = environment.serverUrl
  }

  refresh() {
    const locateParams = this.getLocateParams();
    this.service.getById(locateParams.get('ID')).subscribe(data => {
      this.dto = data;

      this.dto.restDocumentationEndpoints
      .filter(endpoint => endpoint.type === "form")
      .filter(endpoint => ["post", "put"].includes(endpoint.method))
      .forEach(endpoint => {
        endpoint.jsonString = atob(endpoint.jsonString); 
        const jsonObj = JSON.parse(endpoint.jsonString);
        endpoint.jsonString = JSON.stringify(jsonObj, null, 4);
      })
    });
  }

  getResults(restDocumentationEndpoint: RestDocumentationEndpoint) {
    let url = '/datalist/'+restDocumentationEndpoint.list.jsonUrl + '?';

    restDocumentationEndpoint.list.listComponentFilterFieldList.forEach(field => {
      url += field.code + '=' + field.fieldValue;
    });

    this.dynamicRequestService.getFromBackend(url ).subscribe(data => {
      restDocumentationEndpoint.restResults = JSON.stringify(data, null, 4);
    });
  }

  runGetMethodWithCheck(restDocumentationEndpoint: RestDocumentationEndpoint) {
    if (this.isParameterValueNotNull(restDocumentationEndpoint)) {
      this.getResults(restDocumentationEndpoint);
    }
  }
  
  isParameterValueNotNull(restDocumentationEndpoint: RestDocumentationEndpoint): boolean {
    for (const parameterField of restDocumentationEndpoint.list.listComponentFilterFieldList) {
      if (parameterField.fieldValue === null) {
        return false;
      }
    }
    return true;
  }

  
  trustResource(resource) {
    return this.sanitizer.bypassSecurityTrustHtml(resource);
  }

  runDelete(restDocumentationEndpoint) {

    if (!restDocumentationEndpoint.selectionId) {
      alert("Selection ID parameter is missing.");
      return;
    }

    const url = '/dataset/' + restDocumentationEndpoint.form.jsonUrl + '?selection-id=' + restDocumentationEndpoint.selectionId;

    this.dynamicRequestService.deleteFromBackend(url).subscribe(
      (data) => {
        restDocumentationEndpoint.restResults = JSON.stringify(data, null, 4);
        this.isDeleteCompleted = true;

        setTimeout(() => {
          this.isDeleteCompleted = false;
        }, 3000); 
      },
      (error) => {
        console.error('Error deleting data:', error);
      }
    );
  }

  runPost(restDocumentationEndpoint: RestDocumentationEndpoint) {
    const url = '/dataset/'+restDocumentationEndpoint.form.jsonUrl + '?';;
    const requestBody = restDocumentationEndpoint.jsonString;  
    this.dynamicRequestService.postToBackendWithTextResponse(url, requestBody).subscribe(
      (id) => {
        restDocumentationEndpoint.restResults = id;
      },
      (error) => {
        console.error('Error making POST request:', error);
      }
    );
  }

  runPut(restDocumentationEndpoint: RestDocumentationEndpoint) {
    const url = '/dataset/'+restDocumentationEndpoint.form.jsonUrl + '?';;
    const requestBody = restDocumentationEndpoint.jsonString;
    this.dynamicRequestService.putToBackendWithTextResponse(url, requestBody).subscribe(
      (id) => {
        restDocumentationEndpoint.restResults = id;
      },
      (error) => {
        console.error('Error making POST request:', error);
      }
    );
  }

 
  getJsonUrlValue(restDocumentationEndpoint: RestDocumentationEndpoint): string {
    if (restDocumentationEndpoint.list) {
      return this.getListJsonUrl(restDocumentationEndpoint);
    } else {
      return this.getFormJsonUrl(restDocumentationEndpoint);
    }
  }
  
  getListJsonUrl(restDocumentationEndpoint: RestDocumentationEndpoint): string {
    return this.serverUrl + '/datalist/' + restDocumentationEndpoint.list?.jsonUrl;
  }
  
  getFormJsonUrl(restDocumentationEndpoint: RestDocumentationEndpoint): string {
    const method = restDocumentationEndpoint.method;
    if (method === 'delete') {
      return this.serverUrl + '/dataset/' + restDocumentationEndpoint.form?.jsonUrl + '?selection-id={id}';
    } else {
      return this.serverUrl + '/dataset/' + restDocumentationEndpoint.form?.jsonUrl;
    }
  }

}
