import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponceService} from './services/system/http-error-responce.service';
import {NotificationService} from './services/system/notification.service';
import {SettingsService} from './services/crud/settings.service';
import { App as CapacitorApp } from '@capacitor/app';
import {PushNotifications} from "@capacitor/push-notifications";
import {environment} from "../environments/environment";
import {WebSocketService} from "./services/system/web-socket.service";
import {Observable} from "rxjs";
import {Message} from "@stomp/stompjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  favIcon: HTMLLinkElement = document.querySelector('#appIcon');
  appTitle = '';
  loginImage = '';

  public constructor(private activatedRoute: ActivatedRoute,
                     private httpErrorResponceService: HttpErrorResponceService,
                     private notificationService: NotificationService,
                     private title: Title,
                     private webSocketService: WebSocketService,
                     private settingsService: SettingsService) {
  }

  ngOnInit(): void {

    const messageObservable: Observable<Message> = this.webSocketService.getMessageObservable2();
    if(messageObservable != undefined){
      messageObservable.subscribe((message) => {
        console.log(' ..1.. '+message.body);
      });
    }

    this.activatedRoute.queryParamMap.subscribe(params => {
      this.title.setTitle(this.appTitle);
    });

    this.listenToHttpErrors();
    this.defineIcon();
    this.defineTitle();

    CapacitorApp.addListener('backButton', ({canGoBack}) => {
      if (!canGoBack) {
        CapacitorApp.exitApp();
      } else {
        window.history.back();
      }
    });

    PushNotifications.register();

    // PushNotifications.addListener('pushNotificationReceived', (notification: any) => {
    //   // Handle received push notification
    //   console.log('Received push notification: ', notification);
    //   this.notificationService.showNotification('top', 'center', 'alert-info', 'fa-thumbs-down', 'Received push notification - ' + notification.toString());
    // });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification: any) => {
      // Handle action performed on push notification (e.g., tapped)
      //console.log('Push notification action performed: ', notification);


      this.notificationService.showNotification('top', 'center', 'alert-info', 'fa-thumbs-down', 'Push notification action performed - ' + JSON.stringify(notification));
    });

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

  defineLoginLogo() {
    this.settingsService.getLoginImage().subscribe(icon => {
      if (icon != null) {
        this.loginImage = icon;
      } else {
        this.loginImage = './assets/img/sofia.png';
      }
    }, () => {
      this.loginImage = './assets/img/sofia.png';
    });
  }


}
