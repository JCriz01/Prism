# Real-time Messaging Implementation

This implementation adds real-time messaging capabilities to the Prism application using Socket.IO.

## Features Implemented

### Backend (API)

- **Socket.IO Server**: Real-time communication server with authentication
- **Message API Endpoints**: RESTful endpoints for message management
- **Authentication Middleware**: JWT-based authentication for Socket.IO connections
- **Channel Management**: Join/leave channels, send messages, typing indicators
- **Database Integration**: Messages stored in PostgreSQL via Prisma

### Frontend (Webapp)

- **Socket.IO Client**: Real-time connection to the server
- **Real-time Chat UI**: Updated ChatArea component with live messaging
- **Typing Indicators**: Shows when users are typing
- **Online Status**: Displays online users in FriendsSidebar
- **Message Grouping**: Groups consecutive messages from the same user
- **Auto-scroll**: Automatically scrolls to new messages

## Setup Instructions

### Backend Setup

1. **Install Dependencies** (already done):

   ```bash
   cd apps/prism-api
   npm install socket.io
   ```

2. **Environment Variables**:
   Make sure you have these environment variables set:

   ```
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:3001
   ```

3. **Start the Server**:
   ```bash
   cd apps/prism-api
   npm run dev
   ```

### Frontend Setup

1. **Install Dependencies** (already done):

   ```bash
   cd apps/prism-webapp-v2
   npm install socket.io-client
   ```

2. **Environment Variables**:
   Create a `.env` file in `apps/prism-webapp-v2/`:

   ```
   VITE_API_URL=http://localhost:3000
   ```

3. **Start the Frontend**:
   ```bash
   cd apps/prism-webapp-v2
   npm run dev
   ```

## API Endpoints

### Messages

- `GET /api/messages/channels/:channelId/messages` - Get messages for a channel
- `POST /api/messages/channels/:channelId/messages` - Send a message to a channel
- `GET /api/messages/channels` - Get user's channels
- `POST /api/messages/channels/dm` - Create a DM channel
- `GET /api/messages/users/online` - Get online users

### Socket.IO Events

#### Client to Server

- `join_channel` - Join a channel
- `leave_channel` - Leave a channel
- `send_message` - Send a message
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator

#### Server to Client

- `new_message` - New message received
- `user_typing` - User started typing
- `user_stopped_typing` - User stopped typing
- `joined_channel` - Successfully joined channel
- `left_channel` - Successfully left channel
- `error` - Error occurred

## Usage

1. **Login**: Use the existing login system to authenticate
2. **Select Channel**: Click on a channel in the ServerSidebar
3. **Send Messages**: Type in the message input and press Enter or click Send
4. **Real-time Updates**: Messages appear instantly for all users in the channel
5. **Typing Indicators**: See when other users are typing
6. **Online Status**: View online users in the FriendsSidebar

## Architecture

### Socket.IO Service (Backend)

- Handles authentication via JWT tokens
- Manages user connections and channel memberships
- Broadcasts messages to channel participants
- Implements typing indicators
- Stores messages in the database

### Socket.IO Client (Frontend)

- Connects to the server with authentication
- Manages channel subscriptions
- Handles real-time message updates
- Implements typing indicators
- Provides React hooks for easy integration

### Database Schema

The existing Prisma schema already includes:

- `Message` model with author, channel, content, timestamps
- `Channel` model with different types (text, voice, DM)
- `User` model with authentication fields
- Proper relationships and indexes

## Testing

To test the real-time messaging:

1. **Start both servers** (API and Frontend)
2. **Open two browser windows** with the application
3. **Login with different users** in each window
4. **Select the same channel** in both windows
5. **Send messages** from one window and see them appear instantly in the other
6. **Type in the message input** to see typing indicators
7. **Check the FriendsSidebar** to see online status

## Security Features

- **JWT Authentication**: All Socket.IO connections require valid JWT tokens
- **Channel Access Control**: Users can only join channels they have access to
- **Message Validation**: Messages are validated before storage
- **CORS Protection**: Proper CORS configuration for security

## Performance Considerations

- **Message Pagination**: Messages are loaded in pages of 50
- **Connection Management**: Automatic cleanup of disconnected users
- **Typing Debouncing**: Typing indicators are debounced to prevent spam
- **Query Optimization**: Database queries are optimized with proper indexes

## Future Enhancements

- **Message Reactions**: Add emoji reactions to messages
- **File Attachments**: Support for file uploads
- **Message Editing**: Edit and delete messages
- **Voice Messages**: Record and send voice messages
- **Push Notifications**: Browser notifications for new messages
- **Message Search**: Search through message history
- **Message Threading**: Reply to specific messages

