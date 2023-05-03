import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponceService} from './services/system/http-error-responce.service';
import {NotificationService} from './services/system/notification.service';
import {SettingsService} from './services/crud/settings.service';
import {environment} from "../environments/environment";
import {WebSocketService} from "./services/system/web-socket.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  favIcon: HTMLLinkElement = document.querySelector('#appIcon');
  appTitle = '';

  public constructor(private activatedRoute: ActivatedRoute,
                     private httpErrorResponceService: HttpErrorResponceService,
                     private notificationService: NotificationService,
                     private title: Title,
                     private webSocketService: WebSocketService,
                     private settingsService: SettingsService) {
  }

  ngOnInit(): void {
    // this.websocketService.getMessageObservable().subscribe((message) => {
    //   console.log(message);
    // });
    this.webSocketService.initializeConnections();
    this.webSocketService.getMessageObservable2().subscribe((message) => {
      console.log(' ..1.. '+message.body);
    });


    this.activatedRoute.queryParamMap.subscribe(params => {
      this.title.setTitle(this.appTitle);
    });

    this.listenToHttpErrors();
    this.defineIcon();
    this.defineTitle();

    if(environment.serverOnProxyPath != ''){
      environment.serverUrl = location.origin + environment.serverOnProxyPath;
    }

    localStorage.setItem('serverUrl', environment.serverUrl);

  }

  listenToHttpErrors(): void {
    this.httpErrorResponceService.httpErrorMessageEmitter
      .subscribe((message) => {
        if (message !== '') {
          this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-thumbs-down', message);
        }
      });
  }

  defineIcon() {
    this.settingsService.getIcon().subscribe(icon => {
      if (icon != null) {
        this.favIcon.href = icon;
      } else {
        this.favIcon.href = './assets/img/sofia_icon.png';
      }
    });
  }

  defineTitle() {
    this.settingsService.getName().subscribe(name => {
      if (name != null) {
        this.appTitle = name;
      } else {
        this.appTitle = 'Sofia';
      }
      this.title.setTitle(this.appTitle);
    });
  }


}
