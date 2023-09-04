import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/crud/user.service';
import {environment} from '../../../environments/environment';
import {AuthService} from '../../services/system/auth/auth.service';
import {NotificationService} from '../../services/system/notification.service';
import {Router} from '@angular/router';
import {CommandNavigatorService} from '../../services/system/command-navigator.service';
import {SettingsService} from '../../services/crud/settings.service';
import {DomSanitizer} from '@angular/platform-browser';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  SetApplicationInterfaceModalComponent
} from '../../modals/set-application-intreface/set-application-interface-modal.component';
import {Directory, Encoding, Filesystem} from '@capacitor/filesystem';
import {PushNotificationService} from "../../services/crud/push-notification.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  currentDate: Date = new Date();
  username = '';
  password = '';

  keycloakLogin = false;

  googleURL = environment.serverUrl + '/oauth2/authorization/google?redirect_uri=' + location.origin + '/callback';
  facebookURL = environment.serverUrl + '/oauth2/authorization/facebook?redirect_uri=' + location.origin + '/callback';
  keycloakURL = environment.serverUrl + '/oauth2/authorization/keycloak?redirect_uri=' + location.origin + '/callback';
  githubURL = environment.serverUrl + '/oauth2/authorization/github?redirect_uri=' + location.origin + '/callback';
  linkedinURL = environment.serverUrl + '/oauth2/authorization/linkedin?redirect_uri=' + location.origin + '/callback';
  keyrockURL = environment.serverUrl + '/oauth2/authorization/keyrock?redirect_uri=' + location.origin + '/callback';
  loginImage = '';

  maintenanceActive = false;

  constructor(private authService: AuthService,
              private modalService: NgbModal,
              private notificationService: NotificationService,
              private userService: UserService,
              private router: Router,
              private navigatorService: CommandNavigatorService,
              private settingsService: SettingsService,
              private sanitizer: DomSanitizer,
              private pushNotificationService: PushNotificationService) {
  // this.tryRefreshAndLogin();
  }

  ngOnInit(): void {
   localStorage.setItem('serverUrl', environment.serverUrl);
   localStorage.removeItem('jwt_token');
   localStorage.removeItem('refresh_token');
   localStorage.removeItem('loggedin_user');

   if(localStorage.getItem('def_u') !== null){
     var ub64 = localStorage.getItem('def_u');
     var pb64 = localStorage.getItem('def_p');
     this.username = atob(ub64);
     this.password = atob(pb64);
   }

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

  authenticateUser(): void {

    if (this.username === '') {
      this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-id-card', '<b>Login Error</b> Please fill in your username');
      return;
    }

    if (this.password === '') {
      this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-id-card', '<b>Login Error</b> Please fill in your password');
      return;
    }

    this.authService.login(this.username, this.password).subscribe(
      data => {
        localStorage.setItem('jwt_token', data.accessToken);
        localStorage.setItem('refresh_token', data.refreshToken);
        localStorage.setItem('loggedin_user', JSON.stringify(data.user));
        localStorage.setItem('uiVersion', '1.1');
        sessionStorage.setItem('sidebarMenu', JSON.stringify(data.user['sidebarMenu']));

        var ub64 = btoa(this.username);
        var pb64 = btoa(this.password);
        localStorage.setItem('def_u', ub64);
        localStorage.setItem('def_p', pb64);


        this.registerPushNotificationDeviceTokenToBackend();

        const loginNavCommand = data.user['loginNavCommand'];
        if (loginNavCommand == null || loginNavCommand === '') {
          this.router.navigateByUrl('/d-dashboard');
        } else {
          this.navigatorService.navigate(loginNavCommand);
        }
      }
    );
  }

  registerPushNotificationDeviceTokenToBackend(){
     this.pushNotificationService.register(localStorage.getItem('device_token')).subscribe();
  }

  trustResource(resource) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(resource);
  }

  onEnterMethod() {
    this.authenticateUser();
  }

  openModal() {
    const modalReference = this.modalService.open(SetApplicationInterfaceModalComponent);

    const filePath = 'api.txt';
    const directory = Directory.Library;
    const encoding = Encoding.UTF8;

    Filesystem.readFile({path: filePath, directory, encoding})
      .then(r => {
        modalReference.componentInstance.url = r.data;
      })
      .catch(ex => {
        modalReference.componentInstance.url = '';
      })
  }

}
