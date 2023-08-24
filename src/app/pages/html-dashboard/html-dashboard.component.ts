import {Component, Input, OnInit} from '@angular/core';
import * as uuid from 'uuid';
import {HtmlDashboardDTO} from '../../dtos/html-dashboard/html-dashboard-dto';
import {HtmlDashboardService} from 'app/services/crud/html-dashboard.service';
import {InfoCartScriptService} from "../../services/system/info-cart-script.service";
import {DomSanitizer} from "@angular/platform-browser";
import {HtmlDashboardScriptService} from "../../services/system/html-dashboard-script.service";

@Component({
  selector: 'app-html-dashboard',
  templateUrl: './html-dashboard.component.html',
  styleUrls: ['./html-dashboard.component.css']
})
export class HtmlDashboardComponent implements OnInit {

  @Input() id: number;
  @Input() public extraParamsMap: Map<any, any>;
 // public instanceId = uuid.v4();
  public dto: HtmlDashboardDTO;

  constructor(private service: HtmlDashboardService,
              private sanitizer: DomSanitizer,
              public htmlDashboardScriptService: HtmlDashboardScriptService) {
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.service.getById(this.id).subscribe(dto => {
      this.dto = dto;
      this.htmlDashboardScriptService.loadWithPromise(this).then(response => {});
    });
  }

  trustResource(resource) {
    return this.sanitizer.bypassSecurityTrustHtml(resource);
  }

  handleClick(event: any) {
      const classListArray = Array.from(event.target.classList);
      this.htmlDashboardScriptService.areaClickOccured(this.dto.id, classListArray)
   //   alert(`Clicked on sub div with class: ${clickedSubDivClass}`);
  }

}
