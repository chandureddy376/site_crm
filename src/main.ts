import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// import Echo from 'laravel-echo';
// import * as io from 'socket.io-client';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

//   (window as any).io = io;
//   const userId = localStorage.getItem('UserId');

//   const echo = new Echo({
//   broadcaster: 'socket.io',
//   host: 'http://192.168.0.60:6001',
//   transports: ['websocket'],
//   reconnectionAttempts: 5,
//   reconnectionDelay: 1000,
// });

// echo.channel('database-changes')
//   .listen('.DatabaseNotification', (data: any) => {
//     if (userId === data['Receiver']) {
//       console.log('Received database notification:', data);
//     }
//   });

//   const socket = echo.connector.socket;

// // Log events
// socket.on('connect', () => {
//   console.log('%c[Socket.IO] Connected', 'color: green');
// });

// socket.on('disconnect', (reason: string) => {
//   console.log('%c[Socket.IO] Disconnected:', 'color: red', reason);
// });

// socket.on('reconnect_attempt', () => {
//   console.log('%c[Socket.IO] Attempting to reconnect...', 'color: orange');
// });

// socket.on('reconnect', (attemptNumber: number) => {
//   console.log('%c[Socket.IO] Reconnected after attempts:', 'color: green', attemptNumber);
// });

// socket.on('reconnect_error', (error: any) => {
//   console.log('%c[Socket.IO] Reconnect error:', 'color: red', error);
// });

// socket.on('reconnect_failed', () => {
//   console.log('%c[Socket.IO] Reconnect failed', 'color: darkred');
// });