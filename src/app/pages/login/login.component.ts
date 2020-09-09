import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NotificationService} from '../../services/notification.service';
import {LoginInfoDto} from '../../dtos/user/login-info-dto';
import {UserService} from '../../services/crud/common/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';
  rememberChecked = false;

  // this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-id-card', '<b>Error 500</b> Something Went Wrong');


  constructor(private router: Router,
              private notificationService: NotificationService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.rememberChecked = false;

    if (localStorage.getItem('rememberChecked') !== null) {
      if (localStorage.getItem('rememberChecked') === 'true') {
        this.username = localStorage.getItem('username');
        this.password = localStorage.getItem('password');
        this.rememberChecked = true;
      } else {
        this.username = '';
        this.password = '';
        this.rememberChecked = false;
      }
    }
  }

  authenticateUser() {

    if (this.username === '') {
      this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-id-card', '<b>Login Error</b> Please fill in your username');
      return;
    }

    if (this.password === '') {
      this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-id-card', '<b>Login Error</b> Please fill in your password');
      return;
    }

    const loginInfo = new LoginInfoDto();
    loginInfo.username = this.username;
    loginInfo.password = this.password;
    loginInfo.capthca = '';
    loginInfo.tfaCode = '';
    loginInfo.tfaValid = false;

    this.userService.login(loginInfo).subscribe(
      authData => {

        if (this.rememberChecked === true) {
          localStorage.setItem('username', this.username);
          localStorage.setItem('password', this.password);
          localStorage.setItem('rememberChecked', 'true');
        } else {

          localStorage.setItem('username', '');
          localStorage.setItem('password', '');
          localStorage.setItem('rememberChecked', 'false');
        }
        // AppConstants.SessionInfo.username = this.username
        // AppConstants.SessionInfo.password = this.password
        const jwt = authData['jwt'];
        if (jwt !== '') {
          localStorage.setItem('jwt_token', authData['jwt']);
          this.userService.getCurrentUser().subscribe(userDto => {
            localStorage.setItem('loggedin_user', JSON.stringify(userDto));
            this.router.navigateByUrl('/main/default');
          });
        } else {
          this.password = '';
          this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-thumbs-down',
            '<b>Login Error</b> Wrong username or password. Please try again');
        }
      }, onError => {

        this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-thumbs-down',
          '<b>Login Error</b> An error occured while logging in. Please try again later');
      });
  }

  onEnterMethod() {
    // this.router.navigateByUrl('/main/default');
    this.authenticateUser();
  }

}
