import { Component, OnInit } from '@angular/core';
import {UserDto} from '../../dtos/user/user-dto';
import {UserService} from '../../services/crud/user.service';
import {MessageDTO} from '../../dtos/chat/message-dto';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public  showChatBox = false;

  public users: Array<UserDto>

  public selectedUser: UserDto

  public messages: Array<MessageDTO>
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.messages = new Array<MessageDTO>();
    this.messages.push(new MessageDTO('hello my friend chris', 'replies', 'unread', null, this.selectedUser?.id))
    this.messages.push(new MessageDTO('how are you ?', 'replies', 'unread', null, this.selectedUser?.id))
    this.getUsers();
  }

  getUsers() {
    this.userService.get().subscribe(data => {
      this.users = data;
    });
  }

  openChat(user: UserDto) {
    console.log(user.username);
    this.showChatBox = true;
    this.selectedUser = user;

  }

  backToContacts() {
    this.showChatBox = false;
  }

  sendNewMessage(messageText: HTMLTextAreaElement) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedin_user'));
    let message = new MessageDTO(messageText.value, 'sent', 'unread', loggedInUser?.id, this.selectedUser?.id)
    this.messages.push(message);
    message = null;
    messageText.value = '';
  }
}
