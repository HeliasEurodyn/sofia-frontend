export class MessageDTO {
  value: string;
  type: string;
  status: string;
  senderId: string;
  receiverId: string;


  constructor(value: string, type: string, status: string, senderId: string, receiverId: string) {
    this.value = value;
    this.type = type;
    this.status = status;
    this.senderId = senderId;
    this.receiverId = receiverId;
  }
}
