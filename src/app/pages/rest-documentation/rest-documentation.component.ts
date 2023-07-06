import { Component, OnInit } from '@angular/core';
import { PageComponent } from '../page/page-component';
import { RestDocumentationService } from 'app/services/crud/rest-documentation.service';
import { CommandNavigatorService } from 'app/services/system/command-navigator.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RestDocumentationDto } from 'app/dtos/rest-documentation/rest-documentation-dto';
import { RestDocumentationEndpoint } from 'app/dtos/rest-documentation/rest-documentation-endpoint';
import { environment } from 'environments/environment';

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
            private navigatorService: CommandNavigatorService) {
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

}
