export class MessageDTO {
  id: string;
  chatId: string
  content: string;
  type: string;
  status: string;
  senderId: string;
  senderName: string
  recipientId: string;
  recipientName: string;
  timestamp: Date;


  constructor(content: string, senderId: string, senderName: string, recipientId: string, recipientName: string, timestamp: Date, type: string) {
    this.content = content;
    this.senderId = senderId;
    this.senderName = senderName;
    this.recipientId = recipientId;
    this.recipientName = recipientName;
    this.timestamp = timestamp;
    this.type = type;
  }
}
