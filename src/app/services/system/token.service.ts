import { Injectable } from '@angular/core';
import {interval, Subscription} from "rxjs";
import {UserService} from "../crud/user.service";
import {Router} from "@angular/router";

/*
* This doRefreshToken is executed every 30 minutes to refresh the jwt token that expires every 1 hour
* */

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private timerSubscription: Subscription;
  intervalTime = 1800000;

  constructor(private userService: UserService,
              private router: Router) {
  }

  public refreshTokenTimerStart() {
 /* this.timerSubscription = interval(this.intervalTime).subscribe(() => {
      this.doRefreshToken();
    }); */
  }

  public doRefreshToken() {
   const jwtToken = localStorage.getItem('jwt_token');

    if(jwtToken == null || jwtToken == ''){
    return;
    }

    this.userService.refresh().subscribe(
      data => {
        localStorage.setItem('jwt_token', data.accessToken);
        localStorage.setItem('refresh_token', data.refreshToken);
      },
      error => {
        this.router.navigateByUrl(`/login`);
      }
    );

  }

  refreshTokenTimerStop() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
