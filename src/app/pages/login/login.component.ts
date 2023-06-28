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
import {SetApplicationInterfaceModalComponent} from '../../modals/set-application-intreface/set-application-interface-modal.component';
import {Filesystem, Directory, Encoding} from '@capacitor/filesystem';

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

  constructor(private authService: AuthService,
              private modalService: NgbModal,
              private notificationService: NotificationService,
              private userService: UserService,
              private router: Router,
              private navigatorService: CommandNavigatorService,
              private settingsService: SettingsService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    Filesystem.readFile({
      path: 'api.txt',
      directory: Directory.Library,
      encoding: Encoding.UTF8,
    }).then(r => {
      environment.serverUrl = r.data
    }).then(() => {
      this.defineLoginLogo();
    })
      .catch(ex => {
        this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-thumbs-down', ex);
      })


    localStorage.setItem('serverUrl', environment.serverUrl);

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
        localStorage.setItem('loggedin_user', JSON.stringify(data.user));
        localStorage.setItem('uiVersion', '1.1');
        sessionStorage.setItem('sidebarMenu', JSON.stringify(data.user['sidebarMenu']));

        const loginNavCommand = data.user['loginNavCommand'];
        if (loginNavCommand == null || loginNavCommand === '') {
          this.router.navigateByUrl('/d-dashboard');
        } else {
          this.navigatorService.navigate(loginNavCommand);
        }
      }
    );
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

    modalReference.result.then((url) => {
      Filesystem.writeFile({ path: filePath, data: url, directory, encoding })
        .then(() => {
          environment.serverUrl =  url;
        }).then(() => {
        this.settingsService.getLoginImage().subscribe(icon => {
          if (icon != null) {
            this.loginImage = icon;
          } else {
            this.loginImage = './assets/img/sofia.png';
          }
        });
      })
        .catch((ex) => {
          this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-id-card', ex);
        });
    });
  }


}
