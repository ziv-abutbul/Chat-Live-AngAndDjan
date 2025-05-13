import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // 👈 בשביל *ngFor
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Pusher, { Channel } from 'pusher-js';
import { ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule], // 👈 הוסף גם את CommonModule
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  username = 'username';
  message = '';
  messages: any[] = [];

  private pusher!: Pusher;
  private channel!: Channel;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (!this.pusher) {
      this.pusher = new Pusher('db092ca32adf0b5ec230', {
        cluster: 'ap2'
      });

      this.channel = this.pusher.subscribe('chat');
      this.channel.bind('message', (data: any) => {
        this.messages.push(data);
        this.scrollToBottom();
      });
    }
  }
  scrollToBottom(): void {
    setTimeout(() => {
      this.myScrollContainer?.nativeElement?.scrollTo({
        top: this.myScrollContainer.nativeElement.scrollHeight,
        behavior: 'smooth'
      });
    }, 50);
  }
  sendMessage(): void {
    if (!this.message.trim()) return;

    this.http.post('http://localhost:8000/api/messages', {
      username: this.username,
      message: this.message
    }).subscribe(() => {
      this.message = '';
    });
  }
handleEnter(event: KeyboardEvent): void {
  if (!event.shiftKey) {
    event.preventDefault(); // מונע ירידת שורה
    this.submit(); // שליחת ההודעה
  }
}


  submit(): void {
    this.sendMessage();
  }
}
