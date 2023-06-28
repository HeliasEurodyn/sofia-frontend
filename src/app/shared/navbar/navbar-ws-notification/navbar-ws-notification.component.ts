import {Component, Input, OnInit} from '@angular/core';
import {WebSocketService} from "../../../services/system/web-socket.service";
import {WsNotificationService} from "../../../services/crud/ws-notification.service";
import {CommandNavigatorService} from "../../../services/system/command-navigator.service";
import {MenuFieldDTO} from "../../../dtos/menu/menuDTO";

@Component({
  selector: 'app-navbar-ws-notification',
  templateUrl: './navbar-ws-notification.component.html',
  styleUrls: ['./navbar-ws-notification.component.scss']
})
export class NavbarWsNotificationComponent implements OnInit {

  @Input() public menuField: MenuFieldDTO;
  public notifications: any[] = [];

  constructor(private webSocketService: WebSocketService, private wsNotificationService: WsNotificationService, private navigatorService: CommandNavigatorService) {
  }

  ngOnInit(): void {
    this.initializeWebSockets();
  }

  initializeWebSockets() {
    /* Initialize Web Sockets */
    const userDto = JSON.parse(localStorage.getItem('loggedin_user'));
    this.webSocketService.initializeSockets();
    this.webSocketService.subscribeToUserTopic(userDto.id);

    /* Subscribe to Websockets of User Message */
    this.webSocketService.getUserMessageObservable().subscribe((message) => {
      const newNotification = JSON.parse(message.body);
      if(newNotification.icon === '' || newNotification.icon == null){
        newNotification.icon = 'fa-circle-notch'
      }
      this.notifications.unshift(newNotification);
      console.log(' ..User Message.. ' + message.body);
    });

    /* Get Unread Messages */
    this.wsNotificationService.getUnread().subscribe(notifications => {
      this.notifications = notifications;

      this.notifications.forEach(notification => {
        if(notification.icon === '' || notification.icon == null){
          notification.icon = 'fa-circle-notch'
        }
      });
    });
  }

  navigate(notification) {
    const params = JSON.parse(this.menuField.command);

    if (params['UPDATE-STATUS-ON-CLICK'].toUpperCase() === 'YES') {
      this.removeNotification(notification.id);
    }

    if(notification.command === '' || notification.command == null){
      notification.command = '{"COMMAND-TYPE":"STATICPAGE","NAME":"ws-notification","LOCATE":{"ID":"' + notification.id + '"}}'
    } else {
      notification.command =  notification.command.replace('#id',notification.id);
    }

    this.navigatorService.navigate(notification.command);
  }

  removeNotification(notificationId: string) {
    this.wsNotificationService.read(notificationId).subscribe();
    if (this.notifications !== undefined) {
      this.notifications = this.notifications.filter(n => n.id !== notificationId);
    }
  }

}
