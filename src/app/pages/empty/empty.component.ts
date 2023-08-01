import {AfterContentInit, Component, OnInit} from '@angular/core';
import * as d3 from 'd3';
import {AuthService} from "../../services/system/auth/auth.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NotificationService} from "../../services/system/notification.service";
import {UserService} from "../../services/crud/user.service";
import {Router} from "@angular/router";
import {CommandNavigatorService} from "../../services/system/command-navigator.service";
import {SettingsService} from "../../services/crud/settings.service";
import {DomSanitizer} from "@angular/platform-browser";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-empty',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.css']
})
export class EmptyComponent {}
