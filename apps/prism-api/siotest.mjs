import { io } from 'socket.io-client';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtZjRvOHRiazAwMDZ1eWhuMGp2MmJ6c3QiLCJzdWIiOiJjbWY0bzh0YmswMDA2dXlobjBqdjJienN0IiwiaWF0IjoxNzYwNDkzMTM5NzY2LCJleHAiOjE3NjA0OTM3NDQ1NjZ9.cWpzOd1tPx3X9ZENZlYgnwmOFpR_aICold5_EXfWoD8';

const s = io('http://localhost:5200', {
  path: '/socket.io',
  transports: ['websocket', 'polling'], // allow either
  withCredentials: true,
  auth: {
    token,
  }, // add/remove if your server requires it
  timeout: 10000,
});

s.on('connect', () => {
  console.log('✅ connected', s.id);
  s.close(); // success — we can exit
});
s.on('connect_error', (err) => {
  console.error('❌ connect_error:', err?.message, err);
});
s.on('disconnect', (reason) => {
  console.log('disconnected:', reason);
});
