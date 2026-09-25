

## Overview

X-Chat is a full-stack real-time chat application that enables instant messaging with features like:
...

---

- 🔐 Secure user authentication
- ⚡ Real-time message delivery
- 👥 User profiles and status
- 👥 Group chat and group management
- 📱 Responsive design for all devices
- 🔄 Message history persistence
- 🔊 Notification system

Built with modern web technologies to deliver a seamless chatting experience.

---

## Key Features

### Real-Time Communication

- Instant message delivery with Socket.io
- Typing indicators
- Online/offline status
- Read receipts
- Real-time group messaging

### User Experience

- Clean, modern interface
- Responsive design
- Dark/light mode
- Emoji support
- Message search
- User profile management

### Security

- JWT authentication
- Password encryption
- Protected routes
- Session management

### Advanced Functionality

- Message history
- User profiles
- Notification system
- Image/file sharing (via Cloudinary)

### Group Chat

- 👥 Create group conversations
- ➕ Add multiple users to a group
- 👤 Manage group members
- 🛡️ Group admin functionality
- ✏️ Update group name
- 🖼️ Update group profile image
- 💬 Send and receive group messages
- ⚡ Real-time group message delivery
- 📜 Group message history

---

## Tech Stack

### Frontend

- **React** with Vite
- **Socket.io-client** for real-time updates
- **Context API** for state management
- **Axios** for HTTP requests
- **Tailwind CSS** for styling
- **React Icons** for beautiful icons

### Backend

- **Node.js** with **Express**
- **Socket.io** for WebSocket communication
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Cloudinary** for media storage

### DevOps

- **Vercel** for frontend hosting
- **Render** for backend hosting
- **GitHub** for version control

---

## Project Structure

```groovy
x-chat/
├── client/                         # Frontend application
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── assets/                 # Images, icons
│   │   ├── components/             # Reusable components
│   │   │   ├── ChatContainer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── RightSidebar.jsx
│   │   ├── context/                # Global state
│   │   │   ├── AuthContext.jsx
│   │   │   └── chatContext.jsx
│   │   ├── lib/                    # Utilities
│   │   │   └── utils.js
│   │   ├── pages/                  # Route pages
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   └── ...                     # Other config files
│
├── server/                         # Backend application
│   ├── controllers/                # Business logic
│   │   ├── groupController.js
│   │   ├── messageController.js
│   │   └── userController.js
│   ├── lib/                        # Utilities
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   └── utils.js
│   ├── middleware/                 # Auth middleware
│   │   └── auth.js
│   ├── models/                     # Database models
│   │   ├── Group.js
│   │   ├── GroupMessage.js
│   │   ├── Message.js
│   │   └── User.js
│   ├── routes/                     # API routes
│   │   ├── groupRoute.js
│   │   ├── messageRoute.js
│   │   └── userRoutes.js
│   └── ...                         # Other server files
```
---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm (v9+)
- MongoDB Atlas account or local MongoDB
- Cloudinary account (for media storage)

### Installation

1. Clone the repository:
```console
git clone https://github.com/Parthmaheshwari2410/X-Chat.git
cd X-Chat
```
2. Install dependencies for both client and server:
```console
# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

3. Set up environment variables:
Create `.env` files in both `client` and `server` directories with required credentials.

### Environment Variables

**Server (.env)**
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
```

**Client (.env)**
```env
VITE_BACKEND_URL=http://localhost:5000
```

4. Start the development servers:
```console
# In one terminal (server)
cd server && npm run dev

# In another terminal (client)
cd client && npm run dev
```

---

## Usage
1. **Register/Login**: Create an account or log in
2. **Find Contacts**: Search for other users
3. **Start Chatting**: Select a contact and begin messaging
4. **Real-Time Updates**: See messages appear instantly
5. **Profile Management**: Update your profile picture and status
6. **Create Group**: Create a group conversation with multiple users
7. **Add Members**: Add users to an existing group
8. **Manage Group**: Group admins can manage group information and members
9. **Group Messaging**: Send and receive real-time messages with multiple users

---

## API Endpoints

### Authentication

| Method | Endpoint          | Description          |
|--------|-------------------|----------------------|
| POST   | /api/auth/register| Register new user    |
| POST   | /api/auth/login   | Login user           |

### Users
| Method | Endpoint          | Description          |
|--------|-------------------|----------------------|
| GET    | /api/users        | Get all users        |
| GET    | /api/users/:id    | Get specific user    |
| PUT    | /api/users/:id    | Update user          |

### Messages
| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| GET    | /api/messages/:chatId | Get chat messages |
| POST   | /api/messages      | Send new message    |

### Groups
| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
|POST	   | /api/groups	        | Create a new group | 
|GET	   | /api/groups	        | user's groups      |
|GET	   | /api/groups/:id	    | group details      |
|PUT	   | /api/groups/:id	    | Update group detail|

---


## Real-Time Events

### Emitted Events

- `new-user` - When a user connects
- `send-message` - When sending a message
- `typing` - When user is typing
- `stop-typing` - When user stops typing
- `group-message` - When sending a group message

### Received Events
- `receive-message` - When receiving a message
- `user-connected `- When another user is online
- `user-typing `- When another user is typing
- `group-message` - When receiving a group message

<img width="1416" height="727" alt="image" src="https://github.com/user-attachments/assets/642c4151-bcf8-4dc3-8605-ef9354f77616" />
1. Sign up Page









<img width="1345" height="675" alt="image" src="https://github.com/user-attachments/assets/97b70bc4-86fe-4516-99be-a334139edc98" />
2.Login Page 








<img width="1396" height="707" alt="Screenshot 2026-09-25 111228" src="https://github.com/user-attachments/assets/8c30bcc4-3a4f-4496-97a6-1906c44225b7" />
3.x chat page






<img width="1301" height="675" alt="Screenshot 2026-09-25 111124" src="https://github.com/user-attachments/assets/5b551bff-9b6f-490e-b59f-d762a885d338" />
4.Profile details page






<img width="1333" height="700" alt="Screenshot 2026-09-25 111047" src="https://github.com/user-attachments/assets/52a0f2b3-0575-4b4b-a779-4042d04b9c6f" />
5. one-to-one personChat page







<img width="1337" height="697" alt="Screenshot 2026-09-25 111107" src="https://github.com/user-attachments/assets/34b3743a-a922-4dbd-a539-6bcaa8a4ce89" />
6.Create Group page






<img width="1401" height="699" alt="image" src="https://github.com/user-attachments/assets/0721c132-8482-40d9-aa7a-df174806bec2" />
7.GroupChat Page 



