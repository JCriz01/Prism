# Prism - Discord Clone

A feature-rich Discord clone built with React, TypeScript, and TanStack Router.

## Features

### 🏠 **Server Management**

- **Server Sidebar**: Left sidebar showing all available servers
- **Server Selection**: Click on servers to view their channels
- **Channel Types**: Support for both text and voice channels
- **Expandable Servers**: Click the arrow to expand/collapse server channels

### 💬 **Chat System**

- **Real-time Messaging**: Send and receive messages in text channels
- **Message History**: View previous messages with timestamps
- **User Avatars**: Each message shows the sender's avatar and username
- **Message Input**: Type messages and press Enter to send

### 👥 **Friends & Users**

- **Friends Sidebar**: Right sidebar showing online friends
- **User Status**: See who's online, idle, DND, or offline
- **Friend Actions**: Message, call, or video call friends
- **User Roles**: Server members have different roles (owner, admin, moderator, member)

### 🎮 **Voice Features**

- **Voice Channels**: Join voice channels for audio communication
- **Voice Status**: See who's in voice channels
- **Mute/Deafen**: Visual indicators for muted or deafened users

### 🎨 **User Interface**

- **Discord-like Design**: Familiar dark theme matching Discord's aesthetic
- **Responsive Layout**: Adapts to different screen sizes
- **Smooth Animations**: Hover effects and transitions
- **Icon System**: Lucide React icons throughout the interface

### 🔐 **Authentication**

- **User Login**: Secure authentication system
- **User Registration**: Create new accounts
- **Session Management**: Persistent login sessions
- **User Profiles**: View and manage user information

## Getting Started

1. **Login/Register**: Start by creating an account or logging in
2. **Select a Server**: Choose a server from the left sidebar
3. **Join a Channel**: Click on a text channel to start chatting
4. **Send Messages**: Type in the message input and press Enter
5. **View Friends**: Click the Users icon to see your friends list
6. **Check Members**: View server members in the right sidebar

## Server Structure

### Gaming Hub 🎮

- `#general` - General gaming discussion
- `#gaming-chat` - Specific game discussions
- `🔊voice-chat` - Voice channel for gaming

### Study Group 📚

- `#general` - General study topics
- `#homework-help` - Help with assignments
- `🔊study-sessions` - Voice channel for study groups

### Music Lovers 🎵

- `#general` - General music discussion
- `#music-chat` - Music recommendations and discussions
- `🔊music-room` - Voice channel for music sharing

## User Roles

- **👑 Owner**: Full server control, can manage all settings
- **🛡️ Admin**: Can manage channels and moderate users
- **🔵 Moderator**: Can moderate chat and manage basic settings
- **👤 Member**: Regular user with basic permissions

## Technical Details

- **Frontend**: React 19 + TypeScript
- **Routing**: TanStack Router
- **State Management**: Zustand with Immer
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **UI Components**: Custom components with Radix UI primitives

## Future Enhancements

- [ ] Real-time messaging with WebSockets
- [ ] Voice and video calling
- [ ] File sharing and attachments
- [ ] Server creation and management
- [ ] Direct messaging between users
- [ ] Server roles and permissions
- [ ] Message reactions and emojis
- [ ] Server invites and discovery
- [ ] Mobile responsive design
- [ ] Push notifications

## Contributing

This is a demonstration project showing how to build a Discord-like interface. Feel free to extend it with additional features or improvements!
