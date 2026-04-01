// import { Client } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';

// export const createStompClient = ({ orderId, onMessage }) => {
//   const client = new Client({
//     webSocketFactory: () => new SockJS('/ws'),
//     reconnectDelay: 5000,

//     connectHeaders: {
//       Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//     },

//     onConnect: () => {
//       console.log('소켓 연결됨');

//       client.subscribe(`/topic/delivery/${orderId}`, (message) => {
//         const data = JSON.parse(message.body);
//         onMessage(data);
//       });
//     },

//     onStompError: (frame) => {
//       console.error('소켓 에러:', frame);
//     },
//   });

//   client.activate();
//   return client;
// };
