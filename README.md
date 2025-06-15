# 💬 Chat App Backend

<p align="center">
  <img src="https://img.shields.io/badge/node.js-%3E=14.x-brightgreen?logo=node.js&style=for-the-badge" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-4.x-lightgrey?logo=express&style=for-the-badge" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-%3E=4.0-green?logo=mongodb&style=for-the-badge" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.IO-4.x-red?logo=socket.io&style=for-the-badge" alt="Socket.IO" />
</p>

<p align="center">
  A real-time backend chat application built with Node.js, WebSocket (Socket.IO), JWT authentication, and MongoDB.
</p>

<p align="center">
  This is the <strong>backend</strong> for the real-time chat application:<br/>
  <a href="https://github.com/MatheusIshiyama/chat-app-frontend">chat-app-frontend</a>
</p>

---

## 🔧 Features

- ✅ JWT-based user authentication
- 🔌 Real-time communication with Socket.IO
- 🧠 MongoDB for storing users and messages
- ✨ Built with Javascript

---

## ⚙️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **Socket.IO**
- **JWT**

---

## 📁 Project Structure

```
chat-app-backend/
├── src/
│   ├── config/        # DB and environment config
│   ├── controllers/   # RESTful logic
│   ├── models/        # Mongoose schemas
│   ├── routes/        # Express route handlers
│   ├── sockets/       # WebSocket events
│   └── index.ts       # Entry point
├── .env.example       # Sample environment variables
└── package.json
```

---

## 🚀 Getting Started

### 1. Clone the project

```bash
git clone https://github.com/MatheusIshiyama/chat-app-backend.git
cd chat-app-backend
```

### 2. Install dependencies

```bash
npm install
# or
yarn
```

### 3. Create your `.env`

Copy `.env.example` to `.env` and configure:

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_jwt_secret
```

### 4. Run the server

Development mode:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

---

## 📡 REST Endpoints

| Method | Endpoint         | Description                   |
| ------ | ---------------- | ----------------------------- |
| POST   | `/auth`          | Authenticate and return token |
| GET    | `/user`          | Get logged-in user data       |
| POST   | `/user/register` | Create a new user             |
| GET    | `/user/confirm`  | Validate email from new user  |

> Protected routes require: `Authorization: Bearer <token>`

---

## 🔌 Socket.IO Events

| Event Name             | Direction       | Description                                                           |
| ---------------------- | --------------- | --------------------------------------------------------------------- |
| `sendFriendRequest`    | Client → Server | Send a friend request to a user by username                           |
| `declineFriendRequest` | Client → Server | Decline a received friend request                                     |
| `acceptFriend`         | Client → Server | Accept a received friend request                                      |
| `chat`                 | Client → Server | Request to open or create a chat with a user by username              |
| `newMessage`           | Client → Server | Send a new message in an existing chat                                |
| `chatId`               | Server → Client | Response with chat ID and friend name when `chat` is triggered        |
| `chatMessages`         | Server → Client | Regularly emits full message list of the current chat                 |
| `chatLastMessages`     | Server → Client | Periodically sends a summary of last messages from all chats          |
| `friendsRequests`      | Server → Client | Periodically sends list of friend requests                            |
| `friendList`           | Server → Client | Periodically sends current list of friends                            |
| `alert`                | Server → Client | Emits alert messages like "user not found" or "error to add yourself" |

---

## 📄 License

Licensed under the [MIT License](LICENSE).
