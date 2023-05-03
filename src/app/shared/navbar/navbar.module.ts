import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NavbarComponent} from './navbar.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NavbarWsNotificationComponent } from './navbar-ws-notification/navbar-ws-notification.component';

@NgModule({
    imports: [ RouterModule, CommonModule, NgbModule ],
    declarations: [ NavbarComponent, NavbarWsNotificationComponent ],
    exports: [ NavbarComponent, NavbarWsNotificationComponent ]
})
export class NavbarModule {}
