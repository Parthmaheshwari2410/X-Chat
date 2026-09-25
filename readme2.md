Overview

x-Chat is a full-stack real-time chat application that enables instant messaging with features like:

🔐 Secure user authentication

⚡ Real-time message delivery

👥 User profiles and status

📱 Responsive design for all devices

🔄 Message history persistence

🔊 Notification system

Built with modern web technologies to deliver a seamless chatting experience.

Key Features

Real-Time Communication

Instant message delivery with Socket.io

Typing indicators

Online/offline status

Read receipts

User Experience

Clean, modern interface

Responsive design

Dark/light mode

Emoji support

Message search

Security

JWT authentication

Password encryption

Protected routes

Session management

Advanced Functionality

Message history

User profiles

Notification system

Image/file sharing (via Cloudinary)

Group Chat

👥 Create and manage group conversations

➕ Add multiple users to a group

👤 Manage group members

🛡️ Group admin functionality

✏️ Update group name

🖼️ Update group profile image

💬 Send and receive messages in group chats

🔄 Real-time group message delivery

📜 Group message history persistence

Tech Stack

Frontend

React with Vite

Socket.io-client for real-time updates

Context API for state management

Axios for HTTP requests

Tailwind CSS for styling

React Icons for beautiful icons

Backend

Node.js with Express

Socket.io for WebSocket communication

MongoDB with Mongoose

JWT for authentication

Bcrypt for password hashing

Cloudinary for media storage

DevOps

Vercel for frontend hosting

Render for backend hosting

Project Structure

x-chat/
├── client/                  # Frontend application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Images, icons
│   │   ├── components/     # Reusable components
│   │   │   ├── ChatContainer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── RightSidebar.jsx
│   │   ├── context/        # Global state
│   │   │   ├── AuthContext.jsx
│   │   │   └── ChatContext.jsx
│   │   ├── lib/            # Utilities
│   │   │   └── utils.js
│   │   ├── pages/          # Route pages
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   └── ...             # Other config files
│
├── server/                 # Backend application
│   ├── controllers/        # Business logic
│   │   ├── groupController.js
│   │   ├── messageController.js
│   │   └── userController.js
│   ├── lib/                # Utilities
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   └── utils.js
│   ├── middleware/         # Auth middleware
│   │   └── auth.js
│   ├── models/             # Database models
│   │   ├── Group.js
│   │   ├── GroupMessage.js
│   │   ├── Message.js
│   │   └── User.js
│   ├── routes/             # API routes
│   │   ├── groupRoute.js
│   │   ├── messageRoute.js
│   │   └── userRoutes.js
│   └── ...                 # Other server files

Getting Started

Prerequisites

Node.js (v18+)

npm (v9+)

MongoDB Atlas account or local MongoDB

Cloudinary account (for media storage)

Installation

Clone the repository:

git clone https://github.com/Parthmaheshwari2410/X-Chat.git
cd x-chat

Install dependencies for both client and server:

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install

Set up environment variables: Create .env files in both client and server directories with required credentials.

Environment Variables


Server (.env)

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000

Client (.env)

VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000


Start the development servers:

# In one terminal (server)
cd server && npm run dev

# In another terminal (client)
cd client && npm run dev

Usage


Register/Login: Create an account or log in

Find Contacts: Search for other users

Start Chatting: Select a contact and begin messaging

Real-Time Updates: See messages appear instantly

Profile Management: Update your profile picture and status

Create Group: Create a group conversation and add multiple members

Manage Group: Group admins can update group information and manage members

Group Messaging: Send and receive real-time messages with multiple users

API Endpoints


Authentication


MethodEndpointDescription



POST

/api/auth/register

Register new user

POST

/api/auth/login

Login user

Users

Method

Endpoint

Description

GET

/api/users

Get all users

GET

/api/users/:id

Get specific user

PUT

/api/users/:id

Update user

Messages

Method

Endpoint

Description

GET

/api/messages/:chatId

Get chat messages

POST

/api/messages

Send new message

Groups

Method

Endpoint

Description

POST

/api/groups

Create a new group

GET

/api/groups

Get user's groups

GET

/api/groups/:id

Get specific group

PUT

/api/groups/:id

Update group details

POST

/api/groups/:id/members

Add members to group

DELETE

/api/groups/:id/members/:userId

Remove member from group

Real-Time Events


Emitted Events


new-user - When a user connects

send-message - When sending a message

typing - When user is typing

stop-typing - When user stops typing

Received Events


receive-message - When receiving a message

user-connected - When another user connects

user-typing - When another user is typing

Deployment


Frontend


Deploy with Vercel (image)

Backend


Deploy to Render, Vercel, or other Node.js hosting services with MongoDB connection.
