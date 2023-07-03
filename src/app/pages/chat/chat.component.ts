import { Component, OnInit } from '@angular/core';
import {UserDto} from '../../dtos/user/user-dto';
import {UserService} from '../../services/crud/user.service';
import {MessageDTO} from '../../dtos/chat/message-dto';
import {NotificationService} from '../../services/system/notification.service';
import {ChatService} from '../../services/crud/chat.service';
import {environment} from '../../../environments/environment';
import {Stomp} from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public  showChatBox = false;

  public users: Array<UserDto>

  public selectedUser: UserDto

  public currentUser: UserDto

  public messages: Array<MessageDTO>

  private stompClient;

  constructor(private userService: UserService,
              private notificationService: NotificationService,
              private chatService: ChatService) { }

  ngOnInit(): void {
    this.messages = new Array<MessageDTO>();
    this.connect();
    this.getCurrentUser()
    this.getUsers();
  }

  connect() {
    const ws = new SockJS(`${environment.serverUrl}/sockjs`);
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({}, this.onConnected, this.onError);
    }

  onConnected = () => {

    this.stompClient.subscribe(
      '/topic/' + this.currentUser.id + '/queue/messages',
      this.onMessageReceived
    );
  };
  onError = (err) => {
    console.log(err);
  };

  onMessageReceived = (msg) => {
    const notification = JSON.parse(msg.body);
    console.log(notification)
    if (notification.senderId === this.selectedUser?.id) {
      this.chatService.findChatMessage(notification.id).subscribe((result: MessageDTO) => {
         result.type = 'replies'
        this.messages.push(result);
      })
    } else {
      const user = this.users.find(usr => {
        return usr.id === notification.senderId
      })
      this.chatService.countNewMessages(user.id, this.currentUser.id).subscribe(newMessages => {
        Object.assign(user, {newMessages: newMessages})
      })
    }
  };

  getCurrentUser() {
    this.currentUser = JSON.parse(localStorage.getItem('loggedin_user'));
    console.log(this.currentUser);
  }
  getUsers() {
    this.userService.get().subscribe((result: Array<UserDto>) => {
      this.users = result;
      this.users.forEach(user => {
        this.chatService.countNewMessages(user.id, this.currentUser.id).subscribe(newMessages => {
             Object.assign(user, {newMessages: newMessages})
        })
      })
      console.log(this.users)
    }, error => {
        this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-id-card', 'An error occurred fetching contacts');
    });
  }

  openChat(user: UserDto) {
    console.log(user.username);
    this.showChatBox = true;
    this.selectedUser = user;
    this.chatService.findChatMessages(this.selectedUser.id, this.currentUser.id).subscribe((messages: Array<MessageDTO>) => {
      messages.forEach(message => {
        if (message.senderId === this.currentUser.id) {
          message.type = 'sent'
        } else if (message.senderId === this.selectedUser.id) {
          message.type = 'replies'
        }
         this.messages.push(message);
       })
      console.log(this.messages)
    })

  }

  backToContacts() {
    this.getUsers();
    this.showChatBox = false;
    this.selectedUser = null;
    this.messages = [];
  }

  sendNewMessage(messageText: HTMLTextAreaElement) {

    let message = new MessageDTO(messageText.value, this.currentUser.id, this.currentUser.username,
      this.selectedUser.id, this.selectedUser.username, new Date(), 'sent');

    this.stompClient.send('/app/chat', {}, JSON.stringify(message));
    this.messages.push(message);
    message = null;
    messageText.value = '';
  }
}
