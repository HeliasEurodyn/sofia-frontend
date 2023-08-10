import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/crud/user.service";
import {Router} from "@angular/router";
import {CommandNavigatorService} from "../../services/system/command-navigator.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  constructor(private userService: UserService,
              private router: Router,
              private navigatorService: CommandNavigatorService) {
  }

  ngOnInit(): void {
    console.log('DefaultComponent');

    localStorage.setItem('serverUrl', environment.serverUrl);
    this.tryRefreshAndLogin();
  }

  public tryRefreshAndLogin() {
    const jwtToken = localStorage.getItem('jwt_token');
    const refreshToken = localStorage.getItem('refresh_token');
    let userJson = localStorage.getItem('loggedin_user');

    if (jwtToken == null || jwtToken == '' || refreshToken == null || refreshToken == '' || userJson == null || userJson == '') {
      this.router.navigateByUrl(`/login`);
    }

    this.userService.refresh().subscribe(
      data => {
        localStorage.setItem('jwt_token', data.accessToken);
        localStorage.setItem('refresh_token', data.refreshToken);


        let user = JSON.parse(userJson);

        const loginNavCommand = user['loginNavCommand'];
        if (loginNavCommand == null || loginNavCommand === '') {
          this.router.navigateByUrl('/d-dashboard');
        } else {
          this.navigatorService.navigate(loginNavCommand);
        }

      },
      error => {
        this.router.navigateByUrl(`/login`);
      }
    );

  }

}
