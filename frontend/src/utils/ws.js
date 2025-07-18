let socket;

export const connectWS = () => {
  socket = new WebSocket('ws://localhost:8080');

  socket.onopen = () => {
    console.log(' WebSocket connected');
  };

  socket.onclose = () => {
    console.log(' WebSocket disconnected');
  };

  socket.onerror = (err) => {
    console.error('WebSocket error:', err);
  };
};

export const subscribeToMessages = (onMessage) => {
  if (!socket) return;
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'new_comment') {
        onMessage(data.payload);
      }
    } catch (err) {
      console.error('Failed to parse WS message', err);
    }
  };
};