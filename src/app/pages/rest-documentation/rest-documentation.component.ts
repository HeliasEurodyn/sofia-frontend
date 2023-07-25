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
  //dtos:RestDocumentationEndpoint = new RestDocumentationEndpoint();
  serverUrl = '';
  constructor(private service: RestDocumentationService,
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
            private navigatorService: CommandNavigatorService,
              private dynamicRequestService:  DynamicRequestService,
              private sanitizer: DomSanitizer) {
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
      //this.dtos = data;
    });
  }

  runResults(restDocumentationEndpoint: RestDocumentationEndpoint) {
    this.dynamicRequestService.getFromBackend('/datalist/'+restDocumentationEndpoint.list.jsonUrl ).subscribe(data => {
      restDocumentationEndpoint.restResults = JSON.stringify(data, null, 4);
    });
  }

  trustResource(resource) {
    return this.sanitizer.bypassSecurityTrustHtml(resource);
  }

}
