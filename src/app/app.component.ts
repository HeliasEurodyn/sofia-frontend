import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponceService} from './services/system/http-error-responce.service';
import {NotificationService} from './services/system/notification.service';
import {SettingsService} from './services/crud/settings.service';
import { App as CapacitorApp } from '@capacitor/app';

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
                     private settingsService: SettingsService) {
  }

  ngOnInit(): void {
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
