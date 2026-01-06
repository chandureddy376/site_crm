import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import io from 'socket.io-client';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class EchoService {
  public echo: Echo;
  userid: string;
  socket: any;
  private apiUrl = 'https://onesignal.com/api/v1/notifications';
  private apiKey = 'os_v2_app_wmo6uo5ypzcdngebcatf4asdcbyfrmx4esseqrur4jhe5fcddqkxakdff5n4hpikaz5v5gowy2khrxkgqasnyy5bww3z3lgt5lpl3oa'; // Replace with your actual API key

  constructor(private http: HttpClient) {
    (window as any).io = io;
    this.userid = localStorage.getItem('UserId');
    this.initEcho();

  }

  private initEcho() {
    this.echo = new Echo({
      broadcaster: 'socket.io',
      host: 'https://test-chat.right2shout.in:6002',
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      forceTLS: true,
      wssPort: 6002
    });

    this.socket = this.echo.connector.socket;

    // Log events
    this.socket.on('connect', () => {
      console.log('%c[Socket.IO] Connected', 'color: green');
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('%c[Socket.IO] Disconnected:', 'color: red', reason);
    });

    this.socket.on('reconnect_attempt', () => {
      console.log('%c[Socket.IO] Attempting to reconnect...', 'color: orange');
    });

    this.socket.on('reconnect', (attemptNumber: number) => {
      console.log('%c[Socket.IO] Reconnected after attempts:', 'color: green', attemptNumber);
    });

    this.socket.on('reconnect_error', (error: any) => {
      console.log('%c[Socket.IO] Reconnect error:', 'color: red', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.log('%c[Socket.IO] Reconnect failed', 'color: darkred');
    });
  }

  private notifiedMessages = new Set<string>();
  listenToDatabaseChanges(callback: (data: any) => void): any {
    let userid = localStorage.getItem('UserId');
    let channel = this.echo.channel('database-changes');
    channel.listen('.DatabaseNotification', (data: any) => {
      if (userid == data.Executive && (data.Call_status_new == 'Call Disconnected' || data.Call_status_new == 'Ringing' || data.Call_status_new == 'Call Connected' || data.Call_status_new == 'Answered' || data.Call_status_new == 'Executive Busy' || data.Call_status_new == 'BUSY')) {
        callback(data);
        return false;
      }

      const notificationMeta = data[0];
      const messageList = data[1];
      let checkedid = localStorage.getItem('checkedExecutive');


      if (userid == '1' && checkedid) {
        callback(data);
        return false
      }

      if (data && data.length > 0 && userid == data['0']['Receiver']) {
        // console.log('Received database notification:', data);
        const lastMessage = messageList[messageList.length - 1];
        if (lastMessage) {
          const uniqueId = `${lastMessage.item_id}`;
          if (!this.notifiedMessages.has(uniqueId)) {
            this.notifiedMessages.add(uniqueId);
            // console.log('triggered once 1',window.location.hostname)
            const hostname = window.location.hostname;
            const isLocalhost =
              hostname === 'localhost' ||
              hostname === '127.0.0.1' ||
              hostname.startsWith('192.168.') ||
              hostname.startsWith('10.') ||
              hostname.startsWith('172.16.');
            if (!isLocalhost) {
              this.sendNotification(data['0']['Receiver'], data['0']['Message'], data['0']['Sender']);
            }
          }
        }
        callback(data);
      } else if (data && data.length > 0 && userid == data['0']['Sender']) {
        callback(data);
      }
    });

    return channel
  }


  // listenToDatabaseChanges(): Observable<any> {
  //   const userid = localStorage.getItem('UserId');
  //   const channel = this.echo.channel('database-changes');

  //   return new Observable(observer => {
  //     const listener = (data: any) => {
  //       // Your existing logic, then emit data with observer.next()
  //       if(userid == data.Executive && (data.Call_status == 'Call Disconnected' || data.Call_status == 'Call Connected')){
  //         observer.next(data);
  //         return false;
  //       }

  //       const notificationMeta = data[0];
  //       const messageList = data[1];
  //       const checkedid = localStorage.getItem('checkedExecutive');

  //       if(userid == '1' && checkedid){
  //         observer.next(data);
  //         return false;
  //       }

  //       if (data && data.length > 0 && userid == data['0']['Receiver']) {
  //         const lastMessage = messageList[messageList.length - 1];
  //         if (lastMessage) {
  //           const uniqueId = `${lastMessage.item_id}`;
  //           if (!this.notifiedMessages.has(uniqueId)) {
  //             this.notifiedMessages.add(uniqueId);
  //             const hostname = window.location.hostname;
  //             const isLocalhost =
  //               hostname === 'localhost' ||
  //               hostname === '127.0.0.1' ||
  //               hostname.startsWith('192.168.') ||
  //               hostname.startsWith('10.') ||
  //               hostname.startsWith('172.16.');
  //             if (!isLocalhost) {
  //               this.sendNotification(data['0']['Receiver'], data['0']['Message'], data['0']['Sender']);
  //             }
  //           }
  //         }
  //         observer.next(data);
  //       } else if (data && data.length > 0 && userid == data['0']['Sender']) {
  //         observer.next(data);
  //       }
  //     };

  //     channel.listen('.DatabaseNotification', listener);

  //     // Cleanup function - unsubscribe handler
  //     return () => {
  //       channel.stopListening('.DatabaseNotification');
  //     };
  //   });
  // }


  sendNotification(receiverId, message, senderId) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Basic ${this.apiKey}`
    });
    const body = {
      app_id: 'b31dea3b-b87e-4436-9881-10265e024310', // Replace with your actual app ID
      // include_player_ids: [recipientUser],
      include_aliases: {
        external_id: [receiverId]
      },
      contents: {
        en: message
      },
      target_channel: 'push',
      headings: {
        // en: `New Message from ${senderName}`
        en: `New Message from Test user`
      },
      data: {
        type: 'chat_message',
        sender_id: senderId,
        receiver_id: receiverId
      }
    };
    console.log("Sending OneSignal API request body:", body); // Debug log  
    // return this.http.post(this.apiUrl, body, { headers }).toPromise();
    return this.http.post(this.apiUrl, body, { headers }).toPromise()
      .then(response => {
        console.log("OneSignal API Response:", response);
        return response;
      })
      .catch(error => {
        console.error("OneSignal API Error:", error);
        throw error; // Re-throw to propagate error
      });
  }

  disconnectSocket(): void {
    if (this.socket && this.socket.connected) {
      this.socket.disconnect();
      console.log('%c[Socket.IO] Disconnected manually', 'color: purple');
    } else {
      console.log('%c[Socket.IO] Socket already disconnected or not initialized', 'color: gray');
    }
  }

  // databaseChannel = this.echo.channel('database-changes');
  // stopListeningToDatabaseChanges(): void {
  // if (this.databaseChannel) {
  //   this.databaseChannel.stopListening('.DatabaseNotification');
  //   this.echo.leaveChannel('database-changes'); // Optional
  //   this.databaseChannel = null;
  //   console.log('%c[Echo] Stopped listening to database-changes', 'color: blue');
  // }
  stopListeningToDatabaseChanges() {
    this.echo.channel('database-changes').stopListening('.DatabaseNotification');
    console.log('%c[Echo] Stopped listening to database-changes', 'color: blue');
  }

  reconnectSocket() {
  if (this.socket) {
    console.log('%c[Socket.IO] Reconnecting...', 'color: blue');
    this.socket.connect();
  } else {
    console.log('%c[Socket.IO] Creating new Echo instance...', 'color: blue');
    this.initEcho();
  }
}
}