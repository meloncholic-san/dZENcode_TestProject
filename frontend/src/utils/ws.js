
const isProd = import.meta.env.PROD;

let socket;
export const connectWS = () => {
    if (socket && socket.readyState <= 1) {
    // 0 = CONNECTING, 1 = OPEN
    return;
  }
  const wsURL = isProd
    ? "wss://dzencode-testproject.onrender.com"
    : "ws://localhost:8080";

  socket = new WebSocket(wsURL);
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


const subscribers = new Set();

export const subscribeToMessages = (callback) => {
  if (!socket) return;

  subscribers.add(callback);
  if (!socket._subscribed) {
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new_comment') {
          subscribers.forEach((cb) => cb(data.payload));
        }
      } catch (err) {
        console.error('Failed to parse WS message', err);
      }
    };
    socket._subscribed = true;
  }

  return () => {
    subscribers.delete(callback);
  };
};