import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = import.meta.env.DEV
  ? '/ws'
  : `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'}/ws`;

export const createStompClient = ({ orderId, onMessage }) => {
  const client = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 5000,

    connectHeaders: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },

    onConnect: () => {
      client.subscribe(`/topic/order/${orderId}`, (message) => {
        const data = JSON.parse(message.body);
        onMessage(data);
      });
    },

    onStompError: (frame) => {
      console.error('소켓 에러:', frame);
    },
  });

  client.activate();
  return client;
};

export const createRiderCallsClient = ({ onCall }) => {
  const client = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 5000,

    connectHeaders: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },

    onConnect: () => {
      client.subscribe('/topic/rider-calls', (message) => {
        const data = JSON.parse(message.body);
        onCall(data);
      });
    },

    onStompError: (frame) => {
      console.error('라이더 콜 소켓 에러:', frame);
    },
  });

  client.activate();
  return client;
};
