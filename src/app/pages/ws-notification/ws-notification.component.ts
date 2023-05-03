import { Component, OnInit } from '@angular/core';
import {PageComponent} from "../page/page-component";
import {WsNotificationService} from "../../services/crud/ws-notification.service";
import {RuleDTO} from "../../dtos/rule/rule-d-t-o";
import {RuleSettingsDTO} from "../../dtos/rule/rule-settings-dto";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-ws-notification',
  templateUrl: './ws-notification.component.html',
  styleUrls: ['./ws-notification.component.scss']
})
export class WsNotificationComponent extends PageComponent implements OnInit {

  data: any = null;

  constructor(private activatedRoute: ActivatedRoute,
              private service: WsNotificationService) {
    super();
  }

  ngOnInit(): void {

    this.initNav(this.activatedRoute);


    const locateParams = this.getLocateParams();
    let id = locateParams.get('ID');

    this.service.getById(id).subscribe(data => {
      this.data = data;
    });

  }

}
